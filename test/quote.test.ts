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
    });
  });
});
