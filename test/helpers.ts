import { SendleClient } from "../src";

export const client = new SendleClient({
  sendleId: process.env.SENDLE_ID as string,
  apiKey: process.env.SENDLE_API_KEY as string,
  sandbox: true
});
