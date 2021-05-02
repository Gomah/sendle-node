import { AxiosInstance } from "axios";
import hasha from "hasha";
import { nanoid } from "nanoid";
import { Sendle } from "./types";

export class OrderResource {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get(orderId: string): Promise<Sendle.Order | never> {
    return this.client
      .get<Sendle.Order>(`/orders/${orderId}`)
      .then(({ data }) => data);
  }

  async create(args: Sendle.OrderArgs): Promise<Sendle.Order | never> {
    const { customerId, orderId } = args;
    let { idempotencyKey } = args;

    if (!idempotencyKey) {
      idempotencyKey =
        customerId && orderId ? hasha(`${customerId}-${orderId}`) : nanoid();
    }

    return this.client
      .post<Sendle.Order>(`/orders`, args, {
        headers: {
          "Idempotency-Key": idempotencyKey,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
      .then(({ data }) => data);
  }

  /**
   * As long as an order has not been collected by the courier, an order is cancellable.
   * The value to review is: `is_cancellable`. If true, the order can be cancelled.
   * If a booking has already been collected by the courier, a failure response (422) will be returned.
   * `is_cancellable` is found in the `scheduling` section of the `JSON` along with delivery estimates.
   */
  async cancel(orderId: string): Promise<Sendle.CancelledOrder> {
    return this.client
      .delete<Sendle.CancelledOrder>(`/orders/${orderId}`)
      .then(({ data }) => data);
  }
}
