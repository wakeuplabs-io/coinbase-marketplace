"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/app/context/CartContext";

import Header from "@/app/components/Header";
import ProductIcon from "@/app/components/ProductIcon";
import {
  CreditCardLogos,
  ShopPayLogo,
  CryptoWalletIcons,
} from "@/app/components/PaymentIcons";

import { usePayment } from "@/app/hooks/usePayment";

import { formatPrice } from "@/app/lib/utils";

import PaymentModal from "./paymentModal";

function PlaceholderThumbnail({
  productName,
  quantity,
}: {
  productName: string;
  quantity: number;
}) {
  return (
    <div className="relative shrink-0">
      {quantity > 1 && (
        <div className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-[#0a0b0d] text-white rounded-full flex items-center justify-center text-[11px] font-semibold shadow-md">
          {quantity}
        </div>
      )}
      <div className="relative w-16 h-16 bg-linear-to-br from-[#f8fafc] to-[#eef2ff] rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-[#0052ff]/5" />
        <div className="absolute bottom-2 left-1 w-4 h-4 rounded-full bg-[#0052ff]/5" />
        <ProductIcon name={productName} size="sm" />
      </div>
    </div>
  );
}

type PaymentMethod = "credit" | "shop" | "crypto";

function CheckoutContent() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [showPaymentComponent, setShowPaymentComponent] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { payment, isLoading, error, createPayment, reset } = usePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const formData = new FormData(formRef.current!);
    const name = formData.get("full-name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      setModalError("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      setModalError("Your cart is empty");
      return;
    }

    await createPayment({
      maxAmount: subtotal.toFixed(2),
      customer: {
        name,
        email,
      },
    });
    setShowPaymentComponent(true);
  };

  const handleCloseModal = () => {
    setShowPaymentComponent(false);
    setModalError(null);
    reset();
  };

  const handleModalError = (errorMsg: string) => {
    setModalError(errorMsg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white">
        <Header
          showBackButton
          onBackClick={() => router.back()}
          showConnectWallet={false}
        />
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex justify-end">
          <span className="px-2.5 py-1 text-xs font-medium bg-[#0052ff]/10 text-[#0052ff] rounded-full">
            Demo
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-5 md:px-8 py-8 lg:py-12 pt-24 lg:pt-28">
        <div className="max-w-6xl mx-auto">
          {!showPaymentComponent && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Left Column - Checkout Form */}
              <div className="order-2 lg:order-1">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
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

                {/* Error Message */}
                {(error || modalError) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error || modalError}</p>
                  </div>
                )}

                {/* Pay Now Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-5 py-3.5 bg-[#0a0b0d] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? "Processing..." : "Pay now"}
                </button>
                <p className="mt-1.5 text-xs text-[#4a5568] text-center">
                  Remember to pay with the previously connected wallet.
                </p>
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
          )}
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentComponent}
        payment={payment}
        onClose={handleCloseModal}
        onError={handleModalError}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
