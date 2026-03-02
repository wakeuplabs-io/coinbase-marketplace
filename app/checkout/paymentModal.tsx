"use client";

import { useRef, useEffect } from "react";

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

export interface CompletedEventDetail {
  paymentId?: string;
  status?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  payment: PaymentLink | null;
  isLoading?: boolean;
  onClose: () => void;
  onPaymentSuccess?: (payment: PaymentLink, eventDetail: CompletedEventDetail) => void;
}

export default function PaymentModal({
  isOpen,
  payment,
  isLoading = false,
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
        const detail = customEvent.detail as CompletedEventDetail | undefined;
        console.log('[coinbase-payment] completed event:', detail);
        if (detail?.status === 'success' && payment) {
          onPaymentSuccess?.(payment, detail ?? {});
          onClose();
        }
      };

      const handleCancelled = () => {
        onClose();
      };
  
      const handlePaymentError = (event: Event) => {
        const customEvent = event as CustomEvent;
        console.error('Payment error:', customEvent.detail?.error);
      };
    
      component.addEventListener('completed', handleCompleted as EventListener);
      component.addEventListener('cancelled', handleCancelled as EventListener);
      component.addEventListener('paymentError', handlePaymentError as EventListener);
  
      return () => {
        component.removeEventListener('completed', handleCompleted as EventListener);
        component.removeEventListener('cancelled', handleCancelled as EventListener);
        component.removeEventListener('paymentError', handlePaymentError as EventListener);
      };
    }, [isOpen, payment, onClose, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay — por encima del header */}
      <button
        type="button"
        className={`fixed inset-0 z-100 bg-black/50 animate-fade-backdrop border-0 p-0 w-full h-full transition-all ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
        onClick={isLoading ? undefined : onClose}
        disabled={isLoading}
        aria-label="Close payment modal"
      />

      {/* Card: altura según contenido */}
      <div
        className="fixed left-1/2 top-1/2 z-101 min-w-0 w-full max-w-[min(680px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white border border-[#e5e7eb] shadow-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-busy={isLoading}
        aria-label="Payment"
      >
        {isLoading && !payment ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-8 h-8 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" aria-hidden />
            <p className="text-sm text-[#4a5568] leading-relaxed">Preparing payment...</p>
          </div>
        ) : (
          <div className="payment-modal-embed w-full min-w-0">
            {/* @ts-expect-error - Web component */}
            <coinbase-payment
              ref={paymentComponentRef}
              id="payment-link"
              layout="default"
              payment={payment}
            />
          </div>
        )}
      </div>
    </>
  );
}