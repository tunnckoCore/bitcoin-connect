// on the sever
import { serve } from "https://deno.land/std@0.158.0/http/server.ts";
import {
  generateTaprootAddressFromSignature,
  TAPROOT_MESSAGE,
} from "https://esm.sh/bitcoin-connect";

serve(async (req) => {
  const url = new URL(req.url);
  let msg = url.searchParams.get("message");
  let sig = url.searchParams.get("signature");

  if (req.method === "GET" && url.pathname === "/" && !sig) {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html;charset=utf-8",
      },
    });
  }

  if (req.method === "POST" && url.pathname === "/") {
    const { signature, message } = await req.json();
    sig = signature;
    msg = message;
  }

  if (sig && (!/0x.+/i.test(sig) || sig.length < 50)) {
    return Response.json({ error: "Provide signature" }, { status: 500 });
  }

  const { taprootAddress: address, signature } =
    generateTaprootAddressFromSignature(sig, msg);

  msg = msg || TAPROOT_MESSAGE;
  const data = { address, signature, message: msg };

  return Response.json({ data }, { status: 200 });
});
