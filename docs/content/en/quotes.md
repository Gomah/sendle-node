---
title: Quotes
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 2
category: 'Usage'
---

## Domestic Parcel Quote

```ts
const args = {
  pickup_suburb: 'Surry Hills',
  pickup_postcode: '2010',
  pickup_country: 'AU',
  delivery_suburb: 'Sydney'
  delivery_postcode: '2000',
  weight_value: '1',
  weight_units: 'kg',
  first_mile_option: 'pickup'
};

const quote = await client.quote(args);
```

### Required fields

- `pickup_suburb` (`String`)
  - Suburb must be real and match pickup postcode.
- `pickup_postcode` (`String`)
  - Post code for the pickup address.
- `delivery_suburb` (`String`)
  - Suburb must be real and match delivery postcode.
- `delivery_postcode` (`String`)
  - Post code for the delivery address.
- `weight_value` (`String`)
  - Decimal string value of the weight. Max weight is 25 kilograms for Australia and 70lb for United States.
- `weight_units` (`String`)
  - The unit of measurement. Most be one of `kg` (kilograms), `g` (grams), `lb` (pounds) or `oz` (ounces).

### Optional fields

- `pickup_country` (`String`)
  - ISO 3166 country code. Sendle currently supports `AU` for Australia and `US` for United States. If no `pickup_country` is provided this will default to `AU`.
- `delivery_country` (`String`)
  - ISO 3166 country code. Sendle currently supports `AU` for Australia and US for United States. If no `delivery_country` is provided this will default to `AU`.
- `volume_value` (`String`)
  - Decimal string value of the volume.
- `volume_units` (`String`)
  - The unit of measurement for the volume. Most be one of `l` (litres), `m3` (cubic metres), `in3` (cubic inches) or `ft3` (cubic feet).
- `first_mile_option` (`String`)
  - Whether the parcel will be picked up or dropped off. `pickup` for parcels that are being picked up, or `drop off` for drop off (or US) parcels.

The response also returns an approximate eta. The eta assumes the parcel is being picked up or dropped off on the next available business day. The eta section contains the approximate number of business days the parcel is likely to arrive, and the dates this corresponds to, as well as the assumed pickup/dropoff date.

The currency returned will be the relevant currency for the origin of the quote. When sending from Australia this will be `AUD` and when sending from the US this will be `USD`. This is the currency you will be charged in.

**Response:**

```json
{
  "quote": {
    "gross": {
      "amount": 13.95,
      "currency": "AUD"
    },
    "net": {
      "amount": 12.68,
      "currency": "AUD"
    },
    "tax": {
      "amount": 1.27,
      "currency": "AUD"
    }
  },
  "plan_name": "Premium",
  "eta": {
    "days_range": [0, 4],
    "date_range": ["2021-07-13", "2021-07-19"],
    "for_pickup_date": "2021-07-13"
  }
}
```

## International Parcel Quote

```ts
const args = {
  pickup_suburb: 'Surry Hills',
  pickup_postcode: '2010',
  delivery_country: 'FR',
  weight_value: '1',
  weight_units: 'kg',
};

const quote = await client.quote(args);
```

### Required fields

- `pickup_suburb` (`String`)
  - Suburb must be real and match pickup postcode.
- `pickup_postcode` (`String`)
  - Post code for the pickup address.
- `delivery_country` (`String`)
  - Full name or ISO Alpha 2 code of the country the parcel is being delivered to.
- `weight_value` (`String`)
  - Decimal string value of the weight. Max weight is 25 kilograms for Australia and 70lb for United States.
- `weight_units` (`String`)
  - The unit of measurement. Most be one of `kg` (kilograms), `g` (grams), `lb` (pounds) or `oz` (ounces).

### Optional fields

- `volume_value` (`String`)
  - Decimal string value of the volume.
- `volume_units` (`String`)
  - The unit of measurement for the volume. Most be one of `l` (litres), `m3` (cubic metres), `in3` (cubic inches) or `ft3` (cubic feet).

**Response:**

```json
{
  "quote": {
    "gross": {
      "amount": 38.55,
      "currency": "AUD"
    },
    "net": {
      "amount": 38.55,
      "currency": "AUD"
    },
    "tax": {
      "amount": 0.0,
      "currency": "AUD"
    }
  },
  "plan_name": "Easy",
  "eta": {
    "days_range": [12, 25],
    "date_range": ["2021-05-19", "2021-06-07"],
    "for_pickup_date": "2021-05-03"
  },
  "route": {
    "type": "export",
    "description": "Sydney, Australia to France"
  }
}
```
