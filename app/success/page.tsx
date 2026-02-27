"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Header from "@/app/components/Header";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/utils";

export default function SuccessPage() {
  const router = useRouter();
  const { getCompletedOrders } = useCart();
  const order = useMemo(() => getCompletedOrders()[0], [getCompletedOrders]);

  const formattedDate = order?.completedAt
    ? new Date(order.completedAt).toLocaleString("en-US", {
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
        {order && (
          <section className="rounded-xl bg-white border border-[#e5e7eb] shadow-sm p-5 mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-[#6b7280]">Total Amount Paid</p>
              <p className="text-2xl font-bold text-[#0052ff] mt-1">{formatPrice(order.subtotal)}</p>
            </div>
            <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
              {formattedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6b7280]">Date</span>
                  <span className="text-sm font-medium text-[#0a0b0d]">{formattedDate}</span>
                </div>
              )}
              {order.id && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6b7280]">Order ID</span>
                  <span className="text-sm font-medium text-[#0a0b0d] truncate max-w-[180px]" title={order.id}>
                    {order.id}
                  </span>
                </div>
              )}
            </div>
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
          {order?.paymentUrl && (
            <a
              href={order.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0052ff] text-white rounded-xl font-semibold hover:bg-[#0041cc] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Transaction
            </a>
          )}
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
