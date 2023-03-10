import { describe, expect, it } from 'vitest';
import { client } from './helpers';

describe('Products', () => {
  it('should get a list of products', async () => {
    const products = await client.products.get({
      receiver_country: 'AU',
      receiver_postcode: '2000',
      receiver_suburb: 'SYDNEY',
      sender_country: 'AU',
      sender_postcode: '2000',
      sender_suburb: 'SYDNEY',
      weight_units: 'kg',
      weight_value: '1',
    });

    expect(products[0]).toMatchSnapshot({
      eta: {
        date_range: expect.any(Array),
        days_range: expect.any(Array),
        for_send_date: expect.any(String)
      },
      price_breakdown: {
        base: {
          amount: expect.any(Number),
        },
        base_tax: {
          amount: expect.any(Number),
        },
        fuel_surcharge: {
          amount: expect.any(Number),
        },
        fuel_surcharge_tax: {
          amount: expect.any(Number),
        },
      },
      tax_breakdown: {
        gst: {
          amount: expect.any(Number),
        },
      },
      quote: {
        gross: {
          amount: expect.any(Number),
        },
        net: {
          amount: expect.any(Number),
        },
        tax: {
          amount: expect.any(Number),
        },
      },
    });
  });
});
