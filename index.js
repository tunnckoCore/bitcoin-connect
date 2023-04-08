import ecc from "@bitcoinerlab/secp256k1"; // uses @noble/secp256k1 v1
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import { keccak_256 } from "@noble/hashes/sha3";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

export { bitcoin, bip32, BIP32Factory, keccak_256, ecc };

export const TAPROOT_MESSAGE = `Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.`;
export const GENERATIVE_TAPROOT_MESSAGE = TAPROOT_MESSAGE;

export const generateTaprootAddress = generateTaprootAddressFromSignature;
export const generateTaproot = generateTaprootAddressFromSignature;
export const generateFrom = generateTaprootAddressFromSignature;
export const generate = generateTaprootAddressFromSignature;

export function generateTaprootAddressFromSignature(signature) {
  // returns Uint8Array
  const seed = getBytes(keccak_256(getBytes(signature, false)), false);

  // convert to Buffer, because bitcoin libs work with Buffers... ;/
  const root = bip32.fromSeed(Buffer.from(seed));

  const defaultPath = "m/86'/0'/0'/0/0";
  const taprootChild = root.derivePath(defaultPath);

  const result = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(taprootChild.publicKey),
  });

  return {
    bip32root: root,
    taprootChild,
    taprootAddress: result.address,
    p2trResult: result,
    signature,
  };
}

export function toXOnly(pubKey) {
  return pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
}

export function getBytes(value, copy) {
  if (value instanceof Uint8Array) {
    if (copy) {
      return new Uint8Array(value);
    }
    return value;
  }

  if (typeof value === "string" && value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
    const result = new Uint8Array((value.length - 2) / 2);
    let offset = 2;
    for (let i = 0; i < result.length; i++) {
      result[i] = parseInt(value.substring(offset, offset + 2), 16);
      offset += 2;
    }
    return result;
  }

  return value;
}
