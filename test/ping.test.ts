import { describe, it, expect } from 'vitest';
import { client } from './helpers';

describe('Ping', () => {
  it('should return a ping', async () => {
    const { ping } = await client.ping();

    expect(ping).toMatchSnapshot();
  });
});
