import { describe, it, expect } from 'vitest';
import { client } from './helpers';
let orderId: string;
let trackingId: string;

describe('Orders', () => {
  it('should create a domestic order', async () => {
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

    orderId = order.order_id;
    trackingId = order.sendle_reference;

    expect(order).toMatchSnapshot({
      order_id: expect.any(String),
      order_url: expect.any(String),
      sendle_reference: expect.any(String),
      tracking_url: expect.any(String),
      labels: expect.any(Array),
      scheduling: {
        pickup_date: expect.any(String),
        estimated_delivery_date_minimum: expect.any(String),
        estimated_delivery_date_maximum: expect.any(String),
      },
      sender: {
        contact: {
          email: expect.any(String),
          sendle_id: expect.any(String),
        },
      },
      price: {
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
    });
  });

  it('should create an international order', async () => {
    const order = await client.orders.create({
      pickup_date: '2023-11-24',
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
        country_of_origin: 'China',
        hs_code: '610910',
      },
    });

    expect(order).toMatchSnapshot({
      order_id: expect.any(String),
      order_url: expect.any(String),
      sendle_reference: expect.any(String),
      tracking_url: expect.any(String),
      labels: expect.any(Array),
      scheduling: {
        pickup_date: expect.any(String),
        estimated_delivery_date_minimum: expect.any(String),
        estimated_delivery_date_maximum: expect.any(String),
      },
      sender: {
        contact: {
          email: expect.any(String),
          sendle_id: expect.any(String),
        },
      },
      price: {
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

  it('should return tracking for my order', async () => {
    const tracking = await client.tracking(trackingId);

    expect(tracking).toMatchSnapshot({
      scheduling: {
        pickup_date: expect.any(String),
        estimated_delivery_date_minimum: expect.any(String),
        estimated_delivery_date_maximum: expect.any(String),
      },

      status: {
        description: expect.any(String),
        last_changed_at: expect.any(String),
      },
    });
  });

  it('should return A4 label for my order', async () => {
    const label = await client.labels.get({ orderId });

    expect(label).toContain('%PDF-1.4\n');
  });

  it('should cancel an order', async () => {
    const order = await client.orders.cancel(orderId);

    expect(order).toMatchSnapshot({
      order_id: expect.any(String),
      cancelled_at: expect.any(String),
      cancellation_message: expect.any(String),
      order_url: expect.any(String),
      sendle_reference: expect.any(String),
      tracking_url: expect.any(String),
    });
  });
});
