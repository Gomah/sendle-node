---
title: Ping
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 6
category: 'Usage'
---

The ping endpoint has been specifically created so that you can test out some of the more administrative aspects of Sendle API’s functionality, without any risk of creating live orders on their system.

```ts
const ping = await client.ping();
```

**Response:**

```json
{
  "ping": "pong",
  "timestamp": "2021-05-01T15:52:48+10:00"
}
```
