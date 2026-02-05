"use client";

import QRCode from "react-qr-code";

// Environment variables with defaults
const BASE_APP_URL =
  process.env.NEXT_PUBLIC_BASE_APP_URL ||
  "https://www.coinbase.com/wallet/downloads";
const BASE_APP_IOS_URL =
  process.env.NEXT_PUBLIC_BASE_APP_IOS_URL ||
  "https://apps.apple.com/us/app/base-formerly-coinbase-wallet/id1278383455";
const BASE_APP_ANDROID_URL =
  process.env.NEXT_PUBLIC_BASE_APP_ANDROID_URL ||
  "https://play.google.com/store/apps/details?id=org.toshi";
const MARKETPLACE_URL =
  process.env.NEXT_PUBLIC_MARKETPLACE_URL || "/marketplace";

// Coinbase logo SVG component
function CoinbaseLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="1024" height="1024" rx="512" fill="#0052FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M512 784C661.127 784 784 661.127 784 512C784 362.873 661.127 240 512 240C362.873 240 240 362.873 240 512C240 661.127 362.873 784 512 784ZM416.2 393.6C404.438 393.6 394.8 403.238 394.8 415V609C394.8 620.762 404.438 630.4 416.2 630.4H608.2C619.962 630.4 629.6 620.762 629.6 609V415C629.6 403.238 619.962 393.6 608.2 393.6H416.2Z"
        fill="white"
      />
    </svg>
  );
}

// Apple logo SVG
function AppleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// Play Store logo SVG
function PlayStoreLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

// Arrow right icon
function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="arrow-animate"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-white">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0052ff] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="w-full border-b border-[#e2e4e9]">
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold text-[#0a0b0d] hover:opacity-80 transition-opacity"
            aria-label="Coinbase Marketplace home"
          >
            <CoinbaseLogo />
            <span className="tracking-tight">Coinbase Marketplace</span>
          </a>
          {/* Demo Badge */}
          <span className="px-2.5 py-1 text-xs font-medium bg-[#0052ff]/10 text-[#0052ff] rounded-full">
            Demo
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 flex items-start lg:items-center justify-center px-5 md:px-8 py-8 lg:py-0"
      >
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
          {/* Left Column - Copy */}
          <div className="order-1">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-tight text-[#0a0b0d] leading-tight animate-fade-in-up">
              Pay with crypto or card.
              <span className="instantly-shimmer"> Instantly.</span>
            </h1>
            <p className="mt-4 lg:mt-6 text-base lg:text-lg text-[#4a5568] leading-relaxed animate-fade-in-up delay-100">
              Shop securely using crypto, cards, or bank transfers. Set up your
              wallet in minutes and explore the marketplace.
            </p>

            {/* Secondary CTA - Desktop (replaces steps) */}
            <div className="hidden lg:block mt-8 animate-fade-in-up delay-200">
              <a
                href={MARKETPLACE_URL}
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Continue to the marketplace if you already have a wallet"
              >
                I already have a wallet
                <ArrowRight />
              </a>
            </div>
          </div>

          {/* Right Column - QR Card (Desktop) / Download Buttons (Mobile) */}
          <div className="order-2 lg:justify-self-end">
            {/* Mobile: Prominent download buttons */}
            <div className="lg:hidden">
              <div className="bg-gradient-to-b from-[#f8fafc] to-white border border-[#e2e4e9] rounded-2xl p-6 text-center animate-fade-in-up delay-100">
                <h2 className="text-lg font-semibold text-[#0a0b0d] mb-2">
                  Download Base App
                </h2>
                <p className="text-sm text-[#4a5568] mb-5 leading-relaxed">
                  Create, earn, trade, discover apps, and chat with friends all
                  in one place.
                </p>

                {/* Primary Download Buttons - Mobile */}
                <div className="flex flex-col gap-3">
                  <a
                    href={BASE_APP_IOS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#0a0b0d] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download Base App for iOS"
                  >
                    <AppleLogo />
                    Download for iPhone
                  </a>
                  <a
                    href={BASE_APP_ANDROID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-5 py-3.5 border-2 border-[#e2e4e9] rounded-xl text-sm font-semibold text-[#0a0b0d] hover:bg-[#f9fafb] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download Base App for Android"
                  >
                    <PlayStoreLogo />
                    Download for Android
                  </a>
                </div>
              </div>

              {/* Secondary CTA - Mobile (replaces steps) */}
              <div className="mt-6 animate-fade-in-up delay-200">
                <a
                  href={MARKETPLACE_URL}
                  className="group flex items-center justify-center gap-2 w-full px-5 py-3 text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all active:scale-[0.98]"
                  aria-label="Continue to the marketplace if you already have a wallet"
                >
                  I already have a wallet
                  <ArrowRight />
                </a>
              </div>
            </div>

            {/* Desktop: QR Card */}
            <div className="hidden lg:block">
              <div className="qr-card bg-white border border-[#e2e4e9] rounded-2xl p-8 shadow-sm w-[360px] text-center animate-fade-in-up delay-200">
                <h2 className="text-xl font-semibold text-[#0a0b0d] mb-2">
                  Download Base App
                </h2>
                <p className="text-sm text-[#4a5568] mb-6 leading-relaxed">
                  Create, earn, trade, discover apps, and chat with friends all
                  in one place.
                </p>

                {/* QR Code with matching card border */}
                <div className="flex justify-center mb-3">
                  <div
                    className="bg-white p-4 rounded-xl border border-[#e2e4e9]"
                    role="img"
                    aria-label="QR code to download Base App"
                  >
                    <QRCode
                      value={BASE_APP_URL}
                      size={180}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#0a0b0d"
                    />
                  </div>
                </div>

                <p className="text-xs text-[#4a5568] mb-6">
                  Scan to download
                </p>

                {/* Store Buttons */}
                <div className="flex gap-3">
                  <a
                    href={BASE_APP_IOS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0a0b0d] text-white rounded-xl text-sm font-medium hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download Base App for iOS"
                  >
                    <AppleLogo />
                    iOS
                  </a>
                  <a
                    href={BASE_APP_ANDROID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e2e4e9] rounded-xl text-sm font-medium text-[#0a0b0d] hover:bg-[#f9fafb] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download Base App for Android"
                  >
                    <PlayStoreLogo />
                    Android
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e2e4e9]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <p className="text-xs text-[#4a5568]">
            Powered by Coinbase Payments APIs
          </p>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <a
              href="https://docs.cdp.coinbase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4a5568] hover:text-[#0052ff] transition-colors"
            >
              Developer Docs
            </a>
            <span className="text-[#e2e4e9]">|</span>
            <a
              href="https://www.coinbase.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4a5568] hover:text-[#0052ff] transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
