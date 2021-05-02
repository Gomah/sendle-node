---
title: Tracking a Parcel
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 4
category: 'Usage'
---

Order tracking gives the public details associated with a **Sendle order** based on the order’s Sendle Reference as a search key (as `ref` below).

The API response returns two sections as described below. Order tracking does not contain personal location information.

```ts
const ref = 'S3ND73';

const tracking = await client.tracking(ref);
```

**Response:**

```json
{
  "state": "Delivered",
  "tracking_events": [
    {
      "event_type": "Pickup Attempted",
      "scan_time": "2015-11-23T01:04:00Z",
      "description": "We attempted to pick up the parcel but were unsuccessful",
      "reason": "Parcel not ready"
    },
    {
      "event_type": "Pickup",
      "scan_time": "2015-11-24T20:31:00Z",
      "description": "Parcel picked up"
    },
    {
      "event_type": "Info",
      "scan_time": "2015-11-25T01:04:00Z",
      "description": "In transit between locations"
    },
    {
      "event_type": "In Transit",
      "scan_time": "2015-11-25T01:14:00Z",
      "description": "In transit",
      "origin_location": "Sydney",
      "destination_location": "Brisbane"
    },
    {
      "event_type": "Info",
      "scan_time": "2015-11-26T19:46:00Z",
      "description": "Arrived at the depot for processing"
    },
    {
      "event_type": "Info",
      "scan_time": "2015-11-26T23:00:00Z",
      "description": "Parcel is loaded for delivery"
    },
    {
      "event_type": "Delivered",
      "scan_time": "2015-11-27T23:46:00Z",
      "description": "Parcel delivered"
    },
    {
      "event_type": "Info",
      "scan_time": "2015-11-27T23:47:00Z",
      "description": "Your parcel was signed for by JIMMY"
    }
  ],
  "origin": { "country": "AU" },
  "destination": { "country": "AU" }
}
```
