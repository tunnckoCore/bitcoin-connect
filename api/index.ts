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

// on the client, the following 15 lines, and call it.
// async function signMessage() {
//   const [signer] = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });

//   const message = `0x${bytesToHex(getBytes(MESSAGE_TO_SIGN))}`;
//   const signature = await window.ethereum.request({
//     method: "personal_sign",
//     params: [message, signer],
//   });

//   return {
//     message,
//     signature,
//     signer,
//   };
// }

// // on the client on some button click
// signMessage().then(async ({ signature }) => {
//   const res = await fetch(`https://bitcoin.deno.dev?signature=${signature}`);
//   const { data, error } = await res.json();
//   if (!error) {
//     console.error(`Error: ${error}`);
//     return;
//   }

//   console.log("Congrats! You created a Bitcoin taproot wallet...");
//   console.log("from your Ethereum wallet & seed phrase.");
//   console.log("Wallet address:", data.address);
//   console.log("Signature:", signature);
// });
