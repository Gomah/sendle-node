import type { Options as GotOptions } from 'got';
export namespace Sendle {
  export interface ClientOptions {
    sandbox?: boolean;
    sendleId: string;
    apiKey: string;
    gotOptions?: GotOptions;
  }

  export interface PingResponse {
    ping: 'pong';
    timestamp: string;
  }

  /**
   * Order state
   * Booking – Order is still being created and has not yet been scheduled for delivery.
   * Pickup –	Booking has been consigned and Courier is scheduled to pick up the parcel.
   * Pickup – Attempted	An unsuccessful parcel pickup was attempted.
   * Transit –	Parcel is in transit.
   * Delivered –	Parcel has been successfully delivered.
   * Cancelled –	A cancelled order.
   * Unable – to Book	An order which cannot be booked.
   * Lost –	An order marked as missing or lost.
   * Return – to Sender	An order which is being returned to the sender.
   */
  export type OrderState =
    | 'Booking'
    | 'Pickup'
    | 'Pickup Attempted'
    | 'Transit'
    | 'Delivered'
    | 'Cancelled'
    | 'Unable to Book'
    | 'Lost'
    | 'Return to Sender';

  /**
   * Pickup	– Parcel successfully picked up.
   * Info –	Information received from courier.
   * In Transit	– Parcel in transit between courier hub locations.
   * Delivered –	Parcel successfully delivered.
   * Delivery Attempted –	Parcel delivery attempted, but unsuccessful.
   * Card Left –	Parcel delivery attempted, card left for receiver to arrange collection or re-delivery where available.
   * Left with Agent –	Parcel left with agent, this will be a parcel connect location, POPStation, or similar.
   * Delivery Failed –	Delivery failed.
   */
  export type ScanEvent =
    | 'Pickup'
    | 'Info'
    | 'In Transit'
    | 'Delivered'
    | 'Delivery Attempted'
    | 'Card Left'
    | 'Left with Agent'
    | 'Delivery Failed';

  export interface TrackingEvent {
    /**
     * Type of scan event. Options usually are Pickup, Info, or Delivered, though there are many tracking event types explained on the table below.
     */
    event_type: ScanEvent;

    /**
     * Timestamp marker for a tracking event scan. Scans are set in the **UTC** time zone.
     */
    scan_time: string;

    /**
     * A short description for the tracking event.
     */
    description: string;

    /**
     * Marks the departure location of a parcel from a physical hub within an order’s transit.
     */
    origin_location?: string;

    /**
     * Marks the arrival location of a parcel to a physical hub in the courier network.
     */
    destination_location?: string;

    /**
     * City, state, and country information from the tracking event (eg “SYDNEY, NSW, Australia”).
     */
    location?: string;

    /**
     * Some event types have a reason recorded (eg an attempted delivery will often record the reason why the parcel was not able to be picked up).
     */
    reason?: string;

    /**
     * Some event types have a requester (eg if the customer has contacted us with an issue).
     */
    requester: any;
  }

  export interface Tracking {
    /**
     * The current state of the order
     */
    state: OrderState;

    /**
     * The set of tracking scans from pickup to delivery (if any).
     */
    tracking_events: Array<TrackingEvent>;

    /**
     * The origin of the parcel, this currently only shows the country.
     * If there is no origin, this might be blank.
     */
    origin?: {
      country: string;
    };

    /**
     * Information regarding the order’s delivery status and whether an order can be cancelled.
     * Some fields return `null` depending on the state of the order.
     *
     * `pickup_date` is the date the courier has been requested to pick up the parcel. `picked_up_on` is the date the parcel was actually picked up.
     * `estimated_delivery_date_minimum` and `estimated_delivery_date_maximum` can change depending on courier conditions.
     */
    scheduling: {
      pickup_date: string;
      picked_up_on: string | null;
      delivered_on: string | null;
      estimated_delivery_date_minimum: string;
      estimated_delivery_date_maximum: string;
    };

    /**
     * Extra information about order state: a user-friendly `description`, and `last_changed_at` is the date that the order changed to the current state.
     */
    status?: {
      description: string;
      last_changed_at: string;
    };

    /**
     * The destination of the parcel, this currently only shows the country.
     * If there is no destination yet, this might be blank.
     */
    destination?: {
      country: string;
    };
  }

