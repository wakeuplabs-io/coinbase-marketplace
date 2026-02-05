"use client";

import ProductCarousel from "../components/ProductCarousel";
import CartSection from "../components/CartSection";
import { products } from "../data/products";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

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

// Back arrow icon component
function BackArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function MarketplacePage() {
  const router = useRouter();
  const { isCartOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col animated-gradient-bg">
        {/* Floating orbs for background */}
        <div className="floating-orb floating-orb-1" aria-hidden="true" />
        <div className="floating-orb floating-orb-2" aria-hidden="true" />
        <div className="floating-orb floating-orb-3" aria-hidden="true" />

          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0052ff] focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>

          {/* Header - Fixed at top */}
          <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#e2e4e9] bg-white/80 backdrop-blur-sm">
            <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2.5 text-sm font-semibold text-[#0a0b0d] hover:opacity-80 transition-opacity"
                aria-label="Back to home"
              >
                <BackArrowIcon />
                <CoinbaseLogo />
                <span className="tracking-tight">Coinbase Marketplace</span>
              </button>
              {/* Demo Badge */}
              <span className="px-2.5 py-1 text-xs font-medium bg-[#0052ff]/10 text-[#0052ff] rounded-full">
                Demo
              </span>
            </nav>
          </header>

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 flex flex-col pt-16"
          >
            {/* Product Carousel - Upper section */}
            <section 
              className={`flex-1 flex flex-col items-center px-5 md:px-8 pt-4 pb-8 transition-all duration-300 ${
                isCartOpen ? "justify-start" : "justify-center"
              }`}
            >
              <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
                <ProductCarousel products={products} />
              </div>

              {/* Swipe hint - Mobile only */}
              <p className="md:hidden text-xs text-[#4a5568] text-center animate-fade-in-up delay-200">
                Swipe to browse products
              </p>
            </section>

            {/* Cart Section - Always visible at bottom */}
            <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in-up delay-100">
              <CartSection />
            </div>
          </main>

          {/* Footer - Same as main site */}
          <footer className="w-full border-t border-[#e2e4e9] mt-auto bg-white/80 backdrop-blur-sm">
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
