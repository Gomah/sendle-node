[![node-sendle](https://user-images.githubusercontent.com/2362138/116803978-9a5d1880-ab5e-11eb-881f-b5497f35f51c.png)](https://sendle-node.vercel.app/)

[![Build Status](https://github.com/gomah/sendle-node/workflows/CI/badge.svg)](https://github.com/gomah/sendle-node/actions?query=workflow%3ACI+branch%3Amain)
[![npm version][npm-version-src]][npm-version-href]
[![Dependencies][david-dm-src]][david-dm-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](https://opensource.org/licenses/MIT)

# Sendle Node.js library

In order to use this library, you need to have an account on <https://www.sendle.com/>. After registering, you will need the application credentials for your app.

## Supported platforms

This SDK supports **Node.js** version 10+.

We test the library against a selection of Node.js versions which we update over time. Please refer to [main.yml](https://github.com/gomah/sendle-node/blob/main/.github/main.yml) for the set of versions that are currently tested with CI.

If you find any compatibility issues, please [raise an issue](https://github.com/gomah/sendle-node/issues/new) in the repository.

## Installation

You need to be running at least Node.js 10 to use this library.

```bash
$ yarn add sendle-node
```

### Create a client

```ts
import { SendleClient } from 'sendle-node';

const client = new SendleClient({
  sendleId: 'yourSendleId',
  apiKey: 'yourApiKey',
  sandbox: true // default to false
});
```

See the [docs](https://sendle-node.vercel.app) for usage reference.

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Build the module using `yarn build` or `npm run build`
4. Start development server using `yarn dev` or `npm run dev`

## 📑 License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/dt/sendle-node.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/sendle-node
[npm-downloads-src]: https://img.shields.io/npm/v/sendle-node/latest.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/sendle-node
[david-dm-src]: https://david-dm.org/gomah/sendle-node/status.svg?style=flat-square
[david-dm-href]: https://david-dm.org/gomah/sendle-node
