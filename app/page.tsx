"use client";

import QRCode from "react-qr-code";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppleLogo from "./components/icons/AppleLogo";
import PlayStoreLogo from "./components/icons/PlayStoreLogo";
import ArrowRight from "./components/icons/ArrowRight";
import { config } from "./lib/config";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col bg-white">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0052ff] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <Header />

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 flex items-start lg:items-center justify-center px-4 sm:px-5 md:px-8 py-6 sm:py-8 lg:py-0"
      >
        <div className="max-w-5xl w-full flex flex-col lg:grid lg:grid-cols-2 items-stretch lg:items-center gap-6 sm:gap-8 lg:gap-16">
          {/* Left Column - Copy */}
          <div className="order-1 w-full">
            <h1 className="text-[34px] leading-[1.15] sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0a0b0d] lg:leading-tight animate-fade-in-up text-center lg:text-left">
              Pay with crypto or card.
              <span className="instantly-shimmer"> Instantly.</span>
            </h1>
            <p className="mt-3 sm:mt-4 lg:mt-6 text-[15px] sm:text-base lg:text-lg text-[#4a5568] leading-relaxed animate-fade-in-up delay-100 text-center lg:text-left">
              Shop securely using crypto, cards, or bank transfers. Set up your
              wallet in minutes and explore the marketplace.
            </p>

            {/* Secondary CTA - Desktop only */}
            <div className="hidden lg:block mt-8 animate-fade-in-up delay-200">
              <div className="flex flex-col gap-3 items-start">
                <a
                  href={config.marketplaceUrl}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Continue to the marketplace if you already have a wallet"
                >
                  I already have a wallet
                  <ArrowRight />
                </a>
                <a
                  href={config.marketplaceUrl}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Get test USDC tokens to buy"
                >
                  Get test USDC tokens to buy
                  <ArrowRight />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - QR Card (Desktop) / Download Buttons (Mobile) */}
          <div className="order-2 w-full lg:justify-self-end">
            {/* Mobile: Prominent download buttons (NO QR) - Enhanced CTA */}
            <div className="lg:hidden w-full">
              <div className="relative bg-linear-to-br from-[#0052ff] via-[#0066ff] to-[#0052ff] rounded-2xl p-[2px] animate-fade-in-up-with-pulse">
                {/* Inner content with gradient background */}
                <div className="bg-linear-to-b from-[#f8fafc] via-white to-[#fafbff] rounded-[14px] p-5 sm:p-6">
                  {/* Badge/Label */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-[#0052ff]/10 to-[#0066ff]/10 border border-[#0052ff]/20 rounded-full mb-3">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#0052ff] uppercase tracking-wide">
                      ⚡ Get Started
                    </span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-bold text-[#0a0b0d] mb-2 leading-tight">
                    Download Base App
                  </h2>
                  <p className="text-[13px] sm:text-sm text-[#4a5568] mb-5 leading-relaxed">
                    Create, earn, trade, discover apps, and chat with friends all
                    in one place.
                  </p>

                  {/* Primary Download Buttons - Mobile - Enhanced */}
                  <div className="flex flex-col gap-3">
                    <a
                      href={config.baseAppIosUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-2.5 px-6 py-4 bg-[#0a0b0d] text-white rounded-xl text-sm font-bold hover:bg-[#1a1b1d] transition-all active:scale-[0.97] touch-manipulation shadow-lg shadow-black/10 overflow-hidden"
                      aria-label="Download Base App for iOS"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-500"></div>
                      <AppleLogo />
                      <span>Download for iPhone</span>
                    </a>
                    <a
                      href={config.baseAppAndroidUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-2.5 px-6 py-4 bg-white border-2 border-[#0a0b0d] rounded-xl text-sm font-bold text-[#0a0b0d] hover:bg-[#f9fafb] transition-all active:scale-[0.97] touch-manipulation shadow-lg shadow-black/5 overflow-hidden"
                      aria-label="Download Base App for Android"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-500"></div>
                      <PlayStoreLogo />
                      <span>Download for Android</span>
                    </a>
                  </div>

                  {/* Trust indicators */}
                  <div className="mt-4 pt-4 border-t border-[#e2e4e9] flex items-center justify-center gap-2 text-[11px] text-[#5b616e]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                    <span className="font-medium">Free • Secure • 4.8★ rating</span>
                  </div>
                </div>
              </div>

              {/* Secondary CTA - Mobile */}
              <div className="mt-5 sm:mt-6 animate-fade-in-up delay-200 w-full flex justify-center">
                <div className="flex flex-col gap-2.5 sm:gap-3 items-center">
                  <a
                    href={config.marketplaceUrl}
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 text-[13px] sm:text-sm text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-full hover:bg-[#0052ff]/5 transition-all active:scale-[0.95] touch-manipulation whitespace-nowrap"
                    aria-label="Continue to the marketplace if you already have a wallet"
                  >
                    I already have a wallet
                  </a>
                  <a
                    href={config.marketplaceUrl}
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 text-[13px] sm:text-sm text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-full hover:bg-[#0052ff]/5 transition-all active:scale-[0.95] touch-manipulation whitespace-nowrap"
                    aria-label="Get test USDC tokens to buy"
                  >
                    Get test USDC tokens to buy
                  </a>
                </div>
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
                      value={config.baseAppUrl}
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
                    href={config.baseAppIosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0a0b0d] text-white rounded-xl text-sm font-medium hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download Base App for iOS"
                  >
                    <AppleLogo />
                    iOS
                  </a>
                  <a
                    href={config.baseAppAndroidUrl}
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

      <Footer />
    </div>
  );
}
