"use client";

import { useRef, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

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

interface PaymentResponse {
  payment: PaymentLink;
}

interface PaymentModalProps {
  isOpen: boolean;
  payment: PaymentLink | null;
  onClose: () => void;
  onError?: (error: string) => void;
  onPaymentSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  payment,
  onClose,
  onError,
  onPaymentSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const paymentComponentRef = useRef<CoinbasePaymentElement | null>(null);

  // Render payment component when payment data is available
  useEffect(() => {
    if (isOpen && payment && paymentComponentRef.current) {
      const component = paymentComponentRef.current;
      if (component && typeof component.render === 'function') {
        console.log('payment', payment);
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
        // Call success callback before redirecting
        onPaymentSuccess?.();
        // Redirect to success page
        router.push('/success');
      } else {
        const errorMsg = 'Payment failed. Please try again.';
        onError?.(errorMsg);
        onClose();
      }
    };

    const handleCancelled = () => {
      onClose();
    };

    const handlePaymentError = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.error('Payment error:', customEvent.detail?.error);
      const errorMsg = customEvent.detail?.error || 'An error occurred during payment';
      onError?.(errorMsg);
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
  }, [isOpen, router, onClose, onError, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <>
      {/* Coinbase Payment Component Script */}
      <Script
        src="https://payments.coinbase.com/payments/components/v1/payment-link.mjs"
        strategy="lazyOnload"
        type="module"
      />

      {/* @ts-expect-error - Web component */}
      <coinbase-payment
        ref={paymentComponentRef}
        id="payment-link"
        layout="single-column"
        payment={payment}
      />
    </>
  );
}