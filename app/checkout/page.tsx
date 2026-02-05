"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

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

// Bank icon component
function BankIcon() {
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M12 7V3" />
      <path d="M6 11h12" />
      <path d="M6 15h12" />
      <path d="M2 7h20" />
    </svg>
  );
}

// Lock icon for secure fields
function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Help/question mark icon
function HelpIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

// Credit card network logos
function CreditCardLogos() {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/payment-icons/cards/visa.sxIq5Dot.svg" 
        alt="Visa" 
        className="h-4 w-auto"
      />
      <img 
        src="/payment-icons/cards/mastercard.1c4_lyMp.svg" 
        alt="Mastercard" 
        className="h-4 w-auto"
      />
      <img 
        src="/payment-icons/cards/amex.Csr7hRoy.svg" 
        alt="American Express" 
        className="h-4 w-auto"
      />
      <span className="text-xs text-[#4a5568]">+5</span>
    </div>
  );
}

// Shop Pay logo component
function ShopPayLogo() {
  return (
    <div className="text-[#5a31f4] font-bold text-lg tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      shop
    </div>
  );
}

// Crypto wallet icons component
function CryptoWalletIcons() {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/payment-icons/crypto/basepay.6xyjPudB.svg" 
        alt="Base Pay" 
        className="h-6 w-auto"
      />
      <img 
        src="/payment-icons/crypto/metamask.B4X8-Ekf.svg" 
        alt="MetaMask" 
        className="h-6 w-auto"
      />
      <img 
        src="/payment-icons/crypto/rainbow.CI6ZIIhA.svg" 
        alt="Rainbow" 
        className="h-6 w-auto"
      />
      <span className="text-xs text-[#4a5568]">+480</span>
    </div>
  );
}

// Product icon for order summary (reusing from CartItem)
function ProductIcon({ name }: { name: string }) {
  const iconMap: { [key: string]: React.ReactElement } = {
    hoodie: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 16c0-4 5.4-8 12-8s12 4 12 8" strokeLinecap="round"/>
        <path d="M20 16l-10 8v12l8 4v16h28V40l8-4V24l-10-8"/>
        <path d="M24 16v8c0 2.2 3.6 4 8 4s8-1.8 8-4v-8"/>
        <circle cx="32" cy="20" r="2" fill="currentColor"/>
      </svg>
    ),
    wallet: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="16" width="48" height="36" rx="4"/>
        <path d="M8 24h48"/>
        <rect x="40" y="32" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="46" cy="36" r="2" fill="currentColor"/>
        <path d="M16 16V12a4 4 0 014-4h24a4 4 0 014 4v4"/>
      </svg>
    ),
    art: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="8" width="48" height="48" rx="2"/>
        <rect x="12" y="12" width="40" height="40" rx="1"/>
        <circle cx="24" cy="28" r="6" fill="currentColor" fillOpacity="0.2"/>
        <path d="M16 48l12-16 8 10 6-8 10 14"/>
      </svg>
    ),
    mug: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h32v28a4 4 0 01-4 4H16a4 4 0 01-4-4V20z"/>
        <path d="M44 24h6a4 4 0 014 4v8a4 4 0 01-4 4h-6"/>
        <path d="M20 12c2-4 6-4 8 0"/>
        <path d="M28 12c2-4 6-4 8 0"/>
        <path d="M20 28v12M28 28v12M36 28v12" strokeOpacity="0.3"/>
      </svg>
    ),
    cap: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="32" cy="40" rx="22" ry="8"/>
        <path d="M10 40c0-16 10-24 22-24s22 8 22 24"/>
        <path d="M10 40l-4 4h8"/>
        <ellipse cx="32" cy="40" rx="10" ry="3" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="32" cy="16" r="3" fill="currentColor"/>
      </svg>
    ),
    socks: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8v24c0 8 4 16 12 20h8c0-8-4-12-8-16V8"/>
        <path d="M36 8v20c4 4 8 8 8 16h8c-8-4-12-12-12-20V8"/>
        <path d="M16 16h12M36 16h12" strokeOpacity="0.5"/>
        <path d="M16 24h12M36 24h12" strokeOpacity="0.3"/>
      </svg>
    ),
  };

  const nameLower = name.toLowerCase();
  for (const key of Object.keys(iconMap)) {
    if (nameLower.includes(key)) {
      return iconMap[key];
    }
  }

  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="12" width="40" height="40" rx="4"/>
      <circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  );
}

