"use client";

import { CartItem as CartItemType } from "../context/CartContext";
import { useCart } from "../context/CartContext";
import ProductIcon from "./ProductIcon";
import { formatPrice } from "../lib/utils";

interface CartItemProps {
  item: CartItemType;
}

// Small placeholder thumbnail with product icon (matching carousel)
function PlaceholderThumbnail({ productName }: { productName: string }) {
  return (
    <div className="relative w-16 h-16 bg-linear-to-br from-[#f8fafc] to-[#eef2ff] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-[#0052ff]/5" />
      <div className="absolute bottom-2 left-1 w-4 h-4 rounded-full bg-[#0052ff]/5" />
      
      <ProductIcon name={productName} size="sm" />
    </div>
  );
}

function MinusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity } = useCart();

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Thumbnail */}
      <PlaceholderThumbnail productName={item.name} />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-[#0a0b0d] truncate">
              {item.name}
            </h4>
            <p className="text-sm text-[#4a5568] mt-0.5">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 border border-[#e2e4e9] rounded-lg">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 flex items-center justify-center text-[#4a5568] hover:text-[#0a0b0d] hover:bg-[#f9fafb] rounded-l-lg transition-colors"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <MinusIcon />
        </button>
        <span className="w-8 text-center text-sm font-medium text-[#0a0b0d]">
          {item.quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center text-[#4a5568] hover:text-[#0a0b0d] hover:bg-[#f9fafb] rounded-r-lg transition-colors"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
