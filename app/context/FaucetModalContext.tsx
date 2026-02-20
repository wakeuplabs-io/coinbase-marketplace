"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import FaucetRequest from "@/app/components/FaucetRequest";

interface FaucetModalContextType {
  isOpen: boolean;
  openFaucetModal: () => void;
  closeFaucetModal: () => void;
}

const noop = () => {};

const FaucetModalContext = createContext<FaucetModalContextType>({
  isOpen: false,
  openFaucetModal: noop,
  closeFaucetModal: noop,
});

export function FaucetModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openFaucetModal = useCallback(() => setIsOpen(true), []);
  const closeFaucetModal = useCallback(() => setIsOpen(false), []);

  return (
    <FaucetModalContext.Provider
      value={{ isOpen, openFaucetModal, closeFaucetModal }}
    >
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="sticky top-0 bg-white border-b border-[#e2e4e9] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-xl font-semibold text-[#0a0b0d]">
                  Request Test Tokens
                </h2>
                <button
                  onClick={closeFaucetModal}
                  className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 text-[#4a5568]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <FaucetRequest onSuccess={closeFaucetModal} embedded />
              </div>
            </div>
          </div>
        </div>
      )}
    </FaucetModalContext.Provider>
  );
}

export function useFaucetModal(): FaucetModalContextType {
  return useContext(FaucetModalContext);
}
