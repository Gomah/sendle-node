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
      },
    });
  });
});
