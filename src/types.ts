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
   * Drop Off – Parcel has not yet been dropped off.
   * Dropped Off – Parcel left at a drop-off location.
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
    | 'Return to Sender'
    | 'Drop Off'
    | 'Dropped Off';

  /**
   * Pickup Attempted – Driver attempted to pickup the parcel.
   * Pickup	– Parcel successfully picked up.
   * Dropped Off	– Parcel has been left at a drop-off location.
   *
   * Info –	Information about the parcel. This can come from us or the delivery partner.
   * In Transit	– Parcel in transit between hub locations.
   * Local Delivery	– Delivery is being handled by a local partner (e.g. a local postal service or similar).
   * Parcel Measured	– Parcel's size has been checked.
   *
   * Out for Delivery	– Driver has the parcel and is taking it to be delivered.
   * Delivery Attempted –	Parcel delivery attempted, but unsuccessful.
   * Delivered –	Parcel successfully delivered.
   * Card Left –	Parcel delivery attempted, card left for receiver to arrange collection or re-delivery where available.
   * Left with Agent –	Parcel left with agent, this will be a parcel connect location, POPStation, or similar.
   *
   * Unable to Deliver –	Parcel could not be delivered.
   * Delivery Failed –	Delivery failed.
   * Damaged –	Parcel has been marked as damaged.
   * Return	– Parcel is being returned to sender.
   */
  export type ScanEvent =
    | 'Pickup Attempted'
    | 'Pickup'
    | 'Dropped Off'
    | 'Info'
    | 'In Transit'
    | 'Local Delivery'
    | 'Parcel Measured'
    | 'Out for Delivery'
    | 'Delivery Attempted'
    | 'Delivered'
    | 'Card Left'
    | 'Left with Agent'
    | 'Unable to Deliver'
    | 'Delivery Failed'
    | 'Damaged'
    | 'Return';

  export type Eta = {
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
  export type Route = {
    description: string;
    type: 'same-city' | 'national' | 'remote' | 'export';
    delivery_guarantee_status?: 'eligible' | 'ineligible';
  };

  export type Product = {
    /**
     * Whether this product only supports ATL (Authority To Leave delivery instructions).
     */
    atl_only: boolean;

    /**
     * The identifier for this product. To select this product for a request, send this product code.
     */
    code: string;

    /**
     * A human readable name for this shipping product, which should be displayed to the user.
     */
    name: string;

    /**
     * Whether the parcel will be picked up by a driver or dropped off by the shipper.
     */
    first_mile_option: 'pickup' | 'drop off';

    /**
     * The type of service for this product, for example standard, express.
     */
    service: 'standard' | 'express';
  };

  /**
   * Explains the components of the price. Elements underneath refer to different line items.
   * These items summed equal the gross price.
   */
  export type PriceBreakdown = {
    base: {
      amount: number;
      currency: string;
    };
    base_tax: {
      amount: number;
      currency: string;
    };
    cover: {
      amount: number;
      currency: string;
    };
    cover_tax: {
      amount: number;
      currency: string;
    };
    discount: {
      amount: number;
      currency: string;
    };
    discount_tax: {
      amount: number;
      currency: string;
    };
    fuel_surcharge: {
      amount: number;
      currency: string;
    };
    fuel_surcharge_tax: {
      amount: number;
      currency: string;
    };
  };

  /**
   * Explains the taxes applicable to the price.
   */
  export type TaxBreakdown = {
    gst?: {
      amount: number;
      currency: string;
      rate: number;
    };

    /**
     * Canadian Harmonized Sales Tax.
     */
    hst?: {
      amount: number;
      currency: string;
      rate: number;
    };

    /**
     * Québec Sales Tax.
     */
    qst?: {
      amount: number;
      currency: string;
      rate: number;
    };
  };

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
     * Timestamp marker for a tracking event scan, in the location the event happened.
     * This value does not contain a timezone.
     */
    local_scan_time?: string;

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
    requester?: string;
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
     * Used by Sendle to send tracking information, etc.
     * For senders: this can only be given when sending with a reseller account and is ignored otherwise.
     */
    email?: string;

    /**
     * Used by drivers to coordinate pickup or delivery.
     * It must be a valid local phone number (including area code), or fully qualified international number.
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
     * For Canada these are province/territory 2 letter representations such as ON and AB.
     * For United States these are the states 2 letter representation such as CA, NY.
     */
    state_name?: string;

    /**
     * Preferably an ISO 3166-1 alpha-2 country code. If absent, Sendle assumes orders are in Australia.
     * String value under 255 characters in length.
     */
    country?: 'Australia' | 'Canada' | 'United States' | string;
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
     * Which shipping product to use – for example `STANDARD-PICKUP`, `STANDARD-DROPOFF`, `EXPRESS-PICKUP`.
     * When not given, this is set to the default product for your plan and the selected first mile option.
     */
    product_code?: string;

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
      units: 'kg' | 'g' | 'lb' | 'oz' | string;
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
      units: 'l' | 'm3' | 'in3' | 'ft3' | string;
    };

    /**
     * The order's dimensions.
     * Only returned if dimensions are provided during order creation.
     */
    dimensions?: {
      /**
       * The unit of measurement for the dimensions.
       * Must be one of cm (centimetres) or in (inches).
       */
      units?: 'cm' | 'in' | string;

      /**
       * A decimal string value detailing the length of the parcel.
       */
      length?: string;

      /**
       * A decimal string value detailing the width of the parcel.
       */
      width?: string;

      /**
       * A decimal string value detailing the height of the parcel.
       */
      height?: string;
    };

    /**
     * Extra information that will appear on the label. For pick and pack, parcel identification, or anything else.
     * It must be under 255 characters in length.
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
       * Short message used as delivery instructions for courier.
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

      /**
       * A Harmonized System code for this item, appropriate for the destination country.
       * Single HS tarrif code only.
       * Must contain 6–10 digits with separating dots.
       */
      hs_code: string;
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

    route: Route;

    price_breakdown: PriceBreakdown;

    tax_breakdown: TaxBreakdown;

    /**
     * The amount charged for this order
     */
    price: {
      tax: {
        amount: number;
        currency: 'AUD' | 'CAD' | 'USD';
      };
      gross: {
        amount: number;
        currency: 'AUD' | 'CAD' | 'USD';
      };
      net: {
        amount: number;
        currency: 'AUD' | 'CAD' | 'USD';
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
     * Sendle currently supports `AU` for Australia, 'CA' for Canada, and `US` for United States.
     * If no `pickup_country` is provided this will default to `AU`.
     */
    pickup_country?: 'AU' | 'CA' | 'US';

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
     * Sendle currently supports `AU` for Australia, 'CA' for Canada, and `US` for United States.
     * If no `pickup_country` is provided this will default to `AU`.
     */
    delivery_country?: 'AU' | 'CA' | 'US';

    weight_value: string;

    weight_units: string;

    /**
     * Which shipping product to use – for example `STANDARD-PICKUP`, `STANDARD-DROPOFF`, `EXPRESS-PICKUP`.
     * When not given, this is set to the default product for your plan and the selected first mile option.
     */
    product_code?: string;

    /**
     * A decimal string value detailing the length of the parcel.
     */
    length_value?: string;

    /**
     * A decimal string value detailing the width of the parcel.
     */
    width_value?: string;

    /**
     * A decimal string value detailing the height of the parcel.
     */

    height_value?: string;

    /**
     * The unit of measurement for the dimensions.
     * Must be one of `cm` (centimetres) or `in` (inches).
     */
    dimension_units?: 'cm' | 'in' | string;

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
    volume_units?: 'l' | 'm3' | 'in3' | 'ft3' | string;

    [key: string]: string | undefined;
  }

  export interface Quote {
    quote: {
      /**
       * Pricing including taxes (if applicable).
       */
      gross: {
        amount: number;
        currency: 'AUD' | 'CAD' | 'USD';
      };

      /**
       * Pricing exclusive of taxes (if applicable).
       */
      net: {
        amount: number;
        currency: 'AUD' | 'CAD' | 'USD';
      };

      /**
       * Any applicable taxes.
       */
      tax: {
        amount: number;
        currency: 'AUD' | 'CAD' | 'USD';
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

    eta: Eta;

    route: Route;

    price_breakdown: PriceBreakdown;

    /**
     * The full tax breakdown
     */
    tax_breakdown: TaxBreakdown;
  }

  export interface ProductArgs {
    /**
     * The street address for the location.
     * Do not include the postcode, state, or suburb in this field. Best practice is to keep this under 40 chars due to label size limitations.
     * Addresses can be split over two lines. Only this line is mandatory, and will be shown above address_line2 on the shipping label.
     */
    sender_address_line1?: string;

    /**
     * Second line of the street address for the location. Best practice is to keep this under 40 chars due to label size limitations.
     */
    sender_address_line2?: string;

    /**
     * Suburb or town of the location.
     * This is required and must be given.
     * In certain regions the name here is validated against the postcode, so must be valid and match.
     * If we cannot service the area, the response will be a validation error stating it's not serviceable. If you receive an unserviceable error, you may want to check whether the location is also listed under a different name.
     */
    sender_suburb: string;

    /**
     * Postcode, postal code, or ZIP code of the location. For locations in Australia and the U.S. this is a four or five digit string. In Canada it's the six character postal code.
     * If we cannot service the area, the response will be a validation error stating it's not serviceable.
     */
    sender_postcode: string;

    /**
     * ISO 3166-1 alpha-2 country code. For example, AU, CA, or US.
     */
    sender_country: string;

    /**
     * The street address for the location.
     * Do not include the postcode, state, or suburb in this field. Best practice is to keep this under 40 chars due to label size limitations.
     * Addresses can be split over two lines. Only this line is mandatory, and will be shown above address_line2 on the shipping label.
     */
    receiver_address_line1?: string;

    /**
     * Second line of the street address for the location. Best practice is to keep this under 40 chars due to label size limitations.
     */
    receiver_address_line2?: string;

    /**
     * Suburb or town of the location.
     * This is required and must be given.
     * In certain regions the name here is validated against the postcode, so must be valid and match.
     * If we cannot service the area, the response will be a validation error stating it's not serviceable. If you receive an unserviceable error, you may want to check whether the location is also listed under a different name.
     */
    receiver_suburb: string;

    /**
     * Postcode, postal code, or ZIP code of the location. For locations in Australia and the U.S. this is a four or five digit string. In Canada it's the six character postal code.
     * If we cannot service the area, the response will be a validation error stating it's not serviceable.
     */
    receiver_postcode: string;

    /**
     * ISO 3166-1 alpha-2 country code. For example, AU, CA, or US.
     */
    receiver_country: string;

    /**
     * A decimal string value detailing how heavy the parcel is.
     */
    weight_value: string;

    /**
     * The unit of measurement for the weight.
     * Must be one of `kg` (kilograms), `lb` (pounds), `g` (grams) or `oz` (ounces).
     */
    weight_units: 'kg' | 'lb' | 'g' | 'oz' | string;

    /**
     * A decimal string value detailing the volume of the parcel.
     */
    volume_value?: string;

    /**
     * The unit of measurement for the volume.
     * Must be one of `l` (litres), `m3` (cubic metres), `in3` (cubic inches) or `ft3` (cubic feet).
     */
    volume_units?: 'l' | 'm3' | 'in3' | 'ft3' | string;

    /**
     * A decimal string value detailing the length of the parcel.
     */
    length_value?: string;

    /**
     * A decimal string value detailing the width of the parcel.
     */
    width_value?: string;

    /**
     * A decimal string value detailing the height of the parcel.
     */

    height_value?: string;

    /**
     * The unit of measurement for the dimensions.
     * Must be one of `cm` (centimetres) or `in` (inches).
     */
    dimension_units?: 'cm' | 'in' | string;

    [key: string]: string | undefined;
  }

  export interface ProductResponse {
    /**
     * The amount charged.
     */
    quote: Quote;

    /**
     * Explains the components of the price.
     * Elements underneath refer to different line items. These items summed equal the gross price.
     */
    price_breakdown: PriceBreakdown;

    /**
     * Explains the taxes applicable to the price.
     */
    tax_breakdown: TaxBreakdown;

    /**
     * Name of the plan this quote is for.
     */
    plan: string;

    eta: Eta;

    route: Route;

    product: Product;
  }
}
