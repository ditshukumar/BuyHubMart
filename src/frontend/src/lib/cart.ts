import type { Product } from "@/types";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const CART_KEY = "buyhubmart_cart";

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("buyhubmart-cart-updated"));
}

export function addToCart(product: Product, quantity = 1) {
  const items = getCart();
  const id = product.id.toString();
  const existing = items.find((item) => item.productId === id);
  if (existing) existing.quantity += quantity;
  else items.push({ productId: id, title: product.title, price: product.price, imageUrl: product.imageUrl, quantity });
  saveCart(items);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const items = getCart().map((item) => item.productId === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
  saveCart(items);
}

export function removeFromCart(productId: string) {
  saveCart(getCart().filter((item) => item.productId !== productId));
}

export function clearCart() { saveCart([]); }
export function getCartCount() { return getCart().reduce((sum, item) => sum + item.quantity, 0); }
export function getCartSubtotal() { return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0); }
