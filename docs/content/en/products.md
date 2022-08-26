---
title: Products
description: 'Unofficial Node.js library for the [Sendle](https://www.sendle.com/) API.'
position: 3
category: 'Usage'
---

## Get products

> Returns how much you'll expect to pay to send a parcel, given the shipping details and your current plan.

```ts
const args = {
  receiver_country: 'AU',
  receiver_postcode: '2000',
  receiver_suburb: 'SYDNEY',
  sender_country: 'AU',
  sender_postcode: '2000',
  sender_suburb: 'SYDNEY',
  weight_units: 'kg',
  weight_value: '1',
};

const products = await client.products.get(args);
```

### Required fields

- `receiver_country` (`String`)
  - ISO 3166-1 alpha-2 country code. For example, `AU`, `CA`, or `US`.
- `receiver_postcode` (`String`)
  - Postcode, postal code, or ZIP code of the location. For locations in Australia and the U.S. this is a four or five digit string. In Canada it's the six character postal code. If we cannot service the area, the response will be a validation error stating it's not serviceable.
- `receiver_suburb` (`String`)
  - Suburb or town of the location. In certain regions the name here is validated against the postcode, so must be valid and match. If we cannot service the area, the response will be a validation error stating it's not serviceable. If you receive an unserviceable error, you may want to check whether the location is also listed under a different name.
- `sender_country` (`String`)
  - ISO 3166-1 alpha-2 country code. For example, `AU`, `CA`, or `US`.
- `sender_postcode` (`String`)
  - Postcode, postal code, or ZIP code of the location. For locations in Australia and the U.S. this is a four or five digit string. In Canada it's the six character postal code. If we cannot service the area, the response will be a validation error stating it's not serviceable.
- `sender_suburb` (`String`)
  - Suburb or town of the location. In certain regions the name here is validated against the postcode, so must be valid and match. If we cannot service the area, the response will be a validation error stating it's not serviceable. If you receive an unserviceable error, you may want to check whether the location is also listed under a different name.
- `weight_units` (`String`)
  - The unit of measurement for the weight. Must be one of `kg` (kilograms), `lb` (pounds), `g` (grams) or `oz` (ounces).
- `weight_value` (`String`)
  - A decimal string value detailing how heavy the parcel is.

### Optional fields

- `sender_address_line1` (`String`)
  -  The street address for the location. Do not include the postcode, state, or suburb in this field. Best practice is to keep this under 40 chars due to label size limitations.  Addresses can be split over two lines. Only this line is mandatory, and will be shown above address_line2 on the shipping label.
- `sender_address_line2` (`String`)
  - Second line of the street address for the location. Best practice is to keep this under 40 chars due to label size limitations.
- `receiver_address_line1` (`String`)
  -  The street address for the location. Do not include the postcode, state, or suburb in this field. Best practice is to keep this under 40 chars due to label size limitations.  Addresses can be split over two lines. Only this line is mandatory, and will be shown above address_line2 on the shipping label.
- `receiver_address_line2` (`String`)
  - Second line of the street address for the location. Best practice is to keep this under 40 chars due to label size limitations.
- `volume_value` (`String`)
  - A decimal string value detailing the volume of the parcel.
- `volume_units` (`String`)
  - The unit of measurement for the volume. Most be one of `l` (litres), `m3` (cubic metres), `in3` (cubic inches) or `ft3` (cubic feet).
- `length_value` (`String`)
  - A decimal string value detailing the length of the parcel.
- `width_value` (`String`)
  - A decimal string value detailing the width of the parcel.
- `height_value` (`String`)
  - A decimal string value detailing the height of the parcel.
- `dimension_units` (`String`)
  - The unit of measurement for the dimensions. Must be one of `cm` (centimetres) or `in` (inches).

You'll receive one quote for each shipping product Sendle supports for the given route. Products are separated by details like service type (e.g. Standard vs Express) and first-mile option (whether a driver will pickup the parcel or the sender will drop it off at a valid Sendle location). When booking the delivery with a quote from this endpoint, you need to send the selected product code along with your order.

You can get quotes for both domestic and international shipments, but right now you can only send international parcels from Australia.

**Response:**

```json
[
  {
    "quote": {
      "gross": {
        "amount": 9.7,
        "currency": "AUD"
      },
      "net": {
        "amount": 8.82,
        "currency": "AUD"
      },
      "tax": {
        "amount": 0.88,
        "currency": "AUD"
      }
    },
    "plan": "Sendle Easy",
    "eta": {
      "days_range": [1, 3],
      "date_range": ["2022-08-30", "2022-09-01"],
      "for_send_date": "2022-08-29"
    },
    "route": {
      "type": "same-city",
      "description": "Sydney, Australia to Sydney, Australia"
    },
    "allowed_packaging": "any",
    "product": {
      "code": "STANDARD-PICKUP",
      "name": "Standard Pickup",
      "first_mile_option": "pickup",
      "service": "standard"
    },
    "price_breakdown": {
      "base": {
        "amount": 8.82,
        "currency": "AUD"
      },
      "base_tax": {
        "amount": 0.88,
        "currency": "AUD"
      },
      "cover": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "cover_tax": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "discount": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "discount_tax": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "fuel_surcharge": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "fuel_surcharge_tax": {
        "amount": 0.0,
        "currency": "AUD"
      }
    },
    "tax_breakdown": {
      "gst": {
        "amount": 0.88,
        "currency": "AUD",
        "rate": 0.1
      }
    }
  },
  {
    "quote": {
      "gross": {
        "amount": 9.7,
        "currency": "AUD"
      },
      "net": {
        "amount": 8.82,
        "currency": "AUD"
      },
      "tax": {
        "amount": 0.88,
        "currency": "AUD"
      }
    },
    "plan": "Sendle Easy",
    "eta": {
      "days_range": [1, 3],
      "date_range": ["2022-08-30", "2022-09-01"],
      "for_send_date": "2022-08-29"
    },
    "route": {
      "type": "same-city",
      "description": "Sydney, Australia to Sydney, Australia"
    },
    "allowed_packaging": "any",
    "product": {
      "code": "STANDARD-DROPOFF",
      "name": "Standard Drop Off",
      "first_mile_option": "drop off",
      "service": "standard"
    },
    "price_breakdown": {
      "base": {
        "amount": 8.82,
        "currency": "AUD"
      },
      "base_tax": {
        "amount": 0.88,
        "currency": "AUD"
      },
      "cover": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "cover_tax": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "discount": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "discount_tax": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "fuel_surcharge": {
        "amount": 0.0,
        "currency": "AUD"
      },
      "fuel_surcharge_tax": {
        "amount": 0.0,
        "currency": "AUD"
      }
    },
    "tax_breakdown": {
      "gst": {
        "amount": 0.88,
        "currency": "AUD",
        "rate": 0.1
      }
    }
  }
]
```
