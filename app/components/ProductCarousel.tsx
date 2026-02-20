"use client";

import { useCallback } from "react";
import { Product } from "../context/CartContext";
import { useCart } from "../context/CartContext";
import { useProductCarousel } from "../hooks/useProductCarousel";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const { addItem } = useCart();
  const {
    activeIndex,
    handlePrev,
    handleNext,
    handleIndexChange,
    containerProps,
  } = useProductCarousel(products);

  const handleAddToCart = useCallback(
    (product: Product) => addItem(product),
    [addItem]
  );

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    let translateX = diff * 180;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    const zIndex = products.length - absDiff;
    let rotateY = 0;

    if (absDiff === 0) {
      translateZ = 50;
      scale = 1;
      opacity = 1;
    } else if (absDiff === 1) {
      translateX = diff * 150;
      translateZ = -30;
      scale = 0.88;
      opacity = 0.8;
      rotateY = diff * -5;
    } else if (absDiff === 2) {
      translateX = diff * 130;
      translateZ = -80;
      scale = 0.75;
      opacity = 0.5;
      rotateY = diff * -8;
    } else {
      translateX = diff * 110;
      translateZ = -120;
      scale = 0.65;
      opacity = 0;
      rotateY = diff * -10;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
    };
  };

  return (
    <div className="relative w-full py-8 overflow-hidden">
      <div
        className="relative h-[360px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
        tabIndex={0}
        role="region"
        aria-label="Product carousel"
        aria-roledescription="carousel"
        {...containerProps}
      >
        <div
          className="relative w-[220px] h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="absolute top-0 left-0 w-full cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={getCardStyle(index)}
              onClick={() => handleIndexChange(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleIndexChange(index);
                }
              }}
              role="button"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${products.length}: ${product.name}`}
              aria-hidden={index !== activeIndex}
            >
              <ProductCard
                product={product}
                isActive={index === activeIndex}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePrev}
        disabled={activeIndex === 0}
        className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-[#e2e4e9] rounded-full shadow-sm transition-all z-10 ${
          activeIndex === 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#f9fafb] hover:scale-105 active:scale-95"
        }`}
        aria-label="Previous product"
      >
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        disabled={activeIndex === products.length - 1}
        className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-[#e2e4e9] rounded-full shadow-sm transition-all z-10 ${
          activeIndex === products.length - 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#f9fafb] hover:scale-105 active:scale-95"
        }`}
        aria-label="Next product"
      >
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div
        className="flex justify-center gap-1.5 sm:gap-2 mt-4"
        role="group"
        aria-label="Slide navigation"
      >
        {products.map((product, index) => (
          <button
            key={product.id}
            onClick={() => handleIndexChange(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-[#0052ff] w-4 sm:w-6 h-1.5 sm:h-2"
                : "bg-[#e2e4e9] hover:bg-[#c8ccd4] w-1.5 sm:w-2 h-1.5 sm:h-2"
            }`}
            aria-label={`Go to ${product.name}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
