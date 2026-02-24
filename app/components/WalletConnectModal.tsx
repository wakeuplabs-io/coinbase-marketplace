"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useConnect, useConnectors } from "wagmi";

interface WalletOption {
  id: string;
  label: string;
  iconType: "base" | "walletconnect" | "metamask" | "browser" | "rabby" | "default";
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_ORDER: Record<string, number> = {
  coinbaseWalletSDK: 0,
  walletConnect: 1,
  metaMaskSDK: 2,
  injected: 3,
};

function getWalletOption(connectorId: string, connectorName: string): WalletOption {
  if (connectorId.includes("coinbase") || connectorId === "coinbaseWalletSDK") {
    return { id: connectorId, label: "Base Wallet", iconType: "base" };
  }
  if (connectorId === "walletConnect") {
    return { id: connectorId, label: "WalletConnect", iconType: "walletconnect" };
  }
  if (connectorId.includes("metaMask") || connectorName.toLowerCase().includes("metamask")) {
    return { id: connectorId, label: "MetaMask", iconType: "metamask" };
  }
  if (connectorId.includes("injected")) {
    return { id: connectorId, label: "Browser Wallet", iconType: "browser" };
  }
  if (connectorName.toLowerCase().includes("rabby")) {
    return { id: connectorId, label: "Rabby Wallet", iconType: "rabby" };
  }
  return { id: connectorId, label: connectorName, iconType: "default" };
}

function WalletIcon({ type }: { type: WalletOption["iconType"] }) {
  const baseClass = "w-9 h-9 rounded-lg flex items-center justify-center shrink-0";
  switch (type) {
    case "base":
      return (
        <div className={`${baseClass} bg-[#0052ff]`}>
          <span className="text-white font-bold text-sm">B</span>
        </div>
      );
    case "walletconnect":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-1`}>
          <img
            src="/walletconnect-logo.png"
            alt=""
            className="w-full h-full object-contain"
            aria-hidden
          />
        </div>
      );
    case "metamask":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-1`}>
          <img
            src="/metamask-logo.png"
            alt=""
            className="w-full h-full object-contain"
            aria-hidden
          />
        </div>
      );
    case "browser":
      return (
        <div className={`${baseClass} bg-[#e2e4e9]`}>
          <svg className="w-5 h-5 text-[#4a5568]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      );
    case "rabby":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-1`}>
          <img
            src="/rabby-logo.svg"
            alt=""
            className="w-full h-full object-contain"
            aria-hidden
          />
        </div>
      );
    default:
      return (
        <div className={`${baseClass} bg-[#e2e4e9]`}>
          <span className="text-[#4a5568] font-medium text-xs">W</span>
        </div>
      );
  }
}

const LEARN_MORE_WALLETS_URL = "https://www.coinbase.com/learn/tips-and-tutorials/how-to-set-up-a-crypto-wallet";

export default function WalletConnectModal({
  isOpen,
  onClose,
}: WalletConnectModalProps) {
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isOpen || !mounted) return null;

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      setSelectedConnector(connectorId);
      connect({ connector }, { onSuccess: onClose });
    }
  };

  const sortedConnectors = [...connectors].sort(
    (a, b) => (WALLET_ORDER[a.id] ?? 99) - (WALLET_ORDER[b.id] ?? 99)
  );

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header: icon + title, close */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0052ff] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h2 className="text-lg font-bold text-[#0a0b0d]">
              Connect Wallet
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-[#4a5568]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Base app on mobile - light blue section */}
        <div className="mx-5 mb-4 p-4 rounded-xl bg-[#eff6ff] border border-[#bfdbfe]">
          <p className="text-sm text-[#0a0b0d]">Using Base app on mobile?</p>
          <p className="text-sm text-[#6b7280] mt-0.5">Open this page in the Base app to connect automatically.</p>
        </div>

        {/* Choose a Wallet */}
        <div className="px-5 pb-5">
          <h3 className="text-base font-semibold text-[#0a0b0d]">Choose a Wallet</h3>
          <p className="text-sm text-[#6b7280] mt-0.5">Select your preferred wallet to access the Base ecosystem</p>

          <div className="mt-4 space-y-1">
            {sortedConnectors.map((connector) => {
              const option = getWalletOption(connector.id, connector.name);
              const isConnecting = isPending && selectedConnector === connector.id;

              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isConnecting}
                  className="relative w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#f9fafb] transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <WalletIcon type={option.iconType} />
                  <span className="flex-1 text-sm font-medium text-[#0a0b0d]">
                    {option.label}
                  </span>
                  {isConnecting ? (
                    <span className="text-xs text-[#6b7280]">Connecting...</span>
                  ) : (
                    <svg className="w-5 h-5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer link */}
          <p className="mt-5 pt-4 border-t border-[#e2e4e9] text-center text-sm text-[#6b7280]">
            New to crypto?{" "}
            <a
              href={LEARN_MORE_WALLETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#0052ff] hover:text-[#0041cc] hover:underline transition-colors"
            >
              Learn more about wallets
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
