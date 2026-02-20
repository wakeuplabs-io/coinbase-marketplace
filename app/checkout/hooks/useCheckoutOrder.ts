"use client";

import { useState, useCallback } from "react";

import { useCart } from "@/app/context/CartContext";
import { usePayment } from "@/app/hooks/usePayment";
import { useCheckoutFunds } from "@/app/checkout/hooks/useCheckoutFunds";
import { formatPrice } from "@/app/lib/utils";
import type { CheckoutFormData } from "@/app/checkout/lib/checkout-form";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export function useCheckoutOrder() {
  const { items, subtotal, saveCompletedOrder } = useCart();
  const { payment, isLoading, error, createPayment, reset } = usePayment();
  const {
    insufficientFunds,
    usdcBalance,
    isConnected,
    isLoadingBalance,
  } = useCheckoutFunds();

  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [web3FormsResult, setWeb3FormsResult] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const submitOrder = useCallback(
    async (formData: CheckoutFormData) => {
      setModalError(null);

      if (items.length === 0) {
        setModalError("Your cart is empty");
        return;
      }

      if (
        isConnected &&
        !isLoadingBalance &&
        usdcBalance < subtotal
      ) {
        setModalError(
          `Insufficient funds. You need ${formatPrice(subtotal - usdcBalance)} more to complete this purchase.`
        );
        return;
      }

      setIsPreparingPayment(true);

      try {
        setCustomerInfo({
          name: formData["full-name"],
          email: formData.email,
        });

        setWeb3FormsResult("");
        const orderMessage = [
          `Order Summary:`,
          ...items.map(
            (i) => `- ${i.name} x${i.quantity}: $${(i.price * i.quantity).toFixed(2)}`
          ),
          `Total: $${subtotal.toFixed(2)}`,
          ``,
          `Billing: ${formData.address}${formData.apartment ? `, ${formData.apartment}` : ""}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`,
        ].join("\n");

        const web3FormData = new FormData();
        web3FormData.append("access_key", WEB3FORMS_ACCESS_KEY ?? "");
        web3FormData.append("name", formData["full-name"]);
        web3FormData.append("email", formData.email);
        web3FormData.append("message", orderMessage);

        const web3Response = await fetch(
          "https://api.web3forms.com/submit",
          {
            method: "POST",
            body: web3FormData,
          }
        );
        const web3Data = await web3Response.json();
        setWeb3FormsResult(web3Data.success ? "Success!" : "Error");

        await createPayment({
          maxAmount: subtotal.toFixed(2),
          customer: {
            name: formData["full-name"],
            email: formData.email,
          },
        });
      } finally {
        setIsPreparingPayment(false);
      }
    },
    [
      items,
      subtotal,
      isConnected,
      isLoadingBalance,
      usdcBalance,
      createPayment,
    ]
  );

  const handleCloseModal = useCallback(() => {
    setIsPreparingPayment(false);
    setModalError(null);
    setWeb3FormsResult("");
    reset();
  }, [reset]);

  const handleModalError = useCallback((errorMsg: string) => {
    setModalError(errorMsg);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    if (items.length > 0 && customerInfo) {
      saveCompletedOrder({
        items: [...items],
        subtotal,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
      });
    }
  }, [items, subtotal, customerInfo, saveCompletedOrder]);

  return {
    submitOrder,
    handleCloseModal,
    handleModalError,
    handlePaymentSuccess,
    modalError,
    web3FormsResult,
    payment,
    isLoading,
    isPreparingPayment,
    error,
    insufficientFunds,
  };
}
