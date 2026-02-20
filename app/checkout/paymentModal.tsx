"use client";

import { useRef, useEffect } from "react";
import Script from "next/script";

// Declare the coinbase-payment web component type
// This namespace declaration is required for web component type augmentation
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'coinbase-payment': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          id?: string;
          layout?: 'single-column' | 'default';
        },
        HTMLElement
      >;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

interface PaymentLink {
  id: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  status: string;
}

interface CoinbasePaymentElement extends HTMLElement {
  render: (data: { payment: PaymentLink }) => void;
  back: () => void;
}

interface PaymentModalProps {
  isOpen: boolean;
  payment: PaymentLink | null;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  payment,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const paymentComponentRef = useRef<CoinbasePaymentElement | null>(null);

  // Render payment component when payment data is available
  useEffect(() => {
    if (isOpen && payment && paymentComponentRef.current) {
      const component = paymentComponentRef.current;
      if (component && typeof component.render === 'function') {
        component.render({ payment });
      }
    }
  }, [isOpen, payment]);

    // Handle payment component events
    useEffect(() => {
      const component = paymentComponentRef.current;
      if (!component || !isOpen) return;
  
      const handleCompleted = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.status === 'success') {
          onPaymentSuccess?.();
          onClose();
        }
      };
  
      const handleCancelled = () => {
        onClose();
      };
  
      const handlePaymentError = (event: Event) => {
        const customEvent = event as CustomEvent;
        console.error('Payment error:', customEvent.detail?.error);
        onClose();
      };
  
      const handleDeeplink = (event: Event) => {
        const customEvent = event as CustomEvent;
        // Handle deeplink for mobile wallet redirects
        if (customEvent.detail?.url) {
          window.location.href = customEvent.detail.url;
        }
      };
  
      component.addEventListener('completed', handleCompleted as EventListener);
      component.addEventListener('cancelled', handleCancelled as EventListener);
      component.addEventListener('paymentError', handlePaymentError as EventListener);
      component.addEventListener('deeplink', handleDeeplink as EventListener);
  
      return () => {
        component.removeEventListener('completed', handleCompleted as EventListener);
        component.removeEventListener('cancelled', handleCancelled as EventListener);
        component.removeEventListener('paymentError', handlePaymentError as EventListener);
        component.removeEventListener('deeplink', handleDeeplink as EventListener);
      };
    }, [isOpen, onClose, onPaymentSuccess]);
  

  if (!isOpen) return null;

  return (
    <>
      {/* Coinbase Payment Component Script */}
      <Script
        src="https://payments.coinbase.com/payments/components/v1/payment-link.mjs"
        strategy="lazyOnload"
        type="module"
      />

      {/* Overlay */}
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/50 animate-fade-backdrop cursor-pointer border-0 p-0 w-full h-full"
        onClick={onClose}
        aria-label="Close payment modal"
      />

      <div
        className="fixed left-1/2 top-1/2 z-50 min-w-[600px] w-fit max-w-[min(640px,calc(100vw-2rem))] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* @ts-expect-error - Web component */}
        <coinbase-payment
          ref={paymentComponentRef}
          id="payment-link"
          layout="single-column"
          payment={payment}
        />
      </div>
    </>
  );
}