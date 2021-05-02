---
title: Quick start
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 1
category: 'Guide'
---

In order to use this library, you need to have an account on <https://www.sendle.com/> or their [Sandbox version](https://sandbox.sendle.com/users/sign_up). After registering, you will need the application credentials for your app.

## Supported platforms

This SDK supports **Node.js** version 10+.

We test the library against a selection of Node.js versions which we update over time. Please refer to [main.yml](https://github.com/gomah/sendle-node/blob/main/.github/main.yml) for the set of versions that are currently tested with CI.

If you find any compatibility issues, please [raise an issue](https://github.com/gomah/sendle-node/issues/new) in the repository.

## Installation

You need to be running at least Node.js 10 to use this library.

<code-group>
  <code-block label="Yarn" active>

```bash
yarn add sendle-node
```

  </code-block>
  <code-block label="NPM">

```bash
npm install sendle-node
```

  </code-block>
</code-group>

### Create a client

```ts
import { SendleClient } from 'sendle-node';

const client = new SendleClient({
  sendleId: 'yourSendleId',
  apiKey: 'yourApiKey',
  sandbox: true // default to false
});
```
