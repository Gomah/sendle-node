import type { Sendle } from './types.js';
import got, { Got, Options as GotOptions } from 'got';
import hasha from 'hasha';
import hyperid from 'hyperid';

/*
 * Type aliases to support the generic request interface.
 */
type Method = 'get' | 'post' | 'delete';
type QueryParams = GotOptions['searchParams'];

export interface RequestParameters {
  path: string;
  method: Method;
  query?: QueryParams;
  body?: GotOptions['json'];
  headers?: GotOptions['headers'];
}

export class SendleClient {
  #got: Got;
  #version: string;
  #hyperIdInstance: hyperid.Instance;

  constructor(options: Sendle.ClientOptions) {
    const { sandbox = false, sendleId, apiKey, gotOptions = {} } = options;
    this.#version = require('../package.json').version;
    this.#hyperIdInstance = hyperid();

    const prefixUrl = sandbox ? 'https://sandbox.sendle.com/api/' : 'https://api.sendle.com/api/';

    this.#got = got.extend({
      prefixUrl,
      headers: {
        'user-agent': `sendle-node/${this.#version}`,
      },
      retry: {
        limit: 0,
      },
      username: sendleId,
      password: apiKey,
      ...gotOptions,
    });
  }

  /**
   * Sends a request.
   *
   * @param path
   * @param method
   * @param query
   * @param body
   * @param headers
   * @returns
   */
  public async request<Response>({
    path,
    method,
    query,
    body,
    headers = {},
  }: RequestParameters): Promise<Response> {
    // If the body is empty, don't send the body in the HTTP request
    const json = body !== undefined && Object.entries(body as any).length === 0 ? undefined : body;

    try {
      const response = await this.#got(path, {
        method,
        searchParams: query,
        json,
        headers: {
          ...headers,
        },
      }).json<Response>();

      return response;
    } catch (error) {
      throw error;
    }
  }

  async ping(): Promise<Sendle.PingResponse | never> {
    return this.request<Sendle.PingResponse>({ path: 'ping', method: 'get' });
  }

  async quote(args: Sendle.QuoteArgs): Promise<Sendle.Quote | never> {
    return this.request<Array<Sendle.Quote>>({
      path: 'quote',
      method: 'get',
      query: args,
    }).then((res) => res[0]);
  }

  async tracking(trackingReference: string): Promise<Sendle.Tracking> {
    return this.request<Sendle.Tracking>({
      path: `tracking/${trackingReference}`,
      method: 'get',
    });
  }

  public readonly orders = {
    get: async (orderId: string): Promise<Sendle.Order | never> => {
      return this.request<Sendle.Order>({ path: `orders/${orderId}`, method: 'get' });
    },

    create: async (args: Sendle.OrderArgs): Promise<Sendle.Order | never> => {
      const { customerId, orderId, idempotencyKey, ...body } = args;

      return this.request<Sendle.Order>({
        path: `orders`,
        method: 'post',
        body: {
          ...body,
          metadata: {
            customerId,
            orderId,
            ...body.metadata,
          },
        },
        headers: {
          'Idempotency-Key':
            idempotencyKey || (customerId && orderId)
              ? hasha(JSON.stringify(args))
              : this.#hyperIdInstance(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    },

    /**
     * As long as an order has not been collected by the courier, an order is cancellable.
     * The value to review is: `is_cancellable`. If true, the order can be cancelled.
     * If a booking has already been collected by the courier, a failure response (422) will be returned.
     * `is_cancellable` is found in the `scheduling` section of the `JSON` along with delivery estimates.
     */
    cancel: async (orderId: string): Promise<Sendle.CancelledOrder | never> => {
      return this.request<Sendle.CancelledOrder>({ path: `orders/${orderId}`, method: 'delete' });
    },
  };

  public readonly products = {
    /**
     * Get the products
     */
    get: async (args: Sendle.ProductArgs): Promise<Sendle.ProductResponse[] | never> => {
      return this.request<Array<Sendle.ProductResponse>>({
        path: 'products',
        method: 'get',
        query: args,
      });
    },
  };

  public readonly labels = {
    /**
     * Get the order label
     */
    get: async ({
      orderId,
      size = 'a4',
      format = 'pdf',
    }: {
      /** Order Id */
      orderId: string;
      /** Size */
      size?: 'a4' | 'cropped' | 'letter';
      /** Format. defaults to: 'pdf' */
      format?: string;
    }): Promise<string | never> => {
      return this.#got(`orders/${orderId}/labels/${size}.${format}`, {
        method: 'get',
      }).text();
    },
  };
}
