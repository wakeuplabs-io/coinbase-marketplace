"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function FailPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-[#f9fafb]">
      <Header
        showBackButton
        onBackClick={() => router.push("/")}
        showConnectWallet={false}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12 pt-24">
        {/* Failure confirmation */}
        <section className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full border-4 border-[#fca5a5] bg-[#fee2e2] flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#dc2626]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0a0b0d] mb-2">Payment Failed</h2>
          <p className="text-sm text-[#6b7280] max-w-sm">
            Your transaction could not be completed. No charges were made to your account.
          </p>
        </section>

        {/* Error details card */}
        <section className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-5 mb-8">
          <p className="text-sm font-medium text-[#991b1b] mb-1">What happened?</p>
          <p className="text-sm text-[#b91c1c]">
            The payment was declined or cancelled. You can try again with the same or a different payment method.
          </p>
        </section>

        {/* Action buttons */}
        <section className="space-y-3 mb-10">
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0052ff] text-white rounded-xl font-semibold hover:bg-[#0041cc] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
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
