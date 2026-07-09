import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === product.productId);

    let newItems;
    if (existing) {
      newItems = items.map((i) =>
        i.productId === product.productId ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      newItems = [...items, { ...product, quantity }];
    }

    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems });
  },

  removeItem: (productId) => {
    const newItems = get().items.filter((i) => i.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const newItems = get().items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));

export default useCartStore;
