---
title: Getting a Label
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 5
category: 'Usage'
---

Sendle currently has two labels to choose from:

- A **cropped** label and
- An **A4-sized** (AU) or **letter** (US) sheet with a single label.

Both labels are formatted as PDFs, **this option is only valid once an order has been booked with a courier**.

```ts
const orderId = 'f5233746-71d4-4b05-bf63-56f4abaed5f6';
const size = 'a4'; // Available optins: 'a4', 'cropped' or 'letter' (US).

const label = await client.labels.get({
  orderId,
  size, // default 'a4'
});
```

### Usage in real-world application

```ts
import fastify from 'fastify';
import { SendleClient } from 'sendle-node';

const sendleClient = new SendleClient({
  sendleId: 'yourSendleId',
  apiKey: 'yourApiKey',
  sandbox: true, // default to false
  gotOptions: {}, // See https://github.com/sindresorhus/got#api
});

const app = fastify();

app.get('/labels/:shipmentId', async (request, reply) => {
  const { shipmentId } = request.params as Record<string, string>;

  const userId = getUserId(request);

  if (!userId) {
    reply.code(401);
    return new Error(`No token found`);
  }

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: shipmentId,
    },
  });

  if (!shipment) {
    reply.code(404);
    return new Error(`No shipment found for ${shipmentId}`);
  }

  const pdf = await sendleClient.labels.get({ orderId: shipment.orderId, size: 'cropped' });

  reply.type('application/pdf').code(200);
  
  // Uncomment the next line if you want to force pdf download:
  // reply.header('Content-disposition', `attachment; filename=${orderId}`);
  return pdf;
});
```
