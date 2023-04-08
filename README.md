# bitcoin-connect

> Derive Bitcoin Taproot address, from an Ethereum signature. For example, a signature generated by your Injected Web3 wallet through the `personal_sign` RPC call. Useful for Bitcoin Ordinals.

For demo check out the hosted API and UI on https://bitcoin-connect.deno.dev.

Tweets about it:

- https://twitter.com/wgw_eth/status/1644576875845496833
- https://twitter.com/wgw_eth/status/1644557972889018369

## Table of Contents

- [As Library](#as-a-library)
- [API Usage](#api-usage)
- [Use as a user](#ui-usage)

### As a library

Check the `test.js` for an example.
More better test suite and docs - soon.

Basically, there are few steps:

1. Trigger a sign request to some Injected web browser wallet, like Metamask
2. Pass that signature string to the exported method.
3. It returns the `bip32` root, taproot child, the signature, and a taproot address.
4. Show the `taproot` address to your user. It can be used for Bitcoin Ordinals.

Basic "server-side" example

```js
import { generateTaprootAddressFromSignature } from "bitcoin-connect";

const result = generateTaprootAddressFromSignature("0xSignature here");

console.log(result);
console.log(result.taprootAddress);
```

This is also useful as a Serverless function, which I'll deploy soon.

It's also useful if you want to generate the same wallet address as the one that Generative.xyz's website is generating for your Ethereum Address.

I follow how they are doing it, but externalized it so there's no UI or React things.
If you can generate Ethereum signature in some other way, we include their message for convenience on `TAPROOT_MESSAGE` export.

For example,

```js
import {
  TAPROOT_MESSAGE,
  generateTaprootAddressFromSignature,
} from "bitcoin-connect";

const signature = requestEthereumPersonalSign(TAPROOT_MESSAGE);
const { taprootAddress } = generateTaprootAddressFromSignature(signature);

// you should get the same address as the one when you connect your wallet
// to the generative.xyz site by clicking Wallet there.
console.log(taprootAddress);
```

### API Usage

TODO

_(check the source code in `api/index.ts`)_

For development

```
yarn dev

# or from the `api` folder
# deno run -A --watch index.ts
```

For production

```
yarn deploy

# or from the `api` folder
# deployctl deploy --project=bitcoin-connect index.ts
```

### UI usage

TODO: More docs on the site, explaining everything and the API
