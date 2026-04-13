"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Same-origin page avoids `srcDoc` / `about:srcdoc` URL quirks (e.g. Coinbase SDK HEAD → /nullsrcdoc). */
const COINBASE_PAYMENT_IFRAME_PATH = "/coinbase-payment-embed.html";

interface PaymentLink {
  id: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  status: string;
}

export interface CompletedEventDetail {
  paymentId?: string;
  status?: string;
}

interface PaymentEmbedProps {
  /** Show the embed (e.g. while preparing link or when `payment` exists) */
  active: boolean;
  payment: PaymentLink | null;
  isLoading?: boolean;
  onCancel: () => void;
  onPaymentSuccess?: (payment: PaymentLink, eventDetail: CompletedEventDetail) => void;
}

export default function PaymentEmbed({
  active,
  payment,
  isLoading = false,
  onCancel,
  onPaymentSuccess,
}: PaymentEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const prevPaymentIdRef = useRef<string | undefined>(undefined);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [isPaymentRendered, setIsPaymentRendered] = useState(false);

  const sendPaymentToIframe = useCallback((currentPayment: PaymentLink) => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;

    iframeWindow.postMessage(
      {
        type: "coinbase:set-payment",
        payload: currentPayment,
      },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    if (!active || !payment?.id) return;

    const prev = prevPaymentIdRef.current;
    if (payment.id === prev) return;

    prevPaymentIdRef.current = payment.id;
    if (prev === undefined) return;

    const frameId = requestAnimationFrame(() => {
      setIsIframeReady(false);
      setIsPaymentRendered(false);
    });
    return () => cancelAnimationFrame(frameId);
  }, [active, payment?.id]);

  useEffect(() => {
    if (!(active && payment && isIframeReady)) return;
    const frameId = requestAnimationFrame(() => {
      setIsPaymentRendered(false);
      sendPaymentToIframe(payment);
    });
    return () => cancelAnimationFrame(frameId);
  }, [active, payment, isIframeReady, sendPaymentToIframe]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data = event.data as
        | {
            source?: string;
            type?: string;
            payload?: CompletedEventDetail & { error?: string; url?: string };
          }
        | undefined;

      if (!data || data.source !== "coinbase-payment-iframe") return;

      if (data.type === "ready") {
        setIsIframeReady(true);
        if (payment) {
          sendPaymentToIframe(payment);
        }
        return;
      }

      if (data.type === "rendered") {
        setIsPaymentRendered(true);
        return;
      }

      if (data.type === "completed") {
        const detail = data.payload ?? {};
        console.log("[coinbase-payment] completed event:", detail);
        if (detail.status === "success" && payment) {
          onPaymentSuccess?.(payment, detail);
          onCancel();
        }
        return;
      }

      if (data.type === "cancelled") {
        onCancel();
        return;
      }

      if (data.type === "paymentError") {
        console.error("Payment error:", data.payload?.error);
        return;
      }

      if (data.type === "deeplink") {
        const url = data.payload?.url;
        if (typeof url === "string" && url.length > 0) {
          window.location.assign(url);
        }
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onCancel, onPaymentSuccess, payment, sendPaymentToIframe]);

  if (!active) return null;

  const preparingOnly = Boolean(isLoading && !payment);
  const showPreparingState = preparingOnly || !isIframeReady || !isPaymentRendered;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-backdrop">
      <button
        type="button"
        className={`absolute inset-0 border-0 p-0 w-full h-full transition-all ${
          preparingOnly ? "cursor-wait" : "cursor-pointer"
        }`}
        onClick={preparingOnly ? undefined : onCancel}
        disabled={preparingOnly}
        aria-label="Close payment modal"
      />

      <div
        className="relative z-10 box-border w-full max-w-[min(550px,calc(100vw-2rem))] sm:w-[550px] h-[min(455px,calc(100vh-2rem))] sm:h-[455px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-busy={isLoading}
        aria-label="Payment"
      >
        {preparingOnly ? (
          <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 px-6 py-5">
            <div
              className="w-8 h-8 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin"
              aria-hidden
            />
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Preparing payment...
            </p>
          </div>
        ) : (
          <div className="relative h-full min-h-0 w-full">
            {showPreparingState && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#f8fafc]">
                <div
                  className="w-8 h-8 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin"
                  aria-hidden
                />
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Preparing payment...
                </p>
              </div>
            )}
            <iframe
              key={payment?.id ?? "coinbase-embed"}
              ref={iframeRef}
              title="Coinbase Payment"
              src={COINBASE_PAYMENT_IFRAME_PATH}
              className={`h-full w-full border-0 transition-opacity duration-300 ${
                isPaymentRendered ? "opacity-100" : "opacity-0"
              }`}
              allow="publickey-credentials-get; publickey-credentials-create; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}
      </div>
    </div>
  );
}
