import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCustomerOrder } from "@/hooks/useBackend";
import { useSearch } from "@tanstack/react-router";
import { PackageCheck, Search, Truck } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

function statusSteps(orderStatus: string) {
  const statuses = ["Order received", "Sent to DeoDap", "Shipped", "Delivered"];
  const normalized = orderStatus.toLowerCase();
  return statuses.map((label) => ({ label, active: normalized.includes(label.toLowerCase()) || (label === "Order received" && normalized.length > 0) }));
}

export default function TrackOrderPage() {
  const search = useSearch({ from: "/orders/track" });
  const [orderId, setOrderId] = useState(search.orderId ?? "");
  const [phone, setPhone] = useState("");
  const [lookup, setLookup] = useState({ orderId: search.orderId ?? "", phone: "" });
  const { data: order, isFetching } = useCustomerOrder(lookup.orderId, lookup.phone);
  const submit = (e: FormEvent) => { e.preventDefault(); const cleanPhone = phone.replace(/\D/g, ""); if (!orderId.trim() || cleanPhone.length !== 10) { toast.error("Enter your order ID and the same 10-digit mobile number used at checkout."); return; } setLookup({orderId:orderId.trim(),phone:cleanPhone}); };
  return <Layout showCategoryNav={false}><div className="max-w-2xl mx-auto"><div className="text-center mb-8"><div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4"><Truck className="text-accent"/></div><h1 className="font-display font-bold text-3xl">Track your order</h1><p className="text-muted-foreground mt-2">Enter the order ID and mobile number used at checkout.</p></div><form onSubmit={submit} className="premium-surface rounded-2xl p-6 space-y-4"><input className="premium-input" placeholder="Order ID (e.g. BHM-1)" value={orderId} onChange={e=>setOrderId(e.target.value)}/><input className="premium-input" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={e=>setPhone(e.target.value)}/><Button type="submit" className="w-full rounded-full btn-primary h-11"><Search size={17}/> Track Order</Button></form>{isFetching&&<p className="text-center text-sm text-muted-foreground mt-6">Checking order...</p>}{lookup.orderId&&lookup.phone&&!isFetching&&!order&&<div className="premium-surface rounded-2xl p-6 text-center mt-6"><PackageCheck className="mx-auto mb-3 text-muted-foreground"/><p className="font-semibold">Order not found</p><p className="text-sm text-muted-foreground mt-1">Check the order ID and mobile number and try again.</p></div>}{order&&!isFetching&&<div className="premium-surface rounded-2xl p-6 mt-6"><div className="flex items-start justify-between gap-4 mb-6"><div><p className="text-xs text-muted-foreground">Order ID</p><h2 className="font-display font-bold text-xl">{order.id}</h2></div><span className="rounded-full px-3 py-1 text-xs font-semibold bg-accent/10 text-accent border border-accent/20">{order.orderStatus}</span></div><div className="space-y-4">{statusSteps(order.orderStatus).map(step=><div key={step.label} className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${step.active?"bg-accent":"bg-muted"}`}/><span className={step.active?"font-semibold":"text-muted-foreground"}>{step.label}</span></div>)}</div><div className="grid sm:grid-cols-2 gap-4 mt-7 pt-5 border-t border-border text-sm"><div><p className="text-muted-foreground">Supplier</p><p className="font-semibold">{order.supplier}</p></div><div><p className="text-muted-foreground">Payment</p><p className="font-semibold">{order.paymentMethod} · {order.paymentStatus}</p></div><div><p className="text-muted-foreground">Supplier status</p><p className="font-semibold">{order.supplierStatus}</p></div><div><p className="text-muted-foreground">Tracking</p><p className="font-semibold">{order.trackingNumber||"Not assigned yet"}</p></div></div></div>}</div></Layout>;
}
