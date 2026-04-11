import { create } from "zustand";
import { Medicine } from "@/data/medicines";

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (medicine: Medicine) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: JSON.parse(localStorage.getItem("medicare_cart") || "[]"),
  addItem: (medicine) => {
    set((state) => {
      const existing = state.items.find((i) => i.medicine.id === medicine.id);
      const newItems = existing
        ? state.items.map((i) => i.medicine.id === medicine.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, { medicine, quantity: 1 }];
      localStorage.setItem("medicare_cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.medicine.id !== id);
      localStorage.setItem("medicare_cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  updateQuantity: (id, quantity) => {
    set((state) => {
      const newItems = quantity <= 0
        ? state.items.filter((i) => i.medicine.id !== id)
        : state.items.map((i) => i.medicine.id === id ? { ...i, quantity } : i);
      localStorage.setItem("medicare_cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  clearCart: () => {
    localStorage.removeItem("medicare_cart");
    set({ items: [] });
  },
  total: () => get().items.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
