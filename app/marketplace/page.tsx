"use client";

import ProductCarousel from "../components/ProductCarousel";
import CartSection from "../components/CartSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { useRouter } from "next/navigation";
export default function MarketplacePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col animated-gradient-bg h-screen overflow-hidden">
        {/* Floating orbs for background */}
        <div className="floating-orb floating-orb-1" aria-hidden="true" />
        <div className="floating-orb floating-orb-2" aria-hidden="true" />
        <div className="floating-orb floating-orb-3" aria-hidden="true" />

          <div className="marketplace-topbar fixed left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
            <Header
              showBackButton
              onBackClick={() => router.push("/")}
              onDisconnect={() => router.push("/")}
            />
          </div>

          {/* Main Content - 100vh minus header, scrollable */}
          <main
            id="main-content"
            className="flex-1 min-h-0 flex flex-col pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-14 overflow-y-auto"
          >
            {/* Product Carousel - fills 100vh area */}
            <section className="flex-1 min-h-0 flex flex-col items-center justify-center px-5 md:px-8 pt-4 pb-8">
              <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
                <ProductCarousel products={products} />
              </div>

              {/* Swipe hint - Mobile only */}
              <p className="md:hidden text-[11px] sm:text-xs text-[#4a5568] text-center animate-fade-in-up delay-200 mt-1">
                Swipe to browse products
              </p>
            </section>
          </main>

          {/* Cart Section - Fixed overlay above footer, does not push content */}
          <div className="fixed bottom-0 left-0 right-0 z-40 w-full flex justify-center px-4 animate-fade-in-up delay-100">
            <div className="w-full max-w-2xl">
              <CartSection />
            </div>
          </div>

          {/* Footer - Fixed at very bottom, below cart swipe */}
          <div className="fixed bottom-0 left-0 right-0 z-30 h-[60px]">
            <Footer />
          </div>
        </div>
  );
}
