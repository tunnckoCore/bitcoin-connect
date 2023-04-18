// on the sever
import { serve } from "https://deno.land/std@0.158.0/http/server.ts";
import {
  generateTaprootAddressFromSignature,
  TAPROOT_MESSAGE,
} from "https://esm.sh/bitcoin-connect";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return Response.json(
      {},
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  let msg = url.searchParams.get("message");
  let sig = url.searchParams.get("signature");

  if (req.method === "GET" && url.pathname === "/" && !sig) {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html;charset=utf-8",
        ...corsHeaders,
      },
    });
  }

  if (req.method === "POST" && url.pathname === "/") {
    const { signature, message } = await req.json();
    sig = signature;
    msg = message;
  }

  if (sig && (!/0x.+/i.test(sig) || sig.length < 50)) {
    return Response.json(
      { error: "Provide a signature" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  const { taprootAddress: address, signature } =
    generateTaprootAddressFromSignature(sig, msg);

  msg = msg || TAPROOT_MESSAGE;
  const data = { address, signature, message: msg };

  return Response.json(
    { data },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
});
