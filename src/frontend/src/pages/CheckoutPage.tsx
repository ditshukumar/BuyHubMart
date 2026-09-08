import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { clearCart, getCart, type CartItem } from "@/lib/cart";
import { useCreateOrder } from "@/hooks/useBackend";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, MapPin, ShoppingBag, Truck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [items, setItems] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => setItems(getCart()), []);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").replace(/\D/g, "");
    const address = String(form.get("address") || "").trim();
    const pincode = String(form.get("pincode") || "").replace(/\D/g, "");
    if (!name || phone.length !== 10 || !address || pincode.length !== 6) {
      toast.error("Please enter a valid name, 10-digit mobile number, address and 6-digit PIN code.");
      return;
    }
    try {
      const order = await createOrder.mutateAsync({
        customerName: name, phone, address, pincode, paymentMethod: "COD",
        items: items.map((item) => ({ productId: BigInt(item.productId), title: item.title, imageUrl: item.imageUrl, quantity: BigInt(item.quantity), sellingPrice: item.price })),
        subtotal, shipping: 0, total: subtotal,
      });
      clearCart();
      setOrderId(order.id);
      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place order. Please try again.");
    }
  };

  if (submitted) return <Layout showCategoryNav={false}><div className="max-w-lg mx-auto premium-surface rounded-3xl p-10 text-center"><CheckCircle2 size={58} className="mx-auto text-accent mb-5" /><h1 className="font-display font-bold text-2xl mb-2">Order received</h1><p className="text-muted-foreground mb-2">Order ID: <strong className="text-foreground">{orderId}</strong></p><div className="rounded-2xl border border-border p-4 my-6 text-left bg-muted/20"><div className="flex items-center gap-2 font-semibold mb-2"><Truck size={18} /> DeoDap fulfillment</div><p className="text-sm text-muted-foreground">Your order is saved in BuyHubMart. It will appear in the admin fulfillment queue for manual submission through the DeoDap Order Panel.</p></div><div className="flex flex-col sm:flex-row gap-3 justify-center"><Button variant="outline" className="rounded-full" onClick={() => navigate({to:"/orders/track", search:{orderId}})}>Track Order</Button><Button className="rounded-full btn-primary" onClick={() => navigate({to:"/"})}>Continue Shopping</Button></div></div></Layout>;

  if (!items.length) return <Layout showCategoryNav={false}><div className="text-center py-20"><ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48}/><h1 className="font-display font-bold text-2xl mb-3">Cart is empty</h1><Button className="rounded-full" onClick={() => navigate({to:"/products", search:{q:undefined,sort:undefined,minPrice:undefined,maxPrice:undefined}})}>Shop Products</Button></div></Layout>;

  return <Layout showCategoryNav={false}><div className="max-w-5xl mx-auto"><h1 className="font-display font-bold text-3xl mb-7">Checkout</h1><div className="grid lg:grid-cols-[1fr_340px] gap-6"><form onSubmit={submit} className="premium-surface rounded-2xl p-6 space-y-5"><div><h2 className="font-display font-bold text-lg flex items-center gap-2"><MapPin size={18}/> Delivery details</h2><p className="text-xs text-muted-foreground mt-1">These details are used by the admin when placing the order with DeoDap.</p></div><input name="name" required placeholder="Full name" className="premium-input" autoComplete="name"/><input name="phone" required inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" className="premium-input" autoComplete="tel"/><textarea name="address" required placeholder="Full delivery address" rows={4} className="premium-input resize-none" autoComplete="street-address"/><input name="pincode" required inputMode="numeric" maxLength={6} placeholder="6-digit PIN code" className="premium-input" autoComplete="postal-code"/><div><p className="font-semibold mb-2">Payment</p><label className="flex gap-3 items-center rounded-xl border border-border p-4"><input type="radio" name="payment" value="COD" defaultChecked/><span><strong>Cash on Delivery</strong><br/><small className="text-muted-foreground">Customer pays when the package is delivered.</small></span></label></div><Button type="submit" disabled={createOrder.isPending} className="w-full rounded-full btn-primary h-11">{createOrder.isPending ? "Placing Order..." : "Place COD Order"}</Button></form><aside className="premium-surface rounded-2xl p-5 h-fit"><h2 className="font-display font-bold mb-4">Order Summary</h2>{items.map(item => <div key={item.productId} className="flex justify-between gap-3 text-sm py-2"><span className="line-clamp-2">{item.title} × {item.quantity}</span><span>₹{(item.price*item.quantity).toLocaleString("en-IN")}</span></div>)}<div className="border-t border-border mt-3 pt-4 flex justify-between font-bold"><span>Total</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><p className="text-xs text-muted-foreground mt-4">Supplier: DeoDap · Direct customer delivery</p></aside></div></div></Layout>;
}
