// Server-side DeoDap order adapter.
// Configure DEODAP_ORDER_API_URL and DEODAP_API_KEY in Vercel only after
// DeoDap gives you the approved API endpoint and authentication details.

function json(res, status, body) {
  res.status(status).json(body);
}

function normalizeOrder(body) {
  if (!body || typeof body !== "object") throw new Error("Invalid order payload");
  if (!body.orderId) throw new Error("orderId is required");
  if (!body.customer?.name || !body.customer?.phone || !body.customer?.address || !body.customer?.pincode) {
    throw new Error("Complete customer delivery details are required");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) throw new Error("At least one order item is required");

  return {
    orderId: String(body.orderId),
    customer: {
      name: String(body.customer.name),
      phone: String(body.customer.phone),
      address: String(body.customer.address),
      pincode: String(body.customer.pincode),
    },
    paymentMethod: String(body.paymentMethod || "COD"),
    items: body.items.map((item) => ({
      productId: String(item.productId),
      title: String(item.title),
      quantity: Number(item.quantity),
      sellingPrice: Number(item.sellingPrice),
    })),
    total: Number(body.total),
    currency: "INR",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  const endpoint = process.env.DEODAP_ORDER_API_URL;
  const apiKey = process.env.DEODAP_API_KEY;
  if (!endpoint || !apiKey) {
    return json(res, 503, {
      ok: false,
      configured: false,
      error: "DeoDap integration is not configured. Add the approved endpoint and API key in Vercel Environment Variables.",
    });
  }

  try {
    const payload = normalizeOrder(req.body);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return json(res, 502, { ok: false, configured: true, error: "DeoDap rejected the order", details: data });
    }

    const supplierOrderId = String(data.orderId ?? data.order_id ?? data.id ?? "");
    const trackingNumber = String(data.trackingNumber ?? data.tracking_number ?? data.awb ?? "");
    return json(res, 200, { ok: true, configured: true, supplierOrderId, trackingNumber, data });
  } catch (error) {
    return json(res, 400, { ok: false, configured: true, error: error?.message || "Supplier request failed" });
  }
}
