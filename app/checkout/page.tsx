"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { useCart } from "@/app/context/CartContext";
import Header from "@/app/components/Header";
import ProductIcon from "@/app/components/ProductIcon";
import {
  CreditCardLogos,
  PayPalLogo,
  CryptoWalletIcons,
} from "@/app/components/PaymentIcons";
import { formatPrice } from "@/app/lib/utils";

import { useCheckoutForm } from "@/app/checkout/hooks/useCheckoutForm";
import { useCheckoutFunds } from "@/app/checkout/hooks/useCheckoutFunds";
import { useCheckoutOrder } from "@/app/checkout/hooks/useCheckoutOrder";

import PaymentModal from "./paymentModal";
import FaucetRequest from "@/app/components/FaucetRequest";

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
  const [showFaucetModal, setShowFaucetModal] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useCheckoutForm();
  const { insufficientFunds, usdcBalance } = useCheckoutFunds();
  const {
    submitOrder,
    handleCloseModal,
    modalError,
    payment,
    isLoading,
    isPreparingPayment,
    error,
    handlePaymentSuccess,
  } = useCheckoutOrder();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Load Coinbase payment script on checkout mount so it's ready when user clicks Pay */}
      <Script
        src="https://payments.coinbase.com/payments/components/v1/payment-link.mjs"
        strategy="afterInteractive"
        type="module"
        crossOrigin="anonymous"
      />
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white">
        <Header
          showBackButton
          onBackClick={() => router.back()}
          showConnectWallet={false}
          showDemoBadge
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-5 md:px-8 py-6 lg:py-10 pt-24 lg:pt-28">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left Column - Checkout Form */}
              <div className="order-2 lg:order-1">
                <form onSubmit={handleSubmit(submitOrder)} className="space-y-6">
                {/* Contact Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[#0a0b0d] mb-3">Contact</h2>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="full-name" className="block text-sm text-[#4a5568] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        {...register("full-name")}
                        className={`w-full px-4 py-3 bg-[#f9fafb] border rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 transition-all ${
                          errors["full-name"]
                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                            : "border-[#e2e4e9] focus:ring-[#0052ff]/20 focus:border-[#0052ff]"
                        }`}
                        placeholder="Full Name"
                      />
                      {errors["full-name"] && (
                        <p className="mt-1 text-sm text-red-600">{errors["full-name"].message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm text-[#4a5568] mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className={`w-full px-4 py-3 bg-[#f9fafb] border rounded-xl text-[#0a0b0d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                            : "border-[#e2e4e9] focus:ring-[#0052ff]/20 focus:border-[#0052ff]"
                        }`}
                        placeholder="Email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Payment Section */}
                <section>
                  <h2 className="text-lg font-semibold text-[#0a0b0d] mb-2">Payment</h2>
                  <p className="text-sm text-[#4a5568] mb-4">All transactions are secure and encrypted.</p>

                  <div className="space-y-2">
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

                    {/* PayPal - Disabled */}
                    <label className="flex items-center gap-3 p-4 bg-[#f9fafb] border border-[#e2e4e9] rounded-xl cursor-not-allowed opacity-50 grayscale">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={false}
                        disabled
                        className="mt-0.5"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#0a0b0d]">PayPal</span>
                        <PayPalLogo />
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
                          <span className="text-sm font-medium text-[#0a0b0d]">Stablecoin</span>
                          <CryptoWalletIcons />
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-[#4a5568]">Make sure to use the same wallet connected previously.</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Insufficient funds warning */}
                {insufficientFunds && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">
                      Insufficient funds
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      You need {formatPrice(subtotal - usdcBalance)} more to complete this purchase.
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      Your balance: {formatPrice(usdcBalance)} | Total: {formatPrice(subtotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowFaucetModal(true)}
                      className="mt-2 text-sm font-medium text-[#0052ff] hover:underline"
                    >
                      Get test tokens
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {(error || modalError) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error || modalError}</p>
                  </div>
                )}

                {/* Pay Now Button */}
                <button
                  type="submit"
                  disabled={isLoading || isPreparingPayment || insufficientFunds}
                  className="w-full mb-3 px-5 py-3 bg-[#0a0b0d] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {(isLoading || isPreparingPayment) ? "Processing..." : "Pay now"}
                </button>
                <p className="text-xs text-[#4a5568] text-center">
                  Remember to pay with the previously connected wallet.
                </p>
              </form>
              </div>

              {/* Right Column - Order Summary */}
              <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-[#0a0b0d] mb-4">Order summary</h2>
                <div className="space-y-3">
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
                      <div className="pt-3 border-t border-[#e2e4e9]">
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={!!payment || isPreparingPayment}
        payment={payment}
        isLoading={isPreparingPayment || isLoading}
        onClose={handleCloseModal}
        onPaymentSuccess={handlePaymentSuccess}
      />

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
                  onSuccess={() => setShowFaucetModal(false)}
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-sm text-[#4a5568]">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
