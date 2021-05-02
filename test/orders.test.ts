import { Sendle } from "../src";
import { client } from "./helpers";

let orderId: string;
let trackingId: string;

describe("Orders", () => {
  it("should create a domestic order", async () => {
    const order = await client.orders.create({
      first_mile_option: "pickup",
      description: "Test",
      weight: {
        value: "1",
        units: "kg"
      },
      customer_reference: "1337",
      metadata: {
        userId: 100
      },
      sender: {
        contact: {
          name: "Lex Luthor"
        },
        address: {
          address_line1: "123 Gotham Ln",
          suburb: "Sydney",
          state_name: "NSW",
          postcode: "2000",
          country: "Australia"
        }
      },
      receiver: {
        instructions: "Signature on Delivery",
        contact: {
          name: "Clark Kent",
          email: "clarkissuper@dailyplanet.xyz",
          company: "Daily Planet"
        },
        address: {
          address_line1: "80 Wentworth Park Road",
          suburb: "Darwin",
          state_name: "NT",
          postcode: "0800",
          country: "Australia"
        }
      }
    });

    orderId = order.order_id;
    trackingId = order.sendle_reference;

    expect(order.state).toBe("Pickup");
  });

  it("should create an international order", async () => {
    const order = await client.orders.create({
      pickup_date: "2021-11-24",
      description: "Kryptonite",
      weight: {
        value: "1",
        units: "kg"
      },
      volume: {
        value: "0.01",
        units: "m3"
      },
      customer_reference: "SupBdayPressie",
      metadata: {
        your_data: "XYZ123"
      },
      sender: {
        contact: {
          name: "Lex Luthor",
          phone: "0412 345 678"
        },
        address: {
          address_line1: "123 Gotham Ln",
          suburb: "Sydney",
          state_name: "NSW",
          postcode: "2000",
          country: "Australia"
        },
        instructions: "Knock loudly"
      },
      receiver: {
        contact: {
          name: "Clark Kent",
          email: "clarkissuper@dailyplanet.xyz"
        },
        address: {
          address_line1: "445 Mount Eden Road",
          suburb: "Auckland",
          postcode: "2025",
          country: "New Zealand"
        },
        instructions: "Give directly to Clark"
      },
      contents: {
        description: "T-shirt",
        value: "20.00",
        country_of_origin: "China"
      }
    });

    expect(order.state).toBe("Pickup");
  });

  it("should return tracking for my order", async () => {
    const tracking = await client.tracking(trackingId);

    expect(tracking.destination).toEqual(
      expect.objectContaining<Sendle.Tracking["destination"]>({
        country: "AU"
      })
    );
  });

  it("should cancel an order", async () => {
    const order = await client.orders.cancel(orderId);

    expect(order.state).toBe("Cancelled");
  });
});
