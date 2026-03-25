"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "@/app/components/Header";

function SuccessContent() {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-[#f9fafb] min-h-screen">
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

        {/* Action buttons */}
        <section className="space-y-3 mb-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => router.push("/marketplace")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#374151] rounded-xl font-medium text-sm hover:bg-[#f9fafb] transition-colors border border-[#e5e7eb] w-full max-w-[220px]"
          >
            Try again
          </button>
        </section>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center bg-[#f9fafb]">
          <div className="w-8 h-8 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