  export interface Contact {
    /**
     * It must be under 255 characters in length.
     */
    name: string;

    /**
     * Leave this empty - it will be populated with your email based on your account.
     */
    email?: string;

    /**
     * Used to coordinate pickup if the courier is outside attempting delivery.
     * It must be a valid Australian phone number (including area code), or fully qualified international number.
     * Examples: (02) 1234 1234, +1 519 123 1234, +61 (0)4 1234 1234.
     */
    phone?: string;

    /**
     * Business name for the Sender
     */
    company?: string;
  }

  export interface Address {
    /**
     * The street address where the parcel will be picked up or delivered.
     * Addresses can be split over two lines using `address_line1` and `address_line2`.
     * Only `address_line1` is mandatory. `line2` will be displayed below line1 on the parcel label.
     * Do not include postcode, state, or suburb in this field.
     * It must be under 255 char in length, but best practice to keep under 40 chars due to label-size limitations.
     */
    address_line1: string;

    /**
     * Second line of the street address for the pickup location.
     * It must be under 255 char in length, but best practice to keep under 40 chars due to label-size limitations.
     */
    address_line2?: string;

    /**
     * Suburb or town where the parcel is to be picked up or delivered.
     * If Sendle cannot service this location, response will be a validation error stating that the suburb is not serviceable.
     * Postcode and suburb must match. If they do not match, Sendle will return a set of alternates to choose from.
     * If receiving an unserviceable error, you may want to check if the location is also listed under a different suburb name.
     */
    suburb: string;

    /**
     * Postcode or ZIP code of pickup or destination location. It must be a four or five digit string for a valid location.
     * If we cannot pick up parcels from the area, the response will be a validation error stating the location is unserviceable.
     */
    postcode: string;

    /**
     * Must be the origin location’s state or territory.
     * For Australia these are: ACT, NSW, NT, QLD, SA, TAS, VIC, WA, with the long-form (i.e. “Northern Territory”) also accepted.
     * For United States these are the states 2 letter representation such as CA, NY.
     */
    state_name?: string;

    /**
     * Sendle only works within Australia & the United States. If absent, Sendle assumes orders are in Australia.
     * String value under 255 characters in length.
     * If included, must read “Australia” or “United States”.
     */
    country?: 'Australia' | 'United States' | string;
  }

  export interface OrderArgs {
    /**
     * If you choose `drop off` as your `first_mile_option`, please omit `pickup_date`.
     * Otherwise, if provided, the date must be at least one non-holiday, business day in the future.
     * If pickup date is omitted it will be set to the first available pickup date option and returned in the order payload on subsequent requests.
     */
    pickup_date?: string;

    /**
     * Use pickup to get your parcel picked up (when available) or `drop off` to drop it off
     * at the nearest drop off location in Australia or United States.
     * In the US, only drop off is available.
     * If `first_mile_option` is not specified, a default value of `pickup` will be used.
     */
    first_mile_option?: 'pickup' | 'drop off';

    /**
     * Description is used by the customer to track the parcel on Sendle Dashboard.
     * It does not show up on a label. It must be under 255 characters in length.
     */
    description: string;

    /**
     * Contains information pertaining to the weight of the package
     */
    weight: {
      /**
       * A string value detailing how heavy the parcel is.
       */
      value: string;

      /**
       * The unit of measurement for the weight.
       * Most be one of `kg` (kilograms), `g` (grams), `lb` (pounds) or `oz` (ounces).
       */
      units: string;
    };

    /**
     * Contains information pertaining to the volume of the package
     */
    volume?: {
      /**
       * A string value detailing the volume of the parcel is.
       */
      value: string;

      /**
       * The unit of measurement for the volume. Most be one of l (litres), m3 (cubic metres), in3 (cubic inches) or ft3 (cubic feet).
       */
      units: string;
    };

    /**
     * Reference will appear on the label for parcel identification. It must be under 255 characters in length.
     */
    customer_reference?: string;

    /**
     * Up to 1MB of JSON key/value pairs which will be stored for this order.
     * These are included when Viewing an Order and in some bulk reports available from the system.
     */
    metadata?: Record<string, unknown>;

