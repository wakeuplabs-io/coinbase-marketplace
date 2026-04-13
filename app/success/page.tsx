"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "@/app/components/Header";
import { useWallet } from "@/app/hooks/useWallet";

function SuccessContent() {
  const router = useRouter();
  const { disconnect } = useWallet();

  const handleBackToHome = () => {
    disconnect();
    router.replace("/?disconnected=1");
  };

  return (
    <div className="flex flex-col animated-gradient-bg min-h-screen">
      <div className="floating-orb floating-orb-1" aria-hidden="true" />
      <div className="floating-orb floating-orb-2" aria-hidden="true" />
      <div className="floating-orb floating-orb-3" aria-hidden="true" />

      <div className="fixed left-0 right-0 top-0 z-50 w-full bg-white/80 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
        <Header
          showBackButton
          disconnectOnBack
          onBackClick={() => router.replace("/?disconnected=1")}
          showConnectWallet={false}
        />
      </div>

      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-12"
      >
        <section className="flex max-w-md flex-col items-center text-center animate-fade-in-up">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#86efac] bg-[#dcfce7]">
            <svg
              className="h-8 w-8 text-[#16a34a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#0a0b0d] sm:text-3xl">
            Payment successful
          </h1>
          <p className="text-sm leading-relaxed text-[#4a5568] sm:text-base">
            Your transaction has been processed and your order is confirmed.
          </p>
        </section>

        <section className="mt-10 flex w-full max-w-sm flex-col items-stretch animate-fade-in-up delay-100">
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex w-full items-center justify-center rounded-xl border border-[#e2e4e9] bg-white px-5 py-3 text-sm font-medium text-[#0a0b0d] transition-colors hover:bg-[#f9fafb]"
          >
            Back to home
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
        <div className="flex min-h-screen items-center justify-center bg-[#f9fafb]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0052ff] border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
