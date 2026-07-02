import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PanierItem } from '../types';

interface CartStore {
  items: PanierItem[];
  addItem: (item: PanierItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.produitId === item.produitId);
        if (existing) {
          get().updateQuantity(item.produitId, existing.quantite + 1);
        } else {
          set({ items: [...get().items, { ...item, quantite: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.produitId !== id) }),
      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({ items: get().items.map(i => i.produitId === id ? { ...i, quantite: qty } : i) });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.prix * i.quantite, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantite, 0),
    }),
    { name: 'sunushop-cart' }
  )
);
