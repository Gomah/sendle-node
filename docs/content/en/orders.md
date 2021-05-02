---
title: Orders
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 3
category: 'Usage'
---

## Creating orders

```ts
const order = await client.orders.create({
  first_mile_option: 'pickup',
  description: 'Test',
  weight: {
    value: '1',
    units: 'kg',
  },
  customer_reference: '1337',
  metadata: {
    userId: 100,
  },
  sender: {
    contact: {
      name: 'Lex Luthor',
    },
    address: {
      address_line1: '123 Gotham Ln',
      suburb: 'Sydney',
      state_name: 'NSW',
      postcode: '2000',
      country: 'Australia',
    },
  },
  receiver: {
    instructions: 'Signature on Delivery',
    contact: {
      name: 'Clark Kent',
      email: 'clarkissuper@dailyplanet.xyz',
      company: 'Daily Planet',
    },
    address: {
      address_line1: '80 Wentworth Park Road',
      suburb: 'Darwin',
      state_name: 'NT',
      postcode: '0800',
      country: 'Australia',
    },
  },
});
```

The order will be rejected if the data fails validation and the client will throw Sendle's API error.

Identification matching the sender name on the label must be provided for the first three pickups of international parcels.

You can prevent duplicate orders by using an **Idempotency Key** header with this method.

### API Response

```json
{
  "order_id": "f5233746-71d4-4b05-bf63-56f4abaed5f6",
  "state": "Payment",
  "order_url": "https://api.sendle.com/api/orders/f5233746-71d4-4b05-bf63-56f4abaed5f6",
  "sendle_reference": "S3ND73",
  "tracking_url": "https://track.sendle.com/tracking?ref=S3ND73",
  "labels": null,
  "scheduling": {
    "is_cancellable": true,
    "pickup_date": "2015-11-24"
  },
  "description": "Kryptonite",
  "kilogram_weight": "1.0",
  "weight": {
    "units": "kg",
    "value": "1.0"
  },
  "volume": {
    "units": "m3",
    "value": "0.0"
  },
  "cubic_metre_volume": "0.01",
  "customer_reference": "SupBdayPressie",
  "metadata": {
    "your_data": "XYZ123"
  },
  "sender": {
    "contact": {
      "name": "Lex Luthor",
      "phone": "0412 345 678",
      "email": "me@lexluthor.com",
      "company": "LexCorp"
    },
    "address": {
      "address_line1": "123 Gotham Ln",
      "address_line2": null,
      "suburb": "Sydney",
      "state_name": "NSW",
      "postcode": "2000",
      "country": "Australia"
    },
    "instructions": "Knock loudly"
  },
  "receiver": {
    "contact": {
      "name": "Clark Kent",
      "phone": null,
      "email": "clarkissuper@dailyplanet.xyz",
      "company": "Daily Planet"
    },
    "address": {
      "address_line1": "80 Wentworth Park Road",
      "address_line2": null,
      "suburb": "Glebe",
      "state_name": "NSW",
      "postcode": "2037",
      "country": "Australia"
    },
    "instructions": "Give directly to Clark"
  },
  "route": {
    "description": "Sydney to Sydney",
    "type": "same-city",
    "delivery_guarantee_status": "eligible"
  },
  "price": {
    "tax": {
      "currency": "AUD",
      "amount": 0.81
    },
    "net": {
      "currency": "AUD",
      "amount": 8.14
    },
    "gross": {
      "currency": "AUD",
      "amount": 8.95
    }
  }
}
```

## Creating International Orders

