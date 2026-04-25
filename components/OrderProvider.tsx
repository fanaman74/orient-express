'use client';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderContextType = {
  items: OrderItem[];
  addItem: (item: Omit<OrderItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
  total: number;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);

  function addItem(item: Omit<OrderItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }

  function clearOrder() { setItems([]); }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const value = useMemo(() => ({ items, addItem, removeItem, updateQuantity, clearOrder, total }), [items, total]); // eslint-disable-line react-hooks/exhaustive-deps

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
