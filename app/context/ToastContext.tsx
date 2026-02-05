"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "add" | "remove";
  productName: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: "add" | "remove", productName: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "add" | "remove", productName: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, productName };
    
    setToasts((current) => [...current, newToast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ toasts, showToast, removeToast }),
    [toasts, showToast, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
