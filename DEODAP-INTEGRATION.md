# DeoDap dropshipping workflow

DeoDap has confirmed that its current dropshipping process is manual: there is no API or direct automatic order forwarding from BuyHubMart to DeoDap at this time.

## Current production flow

1. Customer places an order on BuyHubMart.
2. BuyHubMart stores the order with supplier `DeoDap` and status `Awaiting DeoDap submission`.
3. Admin opens the BuyHubMart order queue.
4. Admin copies/submits the order details through the DeoDap Order Panel.
5. DeoDap processes and white-label ships the product directly to the customer.
6. Admin records the DeoDap supplier order ID and tracking/AWB in BuyHubMart when provided.
7. Customer can use BuyHubMart order tracking to see the latest status entered by the admin.

## Commercial rules confirmed by DeoDap

- No inventory is required.
- No MOQ is required.
- White-label shipping is available.
- COD is available with an additional ₹25 COD charge.
- ₹4 packing charge applies per order.
- Return/RTO products are sent to the registered address; customer returns require an unboxing video for verification.
- Bulk orders can be submitted through an Excel sheet.
- Product catalog can be imported through the supplied CSV/catalog.

## Automation status

Do **not** add DeoDap API credentials or pretend that an API connection is live. DeoDap has explicitly confirmed that API integration is currently unavailable.

The existing `api/deodap-forward.js` adapter is retained only as a future integration point. It must remain unconfigured until DeoDap provides an official API endpoint, authentication method, and request documentation.

## Product mapping

When importing the DeoDap CSV, retain the DeoDap SKU/identifier on every product. This will make future API integration easier if DeoDap introduces an API.