    /**
     * Sender contact details, origin address, and pickup instructions
     */
    sender: {
      /**
       * Short message used as pickup instructions for courier.
       * It must be under 200 chars in length, but is recommended to be under 40 chars due to label-size limitations.
       */
      instructions?: string;

      contact: Contact;

      /**
       * Origin Address Details
       */
      address: Address;
    };

    receiver: {
      /**
       * Short message used as pickup instructions for courier.
       * It must be under 200 chars in length, but is recommended to be under 40 chars due to label-size limitations.
       */
      instructions: string;

      contact: Contact;

      address: Address;
    };

    /**
     * Idempotency keys are used to prevent duplicate actions occurring when you did not intend for them to be duplicates.
     */

    idempotencyKey?: string;

    /**
     * Provide both customerId & orderId to generate an `Idempotency key`
     */
    customerId?: string;
    orderId?: string;

    /**
     * Description, value & country of origin must be provided when creating an international order.
     */
    contents?: {
      /**
       * Detailed description of the parcel contents for customs purposes.
       * Must be between 3 and 300 characters in length. Examples: Shoes, hat, sunglasses
       */
      description: string;

      /**
       * The total value of the parcel contents in $AUD, the total value of the parcel cannot exceed $2,000AUD
       */
      value: string;

      /**
       * The country in which the goods where manufactured.
       * This can be either the country name or ISO Alpha 2 code.
       * Country names can vary between systems so it is recommended to use ISO country codes where possible.
       */
      country_of_origin: string;
    };
  }

  export interface Order {
    /**
     * The order’s individual identification in Sendle’s system.
     */
    order_id: string;

    /**
     * Sendle uses a handful of terms to describe an order’s state within the shipment process.
     * These are similar to the states used in Sendle Dashboard to describe tracking progress, but are not an exact match.
     *
     * Orders start in `BOOKING`, and typically proceed through each of the states until they either reach `DELIVERED` or end in one of the failure states (eg `LOST`).
     * The state workflow of a successful delivery looks like this:
     * `BOOKING` -> `PICKUP` -> `IN_TRANSIT` -> `DELIVERED`
     */
    state: OrderState;

    /**
     * Specific url for order queries.
     * After booking, this url becomes the point to check for updated information (state changes), labels and any other information related to the order.
     */
    order_url: string;

    /**
     * Packaging type
     */
    packaging_type: string;

    /**
     * Extra information about order state: a user-friendly `description`, and `last_changed_at` is the date that the order changed to the current state.
     */
    status?: {
      description: string;
      last_changed_at: string;
    };

    /**
     * Reference ID for a Sendle Order.
     * References begin with an “S” and are an alphanumeric string six or more characters in length.
     */
    sendle_reference: string;

    /**
     * The order’s public tracking page.
     * Tracking page updates as the parcel progresses from sender to receiver.
     * The url can be shared and viewed without a Sendle Account and contains no personal information about either party.
     */
    tracking_url: string;

    metadata: Record<string, unknown>;

    /**
     * After the initial order booking, this field may contain the labels or may contain null.
     * If it contains null it means the labels are still being generated.
     * In which case, you will need to re-fetch the order with a GET request, or use the label endpoint described in the link above.
     */
    labels: Array<{ format: 'pdf'; size: 'a4' | 'cropped'; url: string }>;

    /**
     * Information regarding the order’s delivery status and whether an order can be cancelled.
     * Some fields return `null` depending on the state of the order.
     *
     * `pickup_date` is the date the courier has been requested to pick up the parcel. `picked_up_on` is the date the parcel was actually picked up.
     * `estimated_delivery_date_minimum` and `estimated_delivery_date_maximum` can change depending on courier conditions.
     */
    scheduling: {
      is_cancellable: boolean;
      pickup_date: string;
      picked_up_on: string | null;
      delivered_on: string | null;
      estimated_delivery_date_minimum: string;
      estimated_delivery_date_maximum: string;
    };

    description: string;

    kilogram_weight?: string;
    weight?: { units: string; value: string };

    cubic_metre_volume?: string | null;
    volume?: { units: string; value: string };

    customer_reference: string;
    sender: {
      contact: Contact & {
        sendle_id?: string;
      };
      address: Address;
      instructions?: string;
    };
    receiver: {
      contact: Contact & {
        sendle_id?: string;
      };
      address: Address;
      instructions?: string;
    };