```ts
const order = await client.orders.create({
  pickup_date: '2021-11-24',
  description: 'Kryptonite',
  weight: {
    value: '1',
    units: 'kg',
  },
  volume: {
    value: '0.01',
    units: 'm3',
  },
  customer_reference: 'SupBdayPressie',
  metadata: {
    your_data: 'XYZ123',
  },
  sender: {
    contact: {
      name: 'Lex Luthor',
      phone: '0412 345 678',
    },
    address: {
      address_line1: '123 Gotham Ln',
      suburb: 'Sydney',
      state_name: 'NSW',
      postcode: '2000',
      country: 'Australia',
    },
    instructions: 'Knock loudly',
  },
  receiver: {
    contact: {
      name: 'Clark Kent',
      email: 'clarkissuper@dailyplanet.xyz',
    },
    address: {
      address_line1: '445 Mount Eden Road',
      suburb: 'Auckland',
      postcode: '2025',
      country: 'New Zealand',
    },
    instructions: 'Give directly to Clark',
  },
  contents: {
    description: 'T-shirt',
    value: '20.00',
    country_of_origin: 'CN',
  },
});
```

The order will be rejected if the data fails validation and the client will throw Sendle's API error.

<alert>Sendle does not support International Orders sent from the United States yet.</alert>

