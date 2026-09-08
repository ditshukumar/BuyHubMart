import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getCart, getCartSubtotal, removeFromCart, updateCartQuantity, type CartItem } from "@/lib/cart";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const refresh = () => setItems(getCart());
  useEffect(() => { refresh(); window.addEventListener("buyhubmart-cart-updated", refresh); return () => window.removeEventListener("buyhubmart-cart-updated", refresh); }, []);
  const subtotal = getCartSubtotal();

  return <Layout showCategoryNav={false}>
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8"><ShoppingCart /><h1 className="font-display font-bold text-3xl">Your Cart</h1></div>
      {items.length === 0 ? <div className="premium-surface rounded-2xl p-10 text-center"><ShoppingCart className="mx-auto mb-4 text-muted-foreground" size={48}/><h2 className="font-display font-bold text-xl mb-2">Your cart is empty</h2><p className="text-muted-foreground mb-6">Add products and come back here to checkout.</p><Button asChild className="rounded-full btn-primary"><Link to="/products" search={{q:undefined,sort:undefined,minPrice:undefined,maxPrice:undefined}}>Browse Products</Link></Button></div> :
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">{items.map(item => <div key={item.productId} className="premium-surface rounded-2xl p-4 flex gap-4 items-center">
          <img src={item.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover bg-muted" />
          <div className="flex-1 min-w-0"><h3 className="font-semibold line-clamp-2">{item.title}</h3><p className="text-accent font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p></div>
          <div className="flex items-center gap-2"><Button variant="outline" size="icon" className="rounded-full" onClick={() => { updateCartQuantity(item.productId, item.quantity-1); refresh(); }}><Minus size={15}/></Button><span className="w-5 text-center">{item.quantity}</span><Button variant="outline" size="icon" className="rounded-full" onClick={() => { updateCartQuantity(item.productId, item.quantity+1); refresh(); }}><Plus size={15}/></Button></div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { removeFromCart(item.productId); refresh(); }} aria-label="Remove"><Trash2 size={17}/></Button>
        </div>)}</div>
        <aside className="premium-surface rounded-2xl p-5 h-fit sticky top-24"><h2 className="font-display font-bold text-lg mb-4">Order Summary</h2><div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><div className="flex justify-between text-sm mb-4"><span className="text-muted-foreground">Shipping</span><span className="text-accent">Calculated at fulfillment</span></div><div className="border-t border-border pt-4 flex justify-between font-bold text-lg"><span>Total</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><Button className="w-full mt-5 rounded-full btn-primary" onClick={() => navigate({to:"/checkout"})}>Proceed to Checkout</Button></aside>
      </div>}
    </div>
  </Layout>;
}
