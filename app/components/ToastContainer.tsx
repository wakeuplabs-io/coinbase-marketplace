"use client";

import { useToast } from "../context/ToastContext";

function CheckIcon() {
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
      className="text-green-500"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function TrashIcon() {
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
      className="text-red-500"
    >
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CartIcon() {
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
      className="text-[#0052ff]"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-28 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in flex items-center gap-3 bg-white border border-[#e2e4e9] rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-[350px]"
          onClick={() => removeToast(toast.id)}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {toast.type === "add" ? (
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <CheckIcon />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <TrashIcon />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0a0b0d] truncate">
              {toast.productName}
            </p>
            <p className="text-xs text-[#4a5568]">
              {toast.type === "add" ? "Added to cart" : "Removed from cart"}
            </p>
          </div>

          {/* Cart icon */}
          <div className="flex-shrink-0">
            <CartIcon />
          </div>
        </div>
      ))}
    </div>
  );
}
