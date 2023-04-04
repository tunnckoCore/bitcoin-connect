import assert from "node:assert";
import { generateTaprootAddressFromSignature } from "./index.js";

// The Generative.xyz's default message.
const TAPROOT_MESSAGE = `Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.`;

// wgw.eth's (0xa20c07f94a127fd76e61fbea1019cce759225002) signature of the message.
// https://etherscan.io/verifySig/16514
const TAPROOT_MESSAGE_SIG = `0x849cdb2c6ab66269d95e219ab99d12762c6caad49f6b0fa569289935c21179242747640b69be801f8660b17cba85bb37e8897be01830c6442b95fd6bc69038991b`;

const expectedAddress = `bc1pqh4m8gkmch9knq4hlfqk3fgz7da5axk77ngev2cu97ac7ag0lxwqw8ddgv`;
const result = generateTaprootAddressFromSignature(TAPROOT_MESSAGE_SIG);

assert(result.taprootAddress === expectedAddress, "wrong taproot address");

console.log({
  taprootAddress: result.taprootAddress,
  expectedAddress,
});
