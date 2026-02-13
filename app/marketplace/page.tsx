"use client";

import ProductCarousel from "../components/ProductCarousel";
import CartSection from "../components/CartSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

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

          <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-sm">
            <Header
              showBackButton
              onBackClick={() => router.push("/")}
            />
          </div>

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 flex flex-col pt-14 sm:pt-16"
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
              <p className="md:hidden text-[11px] sm:text-xs text-[#4a5568] text-center animate-fade-in-up delay-200 mt-1">
                Swipe to browse products
              </p>
            </section>

            {/* Cart Section - Always visible at bottom */}
            <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in-up delay-100">
              <CartSection />
            </div>
          </main>

          <Footer />
        </div>
  );
}
