"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Product } from "../context/CartContext";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(products.length / 2));
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const { addItem } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev > 0) {
        const newIndex = prev - 1;
        // Si llegamos al inicio, cambiar dirección del auto-play hacia adelante
        if (newIndex === 0) {
          setDirection("forward");
        }
        return newIndex;
      }
      return prev; // No hacer nada si está en el primer producto
    });
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < products.length - 1) {
        const newIndex = prev + 1;
        // Si llegamos al final, cambiar dirección del auto-play hacia atrás
        if (newIndex === products.length - 1) {
          setDirection("backward");
        }
        return newIndex;
      }
      return prev; // No hacer nada si está en el último producto
    });
  }, [products.length]);

  // Manejar cambio directo de índice (clicks en tarjetas o dots)
  const handleIndexChange = useCallback((newIndex: number) => {
    setActiveIndex((prev) => {
      // Actualizar dirección del auto-play según la posición y movimiento
      if (newIndex === 0) {
        setDirection("forward");
      } else if (newIndex === products.length - 1) {
        setDirection("backward");
      } else if (newIndex > prev) {
        setDirection("forward");
      } else if (newIndex < prev) {
        setDirection("backward");
      }
      return newIndex;
    });
  }, [products.length]);

  // Auto-play functionality - va y vuelve en lugar de rotar
  useEffect(() => {
    if (!isPaused && products.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          if (direction === "forward") {
            if (prev < products.length - 1) {
              return prev + 1;
            } else {
              // Llegamos al final, cambiar dirección hacia atrás
              setDirection("backward");
              return prev - 1;
            }
          } else {
            if (prev > 0) {
              return prev - 1;
            } else {
              // Llegamos al inicio, cambiar dirección hacia adelante
              setDirection("forward");
              return prev + 1;
            }
          }
        });
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isPaused, direction, products.length]);

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeIndex < products.length - 1) {
        handleNext();
      } else if (diff < 0 && activeIndex > 0) {
        handlePrev();
      }
    }
    
    // Resume auto-play after touch
    setTimeout(() => setIsPaused(false), 2000);
  }, [handleNext, handlePrev, activeIndex, products.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeIndex > 0) handlePrev();
      if (e.key === "ArrowRight" && activeIndex < products.length - 1) handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, activeIndex, products.length]);

  // Handle add to cart
  const handleAddToCart = useCallback((product: Product) => {
    addItem(product);
  }, [addItem]);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    // Base values
    let translateX = diff * 180; // Horizontal spacing
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = products.length - absDiff;
    let rotateY = 0;

    if (absDiff === 0) {
      // Active/center card
      translateZ = 50;
      scale = 1;
      opacity = 1;
    } else if (absDiff === 1) {
      // Adjacent cards - smoother positioning
      translateX = diff * 150;
      translateZ = -30;
      scale = 0.88;
      opacity = 0.8;
      rotateY = diff * -5; // Subtle rotation
    } else if (absDiff === 2) {
      // Outer cards
      translateX = diff * 130;
      translateZ = -80;
      scale = 0.75;
      opacity = 0.5;
      rotateY = diff * -8;
    } else {
      // Hidden cards
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
      {/* Carousel container with perspective */}
      <div
        ref={containerRef}
        className="relative h-[360px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Product carousel"
        aria-roledescription="carousel"
      >
        {/* Cards */}
        <div className="relative w-[220px] h-full" style={{ transformStyle: "preserve-3d" }}>
          {products.map((product, index) => (
            <div
              key={product.id}
              className="absolute top-0 left-0 w-full cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={getCardStyle(index)}
              onClick={() => handleIndexChange(index)}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${products.length}: ${product.name}`}
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

      {/* Navigation arrows - Desktop */}
      <button
        onClick={handlePrev}
        disabled={activeIndex === 0}
        className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-[#e2e4e9] rounded-full shadow-sm transition-all z-10 ${
          activeIndex === 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#f9fafb] hover:scale-105 active:scale-95"
        }`}
        aria-label="Previous product"
        aria-disabled={activeIndex === 0}
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
        aria-disabled={activeIndex === products.length - 1}
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

      {/* Pagination dots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4" role="tablist" aria-label="Carousel navigation">
        {products.map((product, index) => (
          <button
            key={product.id}
            onClick={() => handleIndexChange(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-[#0052ff] w-4 sm:w-6 h-1.5 sm:h-2"
                : "bg-[#e2e4e9] hover:bg-[#c8ccd4] w-1.5 sm:w-2 h-1.5 sm:h-2"
            }`}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${product.name}`}
          />
        ))}
      </div>
    </div>
  );
}
