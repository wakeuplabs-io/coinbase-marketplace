"use client";

import { useCart } from "@/app/context/CartContext";
import { useWallet } from "@/app/hooks/useWallet";

export function useCheckoutFunds() {
  const { subtotal, hasInsufficientFunds } = useCart();
  const { usdcBalance, isConnected, isLoadingBalance } = useWallet();

  const insufficientFunds =
    isConnected && !isLoadingBalance && hasInsufficientFunds(usdcBalance);

  return {
    insufficientFunds,
    usdcBalance,
    subtotal,
    isConnected,
    isLoadingBalance,
  };
}
