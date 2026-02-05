"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import { useRouter } from "next/navigation";

// Empty cart illustration with sad face only
function EmptyCartIcon() {
  return (
    <div className="mx-auto mb-3 flex flex-col items-center">
      {/* Sad face emoji */}
      <div className="text-6xl mb-1">🥺</div>
    </div>
  );
}

export default function CartSection() {
  const { items, itemCount, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const cartRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const prevItemCountRef = useRef(itemCount);

  // Auto-open cart when an item is added
  useEffect(() => {
    if (itemCount > prevItemCountRef.current) {
      setIsCartOpen(true);
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount, setIsCartOpen]);

  // Calculate content height when open or items change
  useEffect(() => {
    const measureHeight = () => {
      if (contentRef.current) {
        // Temporarily set to auto to measure full height
        const originalMaxHeight = contentRef.current.style.maxHeight;
        const originalDisplay = contentRef.current.style.display;
        contentRef.current.style.maxHeight = "none";
        contentRef.current.style.display = "block";
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
        contentRef.current.style.maxHeight = originalMaxHeight;
        contentRef.current.style.display = originalDisplay;
      }
    };
    
    // Measure after a short delay to ensure DOM is updated
    const timeoutId = setTimeout(measureHeight, 0);
    return () => clearTimeout(timeoutId);
  }, [items, isCartOpen]);

  // Initialize closed on desktop view
  useEffect(() => {
    const checkDesktop = () => {
      if (window.innerWidth >= 768) {
        // Desktop view - start closed
        setIsCartOpen(false);
      } else {
        // Mobile view - start open
        setIsCartOpen(true);
      }
    };
    
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, [setIsCartOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setDragOffset(0);
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    
    // Allow dragging in both directions
    // Negative deltaY = dragging up, Positive deltaY = dragging down
    setDragOffset(deltaY);
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if we should open or close based on drag direction and distance
    if (isCartOpen) {
      // If open and dragged down more than 80px, close it
      if (dragOffset > 80) {
        setIsCartOpen(false);
      }
    } else {
      // If closed and dragged up more than 80px, open it
      if (dragOffset < -80) {
        setIsCartOpen(true);
      }
    }
    
    setDragOffset(0);
    setDragStartY(0);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDragMove);
      document.addEventListener("touchend", handleDragEnd);
      
      return () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("touchmove", handleDragMove);
        document.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, dragStartY, dragOffset, isCartOpen, setIsCartOpen]);

  return (
    <section
      ref={cartRef}
      className="w-full bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-[#e2e4e9] relative overflow-hidden"
      aria-label="Shopping cart"
    >
      {/* Drag handle / Tab - Always visible */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none touch-none"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="w-10 h-1 bg-[#e2e4e9] rounded-full" />
      </div>

      {/* Cart Content - Collapsible */}
      <div
        ref={contentRef}
        className="flex flex-col overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: 
            isDragging 
              ? (isCartOpen && dragOffset > 0) 
                ? `${Math.max(0, (contentHeight || 600) - dragOffset)}px` // When dragging down from open, reduce height
                : (dragOffset < 0) 
                  ? `${Math.min(contentHeight || 600, Math.abs(dragOffset))}px` // When dragging up from closed, show content progressively
                  : isCartOpen ? `${contentHeight || 600}px` : "0px"
              : isCartOpen ? (contentHeight > 0 ? `${contentHeight}px` : "600px") : "0px",
          opacity: 
            isDragging
              ? (isCartOpen && dragOffset > 0)
                ? Math.max(0, 1 - dragOffset / 300) // Fade out when dragging down
                : (dragOffset < -30)
                  ? Math.min(1, Math.abs(dragOffset) / 150) // Fade in when dragging up
                  : isCartOpen ? 1 : 0
              : isCartOpen ? 1 : 0,
          transition: isDragging 
            ? "none" 
            : "max-height 0.3s ease-out, opacity 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pb-3 border-b border-[#e2e4e9]">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-semibold text-[#0a0b0d]">Your Cart</h2>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#0052ff]/10 text-[#0052ff] rounded-full animate-pulse">
                {itemCount}
              </span>
            )}
          </div>
        </div>

        {/* Cart items - Scrollable area */}
        <div className="flex-1 min-h-0 px-5 overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <EmptyCartIcon />
              <p className="text-[#4a5568] font-medium">Your cart is empty</p>
              <p className="text-xs text-[#9ca3af] mt-1">Add items to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e2e4e9] py-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Always visible when items exist */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-[#e2e4e9] bg-white">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#4a5568]">Total:</span>
              <span className="text-lg font-semibold text-[#0a0b0d]">
                {formatPrice(subtotal)}
              </span>
              <button
                onClick={() => router.push("/checkout")}
                className="px-6 py-3 bg-[#0a0b0d] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1b1d] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap flex-shrink-0 ml-auto"
                aria-label="Buy items"
              >
                Buy
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
