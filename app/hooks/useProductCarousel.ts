"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Product } from "@/app/context/CartContext";

export function useProductCarousel(products: Product[]) {
  const [activeIndex, setActiveIndex] = useState(
    () => Math.floor(products.length / 2)
  );
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev > 0) {
        const newIndex = prev - 1;
        if (newIndex === 0) setDirection("forward");
        return newIndex;
      }
      return prev;
    });
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < products.length - 1) {
        const newIndex = prev + 1;
        if (newIndex === products.length - 1) setDirection("backward");
        return newIndex;
      }
      return prev;
    });
  }, [products.length]);

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setActiveIndex((prev) => {
        if (newIndex === 0) setDirection("forward");
        else if (newIndex === products.length - 1) setDirection("backward");
        else if (newIndex > prev) setDirection("forward");
        else if (newIndex < prev) setDirection("backward");
        return newIndex;
      });
    },
    [products.length]
  );

  useEffect(() => {
    if (!isPaused && products.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          if (direction === "forward") {
            if (prev < products.length - 1) return prev + 1;
            setDirection("backward");
            return prev - 1;
          } else {
            if (prev > 0) return prev - 1;
            setDirection("forward");
            return prev + 1;
          }
        });
      }, 4000);
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isPaused, direction, products.length]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

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
      if (diff > 0 && activeIndex < products.length - 1) handleNext();
      else if (diff < 0 && activeIndex > 0) handlePrev();
    }

    setTimeout(() => setIsPaused(false), 2000);
  }, [handleNext, handlePrev, activeIndex, products.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        e.preventDefault();
        handlePrev();
      }
      if (e.key === "ArrowRight" && activeIndex < products.length - 1) {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext, activeIndex, products.length]
  );

  const containerProps = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onKeyDown: handleKeyDown,
  };

  return {
    activeIndex,
    handlePrev,
    handleNext,
    handleIndexChange,
    containerProps,
  };
}
