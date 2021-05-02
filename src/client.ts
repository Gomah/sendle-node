import axios, { AxiosInstance } from "axios";
import { Sendle } from "./types";
import { OrderResource } from "./order";

export class SendleClient {
  private client: AxiosInstance;
  public orders: OrderResource;

  constructor(options: Sendle.ClientOptions) {
    const { sandbox = false, sendleId, apiKey } = options;

    const apiUrl = sandbox
      ? "https://sandbox.sendle.com/api"
      : "https://api.sendle.com/api";

    this.client = axios.create({
      auth: {
        username: sendleId,
        password: apiKey
      },
      baseURL: apiUrl
    });

    this.orders = new OrderResource(this.client);
  }

  async ping(): Promise<Sendle.PingResponse | never> {
    return this.client
      .get<Sendle.PingResponse>("/ping")
      .then(({ data }) => data);
  }

  async quote(args: Sendle.QuoteArgs): Promise<Sendle.Quote | never> {
    return this.client
      .get<Array<Sendle.Quote>>(`/quote`, {
        params: args
      })
      .then(({ data }) => data[0]);
  }

  async tracking(trackingReference: string) {
    return this.client
      .get<Sendle.Tracking>(`/tracking/${trackingReference}`)
      .then(({ data }) => data);
  }
}
