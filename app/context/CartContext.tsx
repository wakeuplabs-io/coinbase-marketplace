"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CompletedOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  completedAt: string;
  customerName?: string;
  customerEmail?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  hasInsufficientFunds: (balance: number) => boolean;
  saveCompletedOrder: (order: Omit<CompletedOrder, "id" | "completedAt">) => void;
  getCompletedOrders: () => CompletedOrder[];
  getIncompleteOrder: () => CartItem[] | null;
  clearIncompleteOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// LocalStorage keys
const INCOMPLETE_ORDER_KEY = "coinbase-marketplace-incomplete-order";
const COMPLETED_ORDERS_KEY = "coinbase-marketplace-completed-orders";
const MAX_COMPLETED_ORDERS = 50; // Limit to prevent localStorage from growing too large

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Load incomplete order from localStorage on mount
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(INCOMPLETE_ORDER_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save incomplete order to localStorage whenever items change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (items.length > 0) {
        localStorage.setItem(INCOMPLETE_ORDER_KEY, JSON.stringify(items));
      } else {
        localStorage.removeItem(INCOMPLETE_ORDER_KEY);
      }
    } catch (error) {
      console.error("Failed to save incomplete order to localStorage:", error);
    }
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== productId)
      );
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    // Also clear incomplete order from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(INCOMPLETE_ORDER_KEY);
    }
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  // Check if user has insufficient funds
  const hasInsufficientFunds = useCallback(
    (balance: number): boolean => {
      return balance < subtotal;
    },
    [subtotal]
  );

  // Save completed order to localStorage
  const saveCompletedOrder = useCallback(
    (order: Omit<CompletedOrder, "id" | "completedAt">) => {
      if (typeof window === "undefined") return;

      try {
        const completedOrder: CompletedOrder = {
          ...order,
          id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          completedAt: new Date().toISOString(),
        };

        const existing = localStorage.getItem(COMPLETED_ORDERS_KEY);
        const orders: CompletedOrder[] = existing ? JSON.parse(existing) : [];

        // Add new order at the beginning
        orders.unshift(completedOrder);

        // Keep only the most recent orders
        const limitedOrders = orders.slice(0, MAX_COMPLETED_ORDERS);

        localStorage.setItem(COMPLETED_ORDERS_KEY, JSON.stringify(limitedOrders));

        // Clear incomplete order after successful purchase
        localStorage.removeItem(INCOMPLETE_ORDER_KEY);
        setItems([]);
      } catch (error) {
        console.error("Failed to save completed order to localStorage:", error);
      }
    },
    []
  );

  // Get completed orders from localStorage
  const getCompletedOrders = useCallback((): CompletedOrder[] => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(COMPLETED_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Get incomplete order from localStorage
  const getIncompleteOrder = useCallback((): CartItem[] | null => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(INCOMPLETE_ORDER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  // Clear incomplete order
  const clearIncompleteOrder = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(INCOMPLETE_ORDER_KEY);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      hasInsufficientFunds,
      saveCompletedOrder,
      getCompletedOrders,
      getIncompleteOrder,
      clearIncompleteOrder,
    }),
    [
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      hasInsufficientFunds,
      saveCompletedOrder,
      getCompletedOrders,
      getIncompleteOrder,
      clearIncompleteOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