    /**
     * Information about the route.
     * `description` is a human readable description of the route.
     * `type` is a machine readable version of the route type. One of `same-city`, `national`, `remote`, or `export`
     * `delivery_guarantee_status` only present when the account has enrolled in our 2-Day Delivery Guarantee.
     * Values can be `eligible` or `ineligible`.
     */
    route: {
      description: string;
      type: 'same-city' | 'national' | 'remote' | 'export';
      delivery_guarantee_status?: 'eligible' | 'ineligible';
    };

    /**
     * The amount charged for this order
     */
    price: {
      tax: {
        amount: number;
        currency: 'AUD' | 'USD';
      };
      gross: {
        amount: number;
        currency: 'AUD' | 'USD';
      };
      net: {
        amount: number;
        currency: 'AUD' | 'USD';
      };
    };
  }

  export interface CancelledOrder {
    order_id: string;
    state: 'Cancelled';
    order_url: string;
    sendle_reference: string;
    tracking_url: string;
    customer_reference: string;
    cancelled_at: string;
    cancellation_message: string;
  }

  export interface QuoteArgs {
    /**
     * Suburb must be real and match pickup postcode
     */
    pickup_suburb: string;
    /**
     * Post code for the pickup address
     */
    pickup_postcode: string;

    /**
     * ISO 3166 country code.
     * Sendle currently supports `AU` for Australia and `US` for United States.
     * If no `pickup_country` is provided this will default to `AU`.
     */
    pickup_country?: 'AU' | 'US';

    /**
     * Suburb must be real and match delivery postcode.
     */
    delivery_suburb: string;

    /**
     * Post code for the delivery address.
     */
    delivery_postcode: string;

    /**
     * ISO 3166 country code.
     * Sendle currently supports `AU` for Australia and `US` for United States.
     * If no `pickup_country` is provided this will default to `AU`.
     */
    delivery_country?: 'AU' | 'US';

    weight_value: string;

    weight_units: string;

    /**
     * Whether the parcel will be picked up or dropped off.
     * `pickup` for parcels that are being picked up, or `drop off` for drop off (or US) parcels.
     */
    first_mile_option?: 'drop off' | 'pickup';

    /**
     * Decimal string value of the volume.
     */
    volume_value?: string;

    /**
     * The unit of measurement for the volume.
     * Most be one of `l` (litres), `m3` (cubic metres), in`3 (cubic inches) or `ft3` (cubic feet).
     */
    volume_units?: string;

    [key: string]: string | undefined;
  }

  export interface Quote {
    quote: {
      /**
       * Pricing including taxes (if applicable).
       */
      gross: {
        amount: number;
        currency: 'AUD' | 'USD';
      };

      /**
       * Pricing exclusive of taxes (if applicable).
       */
      net: {
        amount: number;
        currency: 'AUD' | 'USD';
      };

      /**
       * Any applicable taxes.
       */
      tax: {
        amount: number;
        currency: 'AUD' | 'USD';
      };
    };

    /**
     * The name of the plan for which this is the price.
     */
    plan_name: string;

    /**
     * The name of the packaging supported for this quote
     */
    allowed_packaging: string;

    /**
     * Section: contains eta-relevant data
     */
    eta: {
      /**
       * How long delivery is likely to take expressed as a range. Always returned as an array.
       * If there are two values, these are the min and max estimated days it will take.
       * If only one number - it’s estimated to take about this long.
       */
      days_range: Array<number>;

      /**
       * Actual business dates that the eta days_range match, if pickup occurs on the given pickup_date.
       */
      date_range: Array<string>;

      /**
       * All etas are relevant to a given pickup-date.
       * Sendle assumes the next available business day - and this is the pickup-date we are estimating based off.
       */
      for_pickup_date: string;
    };

    /**
     * Information about the route.
     * `description` is a human readable description of the route.
     * `type` is a machine readable version of the route type. One of `same-city`, `national`, `remote`, or `export`
     * `delivery_guarantee_status` only present when the account has enrolled in our 2-Day Delivery Guarantee.
     * Values can be `eligible` or `ineligible`.
     */
    route: {
      description: string;
      type: 'same-city' | 'national' | 'remote' | 'export';
      delivery_guarantee_status?: 'eligible' | 'ineligible';
    };
  }
}
