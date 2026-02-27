"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Header from "@/app/components/Header";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/utils";

const NETWORK_NAMES: Record<number, string> = {
  84532: "Base Sepolia",
  8453: "Base",
  1: "Ethereum",
  11155111: "Sepolia",
};

interface PaymentInfo {
  id: string;
  maxAmount?: string;
  networkId?: number;
  createdAt?: string;
  updatedAt?: string;
  transactionHash?: string;
  link?: { url?: string; status?: string; id?: string };
  merchant?: { name?: string };
  settlement?: { totalAmount?: string; feeAmount?: string; netAmount?: string };
  url?: string;
  status?: string;
  amount?: string;
  currency?: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const { getCompletedOrders } = useCart();
  const order = useMemo(() => getCompletedOrders()[0], [getCompletedOrders]);

  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(!!paymentId);

  useEffect(() => {
    if (!paymentId) {
      setIsLoadingPayment(false);
      return;
    }
    let cancelled = false;
    const fetchPayment = async () => {
      try {
        const res = await fetch(`/api/payment/${encodeURIComponent(paymentId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setPaymentError(data.error ?? "Failed to fetch payment");
          return;
        }
        setPayment(data);
      } catch (err) {
        if (cancelled) return;
        setPaymentError(err instanceof Error ? err.message : "Failed to fetch payment");
      } finally {
        if (!cancelled) setIsLoadingPayment(false);
      }
    };
    fetchPayment();
    return () => { cancelled = true; };
  }, [paymentId]);

  const amountToShow =
    payment?.maxAmount ??
    payment?.amount ??
    payment?.settlement?.totalAmount ??
    (order ? order.subtotal : undefined);
  const linkStatus = payment?.link?.status ?? payment?.status;
  const networkId = payment?.networkId ?? 84532;
  const formattedDate = order?.completedAt ?? payment?.createdAt
    ? new Date((order?.completedAt ?? payment?.createdAt) ?? 0).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header
        showBackButton
        onBackClick={() => router.push("/")}
        showConnectWallet={false}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12 pt-24">

        {/* Success confirmation */}
        <section className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full border-4 border-[#86efac] bg-[#dcfce7] flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#16a34a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0a0b0d] mb-2">Payment Successful</h2>
          <p className="text-sm text-[#6b7280] max-w-sm">
            Your transaction has been processed and your order is confirmed.
          </p>
        </section>

        {/* Payment details card */}
        {(order || payment || isLoadingPayment) && (
          <section className="rounded-xl bg-white border border-[#e5e7eb] shadow-sm p-5 mb-6">
            {isLoadingPayment ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <div className="w-6 h-6 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#6b7280]">Loading payment details...</p>
              </div>
            ) : paymentError ? (
              <p className="text-sm text-red-600 py-4">{paymentError}</p>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-[#6b7280]">Total Amount Paid</p>
                  <p className="text-2xl font-bold text-[#0052ff] mt-1">
                    {typeof amountToShow === "number"
                      ? formatPrice(amountToShow)
                      : amountToShow
                        ? `$${Number(amountToShow).toFixed(2)} ${payment?.currency ?? "USDC"}`
                        : order
                          ? formatPrice(order.subtotal)
                          : "—"}
                  </p>
                </div>
                <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
                  {formattedDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6b7280]">Date</span>
                      <span className="text-sm font-medium text-[#0a0b0d]">{formattedDate}</span>
                    </div>
                  )}
                  {(payment?.id ?? order?.id) && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6b7280]">Payment ID</span>
                      <span className="text-sm font-medium text-[#0a0b0d] truncate max-w-[180px]" title={payment?.id ?? order?.id ?? ""}>
                        {payment?.id ?? order?.id}
                      </span>
                    </div>
                  )}
                  {linkStatus && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6b7280]">Status</span>
                      <span className="text-sm font-medium text-[#0a0b0d] capitalize">{String(linkStatus).toLowerCase()}</span>
                    </div>
                  )}
                  {payment?.networkId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6b7280]">Network</span>
                      <span className="text-sm font-medium text-[#0a0b0d]">{NETWORK_NAMES[networkId] ?? `Chain ${networkId}`}</span>
                    </div>
                  )}
                  {payment?.merchant?.name && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6b7280]">Merchant</span>
                      <span className="text-sm font-medium text-[#0a0b0d]">{payment.merchant.name}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {/* Receipt card */}
        <section className="rounded-xl bg-[#e9f0fe] border border-[#c7d7fe] p-8 flex items-center justify-center mb-8">
          <svg
            className="w-20 h-20 text-[#5b8def]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </section>

        {/* Action buttons */}
        <section className="space-y-3 mb-10">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 bg-white text-[#374151] rounded-xl font-medium hover:bg-[#f9fafb] transition-colors border border-[#e5e7eb]"
          >
            Return to Dashboard
          </button>
        </section>
      </main>
    </div>
  );
}
