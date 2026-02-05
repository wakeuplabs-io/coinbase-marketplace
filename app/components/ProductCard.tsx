"use client";

import { ReactElement, useState } from "react";
import { Product } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  isActive: boolean;
  onAddToCart: () => void;
}

// Product icon based on product name
function ProductIcon({ name }: { name: string }) {
  const iconMap: { [key: string]: ReactElement } = {
    hoodie: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 16c0-4 5.4-8 12-8s12 4 12 8" strokeLinecap="round"/>
        <path d="M20 16l-10 8v12l8 4v16h28V40l8-4V24l-10-8"/>
        <path d="M24 16v8c0 2.2 3.6 4 8 4s8-1.8 8-4v-8"/>
        <circle cx="32" cy="20" r="2" fill="currentColor"/>
      </svg>
    ),
    wallet: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="16" width="48" height="36" rx="4"/>
        <path d="M8 24h48"/>
        <rect x="40" y="32" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="46" cy="36" r="2" fill="currentColor"/>
        <path d="M16 16V12a4 4 0 014-4h24a4 4 0 014 4v4"/>
      </svg>
    ),
    art: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="8" width="48" height="48" rx="2"/>
        <rect x="12" y="12" width="40" height="40" rx="1"/>
        <circle cx="24" cy="28" r="6" fill="currentColor" fillOpacity="0.2"/>
        <path d="M16 48l12-16 8 10 6-8 10 14"/>
      </svg>
    ),
    mug: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h32v28a4 4 0 01-4 4H16a4 4 0 01-4-4V20z"/>
        <path d="M44 24h6a4 4 0 014 4v8a4 4 0 01-4 4h-6"/>
        <path d="M20 12c2-4 6-4 8 0"/>
        <path d="M28 12c2-4 6-4 8 0"/>
        <path d="M20 28v12M28 28v12M36 28v12" strokeOpacity="0.3"/>
      </svg>
    ),
    cap: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="32" cy="40" rx="22" ry="8"/>
        <path d="M10 40c0-16 10-24 22-24s22 8 22 24"/>
        <path d="M10 40l-4 4h8"/>
        <ellipse cx="32" cy="40" rx="10" ry="3" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="32" cy="16" r="3" fill="currentColor"/>
      </svg>
    ),
    socks: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#0052ff]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="12" width="40" height="40" rx="4"/>
      <circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  );
}

// Placeholder image component with product icon
function PlaceholderImage({ productName, badge }: { productName: string; badge?: string }) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] flex items-center justify-center rounded-t-2xl overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-[#0052ff]/5" />
      <div className="absolute bottom-8 left-4 w-12 h-12 rounded-full bg-[#0052ff]/5" />
      
      {/* Product Icon */}
      <ProductIcon name={productName} />

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-[#0052ff] text-white rounded-full shadow-sm">
          {badge}
        </div>
      )}
    </div>
  );
}

export default function ProductCard({ product, isActive, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart();
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div
      className={`
        bg-white border border-[#e2e4e9] rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        ${isActive ? "shadow-lg" : "shadow-sm"}
      `}
    >
      {/* Product Image */}
      <PlaceholderImage productName={product.name} badge={product.badge} />

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#0a0b0d] truncate">
          {product.name}
        </h3>
        
        {/* Description - limited to 2 lines */}
        <p className="mt-1 text-[11px] text-[#4a5568] line-clamp-2 leading-tight">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-medium text-[#0a0b0d]">
            {formatPrice(product.price)}
          </span>
          {isActive && (
            <button
              onClick={handleAddClick}
              className={`px-3 py-1.5 text-xs font-semibold bg-[#0a0b0d] text-white rounded-lg hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98] ${isAdding ? "animate-scale-bounce" : ""}`}
              aria-label={`Add ${product.name} to cart`}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
