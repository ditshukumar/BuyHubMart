# DeoDap integration

BuyHubMart now has the order data model and a server-side supplier adapter.

## Flow

1. Customer places a COD order in BuyHubMart.
2. The Motoko backend stores the order with supplier `DeoDap` and status `Awaiting DeoDap submission`.
3. Admin opens the dropshipping order queue and submits the order to `/api/deodap-forward`.
4. The Vercel function forwards the order to the approved DeoDap API without exposing the supplier credential to the browser.
5. The response is used to store the DeoDap order ID and tracking number.
6. Customer tracking reads the BuyHubMart order status.

## Required Vercel environment variables

- `DEODAP_ORDER_API_URL` — the exact order-creation endpoint supplied by DeoDap.
- `DEODAP_API_KEY` — the API credential supplied by DeoDap.

Do not put either value in frontend code, GitHub, CSV files, or the browser.

## Important

The adapter intentionally does **not** guess DeoDap's API URL, authentication scheme, SKU field, or request contract. Those values must match the API documentation/credentials provided by DeoDap. Until they are configured, the admin button returns a clear "not configured" response instead of pretending an order was submitted.

## CSV products

The supplied DeoDap CSV is in Shopify-style columns. It can be imported into the BuyHubMart catalog, but product import and supplier-order submission are separate concerns: each product should retain its DeoDap SKU/identifier so an order can later be mapped to the supplier's exact SKU.
