"use client";

import { useState } from "react";
import { Product } from "../context/CartContext";
import ProductIcon from "./ProductIcon";
import { formatPrice } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  isActive: boolean;
  onAddToCart: () => void;
}

// Placeholder image component with product icon
function PlaceholderImage({ productName, badge }: { productName: string; badge?: string }) {
  return (
    <div className="relative w-full aspect-square bg-linear-to-br from-[#f8fafc] to-[#eef2ff] flex items-center justify-center rounded-t-2xl overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-[#0052ff]/5" />
      <div className="absolute bottom-8 left-4 w-12 h-12 rounded-full bg-[#0052ff]/5" />
      
      <ProductIcon name={productName} size="md" />

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-[#0052ff] text-white rounded-full shadow-sm">
          {badge}
        </div>
      )}
    </div>
  );
}

export default function ProductCard({
  product,
  isActive,
  onAddToCart,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAdding(true);
    onAddToCart();
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleAddTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
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
              type="button"
              onClick={handleAddClick}
              onTouchStart={handleAddTouch}
              onTouchEnd={handleAddTouch}
              className={`relative z-10 px-3 py-1.5 text-xs font-semibold bg-[#0a0b0d] text-white rounded-lg hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation ${isAdding ? "animate-scale-bounce" : ""}`}
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