function PlaceholderThumbnail({ productName, quantity }: { productName: string; quantity: number }) {
  return (
    <div className="relative flex-shrink-0">
      {quantity > 1 && (
        <div className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-[#0a0b0d] text-white rounded-full flex items-center justify-center text-[11px] font-semibold shadow-md">
          {quantity}
        </div>
      )}
      <div className="relative w-16 h-16 bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-[#0052ff]/5" />
        <div className="absolute bottom-2 left-1 w-4 h-4 rounded-full bg-[#0052ff]/5" />
        <ProductIcon name={productName} />
      </div>
    </div>
  );
}

function CheckoutContent() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "shop" | "crypto">("crypto");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#e2e4e9] bg-white">
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2.5 text-sm font-semibold text-[#0a0b0d] hover:opacity-80 transition-opacity"
            aria-label="Back to marketplace"
          >
            <BackArrowIcon />
            <CoinbaseLogo />
            <span className="tracking-tight">Coinbase Marketplace</span>
          </button>
          <span className="px-2.5 py-1 text-xs font-medium bg-[#0052ff]/10 text-[#0052ff] rounded-full">
            Demo
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 md:px-8 py-8 lg:py-12 pt-24 lg:pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Checkout Form */}
            <div className="order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[#0a0b0d] mb-4">Contact</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="full-name" className="block text-sm text-[#4a5568] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        name="full-name"
                        className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm text-[#4a5568] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[#0a0b0d] mb-2">Payment</h2>
                  <p className="text-sm text-[#4a5568] mb-6">All transactions are secure and encrypted.</p>

                  <div className="space-y-3">
                    {/* Credit Card - Disabled */}
                    <label className="flex items-start gap-3 p-4 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl cursor-not-allowed opacity-50 grayscale">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        checked={false}
                        disabled
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#0a0b0d]">Credit card</span>
                          <CreditCardLogos />
                        </div>
                      </div>
                    </label>

                    {/* Shop Pay - Disabled */}
                    <label className="flex items-center gap-3 p-4 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl cursor-not-allowed opacity-50 grayscale">
                      <input
                        type="radio"
                        name="payment"
                        value="shop"
                        checked={false}
                        disabled
                        className="mt-0.5"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#0a0b0d]">Shop Pay • Pay in full or in installments</span>
                        <ShopPayLogo />
                      </div>
                    </label>

                    {/* Crypto: USDC - Active */}
                    <label className="flex items-start gap-3 p-4 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl cursor-pointer hover:bg-white transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="crypto"
                        checked={paymentMethod === "crypto"}
                        onChange={() => setPaymentMethod("crypto")}
                        className="mt-1 w-4 h-4 text-[#0052ff] border-gray-300 focus:ring-[#0052ff] focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#0a0b0d]">Crypto: USDC</span>
                          <CryptoWalletIcons />
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-[#4a5568]">Make sure to use the same wallet connected previously.</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Billing Address Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[#0a0b0d] mb-4">Billing address</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="country" className="block text-sm text-[#4a5568] mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm text-[#4a5568] mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                        placeholder="Address"
                      />
                    </div>
                    <div>
                      <label htmlFor="apartment" className="block text-sm text-[#4a5568] mb-2">
                        Apartment, suite, etc. <span className="text-[#9ca3af]">(optional)</span>
                      </label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm text-[#4a5568] mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm text-[#4a5568] mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm text-[#4a5568] mb-2">
                          ZIP code
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0052ff]/20 focus:border-[#0052ff] transition-all"
                          placeholder="ZIP code"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pay Now Button */}
                <button
                  type="submit"
                  className="w-full px-5 py-3.5 bg-[#0a0b0d] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Pay now
                </button>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-[#0a0b0d] mb-6">Order summary</h2>
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-[#4a5568]">Your cart is empty</p>
                  ) : (
                    <>
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <PlaceholderThumbnail
                            productName={item.name}
                            quantity={item.quantity}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-[#0a0b0d] truncate">
                              {item.name}
                            </h3>
                          </div>
                          <div className="text-sm font-medium text-[#0a0b0d]">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-[#e2e4e9]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#0a0b0d]">Total</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#4a5568]">USD</span>
                            <span className="text-lg font-semibold text-[#0a0b0d]">
                              {formatPrice(subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
