"use client";

import { CartItem as CartItemType } from "../context/CartContext";
import { useCart } from "../context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

// Product icon based on product name (same as ProductCard)
function ProductIcon({ name }: { name: string }) {
  const iconMap: { [key: string]: JSX.Element } = {
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

  // Default icon
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="12" width="40" height="40" rx="4"/>
      <circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  );
}

// Small placeholder thumbnail with product icon (matching carousel)
function PlaceholderThumbnail({ productName }: { productName: string }) {
  return (
    <div className="relative w-16 h-16 bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-[#0052ff]/5" />
      <div className="absolute bottom-2 left-1 w-4 h-4 rounded-full bg-[#0052ff]/5" />
      
      {/* Product Icon */}
      <ProductIcon name={productName} />
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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
