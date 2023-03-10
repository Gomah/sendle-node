import { describe, expect, it } from 'vitest';
import { client } from './helpers';

describe('Quote', () => {
  it('should return a quote', async () => {
    const quote = await client.quote({
      delivery_suburb: 'Erskineville',
      delivery_postcode: '2043',
      pickup_suburb: 'Surry Hills',
      pickup_postcode: '2010',
      weight_value: '1',
      weight_units: 'kg',
    });

    expect(quote).toMatchSnapshot({
      eta: {
        date_range: expect.arrayContaining([expect.any(String)]),
        days_range: expect.arrayContaining([expect.any(Number)]),
        for_pickup_date: expect.any(String),
      },
      plan_name: expect.any(String),
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
