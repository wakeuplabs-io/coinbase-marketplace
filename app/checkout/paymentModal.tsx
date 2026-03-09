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

  // Inject style overrides into the shadow DOM
  useEffect(() => {
    if (!isOpen || !paymentComponentRef.current) return;
    const component = paymentComponentRef.current;

    const injectStyles = () => {
      const shadow = component.shadowRoot;
      if (!shadow) return;
      if (shadow.querySelector('#cb-overrides')) return;
      const style = document.createElement('style');
      style.id = 'cb-overrides';
      style.textContent = `
        :host {
          min-height: 0 ;
          max-height: 100% ;
          display: block ;
          border-radius: 16px ;
          overflow: visible ;
        }
        /* Let layout fit content without stretching and respect modal height */
        [class*="Layout"],
        [class*="Container"] {
          min-height: 0 ;
          max-height: 100% ;
        }
        :host > div {
          min-height: 0 ;
          max-height: 100% !important;
          border-radius: 16px ;
          overflow: visible ;
          display: flex ;
          flex-direction: column ;
        }
        /* Main two-column grid should fill available height without overflowing */
        [class*="gridContainer"],
        [class*="TwoColumn"] {
          height: 100% !important;
          max-height: 100% !important;
          overflow: visible ;
          align-items: stretch ;
        }
        /* Left column: wallet list scrolls independently inside fixed-height modal */
        [class*="standaloneConnection"],
        [class*="walletList"] {
          max-height: 100% ;
          overflow-y: auto ;
          overscroll-behavior: contain ;
        }
        /* Ensure heading area stays fixed height and does not expand with content */
        [class*="headingContainer"] {
          flex: 0 0 auto ;
        }
        /* Right column / connection panel: fill visible height and center content */
        [class*="walletConnectionContainer"],
        [class*="extensionConnection"],
        [class*="ExtensionConnection"] {
          height: 30% !important;
          max-height: 30% !important;
          display: flex ;
          flex-direction: column ;
          justify-content: center ;
          align-items: center ;
          overflow-y: auto ;
          overscroll-behavior: contain ;
        }
        [class*="Detail"],
        [class*="Connection"][class*="Content"],
        [class*="RightPanel"],
        [class*="SidePanel"] {
          height: 30% !important;
          max-height: 30% !important;
          display: flex ;
          flex-direction: column ;
          justify-content: center ;
          align-items: center ;
          min-height: 0 ;
          overflow-y: auto ;
          overscroll-behavior: contain ;
        }
        /* Center the connect button text */
        .QRCodeConnection-module__showExtensionButton___opubP {
          justify-content: center ;
        }
        /* Tweak inline extension-only container height */
        [class*="extensionConnectionOnlyContainer"] {
          height: auto !important;
          max-height: 30% !important;
        }
      `;
      shadow.appendChild(style);
    };

    // Try immediately and also after a short delay (shadow root may not exist yet)
    injectStyles();
    const t = setTimeout(injectStyles, 300);
    return () => clearTimeout(t);
  }, [isOpen]);

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-backdrop">
      <button
        type="button"
        className={`absolute inset-0 border-0 p-0 w-full h-full transition-all ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
        onClick={isLoading ? undefined : onClose}
        disabled={isLoading}
        aria-label="Close payment modal"
      />

      <div
        className={`relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in-up ${
          isLoading && !payment
            ? "max-w-[min(280px,100%)]"
            : "max-w-[680px] max-h-[90vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-busy={isLoading}
        aria-label="Payment"
      >
        {isLoading && !payment ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-5">
            <div className="w-8 h-8 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" aria-hidden />
            <p className="text-sm text-[#4a5568] leading-relaxed">Preparing payment...</p>
          </div>
        ) : (
          <div className="payment-modal-embed h-auto max-h-[85vh] w-full min-w-0 overflow-y-auto">
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
    </div>
  );
}