All strings must be provided using Latin character sets, [find out more about Latin and non-Latin character sets](https://support.sendle.com/hc/en-us/articles/115002794031-Latin-and-non-Latin-characters).

Identification matching the sender name on the label must be provided for the first three pickups of international parcels.

You can prevent duplicate orders by using an **Idempotency Key** header with this method.

### API Response

```json
{
  "order_id": "f5233746-71d4-4b05-bf63-56f4abaed5f6",
  "state": "Payment",
  "order_url": "https://api.sendle.com/api/orders/f5233746-71d4-4b05-bf63-56f4abaed5f6",
  "sendle_reference": "S3ND73",
  "tracking_url": "https://track.sendle.com/tracking?ref=S3ND73",
  "labels": null,
  "scheduling": {
    "is_cancellable": true,
    "pickup_date": "2015-11-24"
  },
  "description": "Kryptonite",
  "kilogram_weight": "1.0",
  "cubic_metre_volume": "0.01",
  "customer_reference": "SupBdayPressie",
  "metadata": {
    "your_data": "XYZ123"
  },
  "sender": {
    "contact": {
      "name": "Lex Luthor",
      "phone": "0412 345 678",
      "email": "me@lexluthor.com"
    },
    "address": {
      "address_line1": "123 Gotham Ln",
      "address_line2": null,
      "suburb": "Sydney",
      "state_name": "NSW",
      "postcode": "2000",
      "country": "Australia"
    },
    "instructions": "Knock loudly"
  },
  "receiver": {
    "contact": {
      "name": "Clark Kent",
      "phone": null,
      "email": "clarkissuper@dailyplanet.xyz"
    },
    "address": {
      "address_line1": "445 Mount Eden Road",
      "address_line2": null,
      "suburb": "Auckland",
      "postcode": "2025",
      "state_name": null,
      "country": "New Zealand"
    },
    "instructions": "Give directly to Clark"
  },
  "contents": {
    "description": "T-shirt",
    "value": "20.00",
    "country_of_origin": "China"
  }
}
```

## View an order

```ts
const orderId = 'f5233746-71d4-4b05-bf63-56f4abaed5f6';
const order = await client.orders.get(orderId);
```

Viewing an order will give you all the details associated with an existing Sendle Booking. Important details in an order include:

- `order_id` (`String`)
  - The order’s individual identification in Sendle’s system.
- `state` (`String`)
  - Identifies the current state of the order. Check [Order States](#order-states) for more information.
- `status` (`String`)
  - Extra information about order state: a user-friendly `description`, and `last_changed_at` is the date that the order changed to the current state.
- `order_url` (`String`)
  - Specific url for order queries. After booking, this url becomes the point to check for updated information (state changes), labels and any other information related to the order.
- `sendle_reference` (`String`)
  - Reference ID for a Sendle Order. References begin with an “S” and are an alphanumeric string six or more characters in length.
- `tracking_url` (`String`)
  - The order’s public tracking page. Tracking page updates as the parcel progresses from sender to receiver. The url can be shared and viewed without a Sendle Account and contains no personal information about either party.
- `labels` (`Array<{ format: String; size: "a4" | "cropped"; url: string }>`)
  - Covered in detail in the [label section](https://api-doc.sendle.com/#getting-labels). After the initial order booking, this field may contain the labels or may contain null. If it contains null it means the labels are still being generated. In which case, you will need to re-fetch the order with a GET request, or use the label endpoint described in the link above.
- `scheduling` (`{ is_cancellable: boolean; pickup_date: string; picked_up_on: string | null; delivered_on: string | null; estimated_delivery_date_minimum: string; estimated_delivery_date_maximum: string; }`)
  - Information regarding the order’s delivery status and whether an order can be cancelled. Some fields return null depending on the state of the order.
  - `pickup_date` is the date the courier has been requested to pick up the parcel. `picked_up_on` is the date the parcel was actually picked up.
  - `estimated_delivery_date_minimum` and `estimated_delivery_date_maximum` can change depending on courier conditions.
- `route` (`{ description: string; type: 'same-city' | 'national' | 'remote' | 'export'; delivery_guarantee_status?: 'eligible' | 'ineligible'; }`)
  - Information about the route.
  - `description` is a human readable description of the route.
  - `type` is a machine readable version of the route type. One of `same-city`, `national`, `remote`, or `export`
  - `delivery_guarantee_status` only present when the account has enrolled in our [2-Day Delivery Guarantee](https://support.sendle.com/hc/en-us/articles/360002361031-Sendle-s-2-Day-Delivery-Guarantee). Values can be `eligible` or `ineligible`.
- `price` (`{ tax: { amount: number; currency: 'AUD' | 'USD'; }; gross: { amount: number; currency: 'AUD' | 'USD'; }; net: { amount: number; currency: 'AUD' | 'USD'; }; }`)
  - The amount charged for this order

### API Response

```json
{
  "order_id": "f5233746-71d4-4b05-bf63-56f4abaed5f6",
  "state": "Pickup",
  "status": {
    "description": "Pickup Scheduled",
    "last_changed_at": "2015-11-23"
  },
  "order_url": "https://api.sendle.com/api/orders/f5233746-71d4-4b05-bf63-56f4abaed5f6",
  "sendle_reference": "S3ND73",
  "tracking_url": "https://track.sendle.com/tracking?ref=S3ND73",
  "metadata": {
    "your_data": "XYZ123"
  },
  "labels": [
    {
      "format": "pdf",
      "size": "a4",
      "url": "https://api.sendle.com/api/orders/f5233746-71d4-4b05-bf63-56f4abaed5f6/labels/a4.pdf"
    },
    {
      "format": "pdf",
      "size": "cropped",
      "url": "https://api.sendle.com/api/orders/f5233746-71d4-4b05-bf63-56f4abaed5f6/labels/cropped.pdf"
    }
  ],
  "scheduling": {
    "is_cancellable": true,
    "pickup_date": "2015-11-24",
    "picked_up_on": null,
    "delivered_on": null,
    "estimated_delivery_date_minimum": "2015-11-26",
    "estimated_delivery_date_maximum": "2015-11-27"
  },
  "description": "Kryptonite",
  "kilogram_weight": "1.0",
  "weight": {
    "value": "1",
    "units": "kg"
  },
  "cubic_metre_volume": "0.01",
  "volume": {
    "value": "0.01",
    "units": "m3"
  },
  "customer_reference": "SupBdayPressie",
  "sender": {
    "contact": {
      "name": "Lex Luthor",
      "phone": "0412 345 678",
      "email": "lluthor@gmail.com",
      "sendle_id": "sendleID",
      "company": "LexCorp"
    },
    "address": {
      "address_line1": "123 Gotham Ln",
      "address_line2": null,
      "suburb": "Sydney",
      "state_name": "NSW",
      "postcode": "2000",
      "country": "Australia"
    },
    "instructions": "Knock loudly"
  },
  "receiver": {
    "contact": {
      "name": "Clark Kent",
      "phone": null,
      "email": "clarkissuper@dailyplanet.xyz",
      "company": "Daily Planet"
    },
    "address": {
      "address_line1": "80 Wentworth Park Road",
      "address_line2": null,
      "suburb": "Glebe",
      "state_name": "NSW",
      "postcode": "2037",
      "country": "Australia"
    },
    "instructions": "Give directly to Clark"
  },
  "route": {
    "description": "Sydney to Sydney",
    "type": "same-city",
    "delivery_guarantee_status": "eligible"
  },
  "price": {
    "tax": {
      "currency": "AUD",
      "amount": 0.81
    },
    "net": {
      "currency": "AUD",
      "amount": 8.14
    },
    "gross": {
      "currency": "AUD",
      "amount": 8.95
    }
  }
}
```

## Cancel an order

```ts
const orderId = 'a92df552-9b4f-41da-adc7-22a1b1ee79de';
const cancelledOrder = await client.orders.cancel(orderId);
```

As long as an order has not been collected by the courier, an order is cancellable. The value to review is:

- `is_cancellable` (`Boolean`)

  - If `true`, the order can be cancelled.

  If a booking has already been collected by the courier, a failure response (422) will be returned. `is_cancellable` is found in the `scheduling` section of the `JSON` along with delivery estimates. For an example of where `is_cancellable` can be seen, check the [View an Order](#view-an-order) section.

Note: the order is not deleted from the system and should still be viewable on your dashboard in the “cancelled” state.

## Order States

Sendle uses a handful of terms to describe an order’s state within the shipment process. These are similar to the states used in Sendle Dashboard to describe tracking progress, but are not an exact match.

```json
{
  "state": "Pickup",
  "status": {
    "description": "Pickup Scheduled",
    "last_changed_at": "2021-11-23"
  }
}
```

Orders start in `BOOKING`, and typically proceed through each of the states until they either reach DELIVERED or end in one of the failure states (eg `LOST`).

The state workflow of a successful delivery looks like this:

<alert>`BOOKING` -> `PICKUP` -> `IN_TRANSIT` -> `DELIVERED`</alert>

- **`Booking`**
  - Order is still being created and has not yet been scheduled for delivery.
- **`Pickup`**
  - Booking has been consigned and Courier is scheduled to pick up the parcel.
- **`Pickup Attempted`**
  - An unsuccessful parcel pickup was attempted.
- **`Transit`**
  - Parcel is in transit.
- **`Delivered`**
  - Parcel has been successfully delivered.
- **`Cancelled`**
  - A cancelled order.
- **`Unable to Book`**
  - An order which cannot be booked.
- **`Lost`**
  - An order marked as missing or lost.
- **`Return to Sender`**
  - An order which is being returned to the sender.

### Status

The `status` section gives a bit more information about the current state of the order.

It currently contains two fields:

- `description` is a user-friendly description of the order-state
- `last_changed_at` this is the date at which the order changed to this state

## Idempotency Key

Idempotency keys are used to prevent duplicate actions occurring when you did not intend for them to be duplicates.

When creating an order, there are multiple options:

- Passing the `idempotencyKey` arg.

```ts
const idempotencyKey = hash(`${customerId}-${orderId}`);

const order = await client.orders.create({
  ...data,
  idempotencyKey,
});
```

- Passing `customerId` & `orderId`, the library will generate an unique hash for you.

```ts
const order = await client.orders.create({
  ...data,
  customerId,
  orderId,
});
```

As a fallback, `sendle-node` generates an unique ID using [`nanoid`](https://github.com/ai/nanoid)

To learn more about Indempotency keys, visit the [Sendle API Documentation](https://api-doc.sendle.com/#idempotency-keys)
