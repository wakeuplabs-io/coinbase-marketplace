"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppleLogo from "./components/icons/AppleLogo";
import PlayStoreLogo from "./components/icons/PlayStoreLogo";
import FaucetRequest from "./components/FaucetRequest";
import { useConnect, useConnectors } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useWallet } from "./hooks/useWallet";
import { config } from "./lib/config";

function isBaseConnector(id: string): boolean {
  return id === "coinbaseWalletSDK" || id.includes("coinbase");
}

export default function Home() {
  const [showFaucetModal, setShowFaucetModal] = useState(false);
  const router = useRouter();
  const { isConnected, usdcBalance, isLoadingBalance, disconnect } = useWallet();
  const { openConnectModal } = useConnectModal();
  const previousConnectedRef = useRef(false);
  const cameFromDisconnectRef = useRef(false);
  const suppressAutoRedirectRef = useRef(false);
  const redirectGuardReadyRef = useRef(false);
  const shouldRequestTestFunds = isConnected && !isLoadingBalance && usdcBalance === 0;

  // Landing page: clear persisted wallet session so the user starts fresh (no-op if not connected)
  useEffect(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const disconnected = params.get("disconnected") === "1";
    if (disconnected) {
      cameFromDisconnectRef.current = true;
      suppressAutoRedirectRef.current = true;
    }
    redirectGuardReadyRef.current = true;
  }, []);

  // Prevent redirect races immediately after disconnecting from marketplace.
  useEffect(() => {
    if (!redirectGuardReadyRef.current) return;
    if (suppressAutoRedirectRef.current && !isConnected) {
      suppressAutoRedirectRef.current = false;
      if (cameFromDisconnectRef.current) {
        router.replace("/");
      }
    }
  }, [isConnected, router]);

  // After connect + balance loaded: faucet if zero USDC, marketplace otherwise
  useEffect(() => {
    if (!redirectGuardReadyRef.current || suppressAutoRedirectRef.current) return;
    if (isConnected && !previousConnectedRef.current && !isLoadingBalance) {
      previousConnectedRef.current = true;
      requestAnimationFrame(() => {
        if (usdcBalance > 0) {
          router.push(config.marketplaceUrl);
        } else {
          setShowFaucetModal(true);
        }
      });
    }
    if (!isConnected) {
      previousConnectedRef.current = false;
    }
  }, [isConnected, usdcBalance, isLoadingBalance, router]);

  // If the user receives funds (e.g. faucet tx completes after closing the modal),
  // move them forward automatically.
  useEffect(() => {
    if (!redirectGuardReadyRef.current || suppressAutoRedirectRef.current) return;
    if (isConnected && !isLoadingBalance && usdcBalance > 0) {
      router.push(config.marketplaceUrl);
    }
  }, [isConnected, usdcBalance, isLoadingBalance, router]);

  const { connect } = useConnect();
  const connectors = useConnectors();

  const goToMarketplaceIfFunded = () => {
    if (isLoadingBalance) return;
    if (usdcBalance > 0) {
      router.push(config.marketplaceUrl);
    } else {
      setShowFaucetModal(true);
    }
  };

  const handleConnectBaseWallet = () => {
    if (isConnected) {
      if (shouldRequestTestFunds) {
        setShowFaucetModal(true);
        return;
      }
      goToMarketplaceIfFunded();
      return;
    }
    const baseConnector = connectors.find((c) => isBaseConnector(c.id));
    if (baseConnector) {
      connect({ connector: baseConnector });
    } else {
      // Fallback when Base connector is not available.
      openConnectModal?.();
    }
  };

  const handleConnectOtherWallet = () => {
    openConnectModal?.();
  };

  const handleFaucetSuccess = () => {
    // Close modal and redirect to marketplace after faucet success
    setShowFaucetModal(false);
    // Small delay to show success message before redirect
    setTimeout(() => {
      router.push(config.marketplaceUrl);
    }, 1500);
  };
  return (
    <div className="overflow-x-hidden flex flex-col bg-white  min-h-screen">
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
        <div className="max-w-5xl w-full flex flex-col lg:grid lg:grid-cols-2 items-stretch lg:items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Right Column */}
          <div className="order-2 w-full">
            <h1 className="text-[34px] leading-[1.15] sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0a0b0d] lg:leading-tight animate-fade-in-up text-center lg:text-left">
              Pay with Stablecoins. Borderless. 24/7.<span className="instantly-shimmer"> Instant.</span>
            </h1>
            <p className="mt-3 sm:mt-4 lg:mt-6 text-[15px] sm:text-base lg:text-lg text-[#4a5568] leading-relaxed animate-fade-in-up delay-100 text-center lg:text-left">
              Shop securely using any crypto payment method.
              Set up your wallet in minutes and explore the marketplace.
            </p>

            {/* Secondary CTA - Desktop only (Step 2) */}
            <div className="hidden lg:block mt-8 animate-fade-in-up delay-200">
              <div className="flex flex-col gap-3 items-start">
                <span className="text-xs font-semibold text-[#0052ff] uppercase tracking-wide">Step 2</span>
                <p className="text-sm text-[#4a5568]">
                    {shouldRequestTestFunds
                      ? "Request test funds to continue."
                      : "Do not have test funds yet? Connect your wallet to receive your test funds."}
                </p>
                  <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleConnectBaseWallet}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#0052ff] text-white font-medium rounded-xl hover:bg-[#0042cc] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      aria-label={shouldRequestTestFunds ? "Request Test Funds" : "Connect your Base wallet"}
                  >
                      {shouldRequestTestFunds ? "Request Test Funds" : "Connect your Base wallet"}
                  </button>
                    {!shouldRequestTestFunds && (
                      <button
                        onClick={handleConnectOtherWallet}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="Connect another wallet"
                      >
                        Connect another wallet
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Left Column */}
          <div className="order-1 w-full lg:justify-self-end">
            {/* Mobile: Prominent download buttons (NO QR) - Enhanced CTA */}
            <div className="lg:hidden w-full">
              <div className="relative bg-linear-to-br from-[#0052ff] via-[#0066ff] to-[#0052ff] rounded-2xl p-[2px] animate-fade-in-up-with-pulse">
                {/* Inner content with gradient background */}
                <div className="bg-linear-to-b from-[#f8fafc] via-white to-[#fafbff] rounded-[14px] p-5 sm:p-6">
                  {/* Badge/Label */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-[#0052ff]/10 to-[#0066ff]/10 border border-[#0052ff]/20 rounded-full mb-3">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#0052ff] uppercase tracking-wide">
                      ⚡ Get Started — Step 1
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

              {/* Secondary CTA - Mobile (Step 2) */}
              <div className="mt-5 sm:mt-6 animate-fade-in-up delay-200 w-full flex justify-center">
                <div className="flex flex-col gap-2.5 sm:gap-3 items-center text-center">
                  <span className="text-[11px] sm:text-xs font-semibold text-[#0052ff] uppercase tracking-wide self-start">
                    Step 2
                  </span>
                  <p className="text-xs text-[#4a5568] max-w-[260px]">
                    {shouldRequestTestFunds ? "Request test funds to continue." : "Connect your wallet to receive your test funds."}
                  </p>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={handleConnectBaseWallet}
                      className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 text-[13px] sm:text-sm bg-[#0052ff] text-white font-medium rounded-full hover:bg-[#0042cc] transition-all active:scale-[0.95] touch-manipulation"
                      aria-label={shouldRequestTestFunds ? "Request Test Funds" : "Connect your Base wallet"}
                    >
                      {shouldRequestTestFunds ? "Request Test Funds" : "Connect your Base wallet"}
                    </button>
                    {!shouldRequestTestFunds && (
                      <button
                        onClick={handleConnectOtherWallet}
                        className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 text-[13px] sm:text-sm text-[#0052ff] font-medium border border-[#0052ff]/20 rounded-full hover:bg-[#0052ff]/5 transition-all active:scale-[0.95] touch-manipulation"
                        aria-label="Connect another wallet"
                      >
                        Connect another wallet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: QR Card */}
            <div className="hidden lg:block">
              <div className="qr-card bg-white border border-[#e2e4e9] rounded-2xl p-8 shadow-sm w-[360px] animate-fade-in-up delay-200">
                <div className="text-left">
                  <span className="text-xs font-semibold text-[#0052ff] uppercase tracking-wide">Step 1 (Optional)</span>
                  {!isConnected && (
                    <p className="text-xs text-[#4a5568] mt-0.5">Only if you don&apos;t have a wallet yet.</p>
                  )}
                  <h2 className="text-xl font-semibold text-[#0a0b0d] mt-1 mb-2">
                    Download Base App
                  </h2>
                  <p className="text-sm text-[#4a5568] mb-6 leading-relaxed">
                    Create, earn, trade, discover apps, and chat with friends all
                    in one place.
                  </p>
                </div>

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

                <p className="text-xs text-[#4a5568] mb-6 text-center">
                  Scan to download
                </p>

                {/* Store Buttons */}
                <div className="flex gap-3 justify-center">
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

      {/* Faucet Modal */}
      {showFaucetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="sticky top-0 bg-white border-b border-[#e2e4e9] px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-semibold text-[#0a0b0d]">
                  Request Test Tokens
                </h2>
                <button
                  onClick={() => setShowFaucetModal(false)}
                  className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 text-[#4a5568]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <FaucetRequest
                  onSuccess={handleFaucetSuccess}
                  embedded
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
