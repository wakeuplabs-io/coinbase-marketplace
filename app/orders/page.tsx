"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CompletedOrder } from "@/app/context/CartContext";
import Header from "@/app/components/Header";
import ProductIcon from "@/app/components/ProductIcon";
import { formatPrice } from "@/app/lib/utils";

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

function OrderCard({ order }: { order: CompletedOrder }) {
  const formattedDate = new Date(order.completedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-[#e2e4e9] rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0a0b0d] mb-1">
            Order #{order.id.slice(-8)}
          </h3>
          <p className="text-xs text-[#4a5568]">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-[#0a0b0d]">
            {formatPrice(order.subtotal)}
          </p>
        </div>
      </div>

      {order.customerName && (
        <div className="mb-4 pb-4 border-b border-[#e2e4e9]">
          <p className="text-xs text-[#4a5568]">
            <span className="font-medium">Customer:</span> {order.customerName}
          </p>
          {order.customerEmail && (
            <p className="text-xs text-[#4a5568] mt-1">
              <span className="font-medium">Email:</span> {order.customerEmail}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <PlaceholderThumbnail
              productName={item.name}
              quantity={item.quantity}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-[#0a0b0d] truncate">
                {item.name}
              </h4>
              <p className="text-xs text-[#4a5568]">
                Quantity: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-[#0a0b0d]">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { getCompletedOrders } = useCart();
  const [orders] = useState<CompletedOrder[]>(() => getCompletedOrders());

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white">
        <Header
          showBackButton
          onBackClick={() => router.back()}
          showConnectWallet={true}
        />
      </div>

      <main className="flex-1 px-5 md:px-8 py-8 lg:py-12 pt-24 lg:pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#0a0b0d] mb-2">
              My Orders
            </h1>
            <p className="text-sm text-[#4a5568]">
              History of your completed orders
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#f9fafb] border border-[#e2e4e9] rounded-xl p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-[#9ca3af]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-[#0a0b0d] mb-2">
                No orders yet
              </h3>
              <p className="text-sm text-[#4a5568] mb-6">
                Your completed orders will appear here
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0052ff] border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all"
              >
                Go to shop
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
