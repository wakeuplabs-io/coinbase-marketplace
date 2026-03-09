"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useConnect, useConnectors } from "wagmi";

interface WalletOption {
  id: string;
  label: string;
  iconType: "base" | "walletconnect" | "metamask" | "browser" | "rabby" | "default";
  description: string;
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
    return { id: connectorId, label: "Base Wallet", iconType: "base", description: "Connect using the Base Wallet app on mobile or desktop" };
  }
  if (connectorId === "walletConnect") {
    return { id: connectorId, label: "WalletConnect", iconType: "walletconnect", description: "Scan with any WalletConnect compatible wallet to connect" };
  }
  if (connectorId.includes("metaMask") || connectorName.toLowerCase().includes("metamask")) {
    return { id: connectorId, label: "MetaMask", iconType: "metamask", description: "Connect using the MetaMask browser extension" };
  }
  if (connectorId.includes("injected")) {
    return { id: connectorId, label: "Browser Wallet", iconType: "browser", description: "Connect using your browser's built-in wallet" };
  }
  if (connectorName.toLowerCase().includes("rabby")) {
    return { id: connectorId, label: "Rabby Wallet", iconType: "rabby", description: "Connect using the Rabby Wallet browser extension" };
  }
  return { id: connectorId, label: connectorName, iconType: "default", description: "Connect using this wallet" };
}

function WalletIcon({ type, size = "md" }: { type: WalletOption["iconType"]; size?: "md" | "lg" }) {
  const sizeClass = size === "lg" ? "w-16 h-16 rounded-2xl" : "w-9 h-9 rounded-lg";
  const baseClass = `${sizeClass} flex items-center justify-center shrink-0`;
  switch (type) {
    case "base":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-0.5`}>
          <img src="/base-app-logo.png" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    case "walletconnect":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-1`}>
          <img src="/walletconnect-logo.png" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    case "metamask":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-1`}>
          <img src="/metamask-logo.png" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    case "browser":
      return (
        <div className={`${baseClass} bg-[#e2e4e9]`}>
          <svg className={size === "lg" ? "w-8 h-8" : "w-5 h-5"} style={{ color: "#4a5568" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      );
    case "rabby":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e2e4e9] p-1`}>
          <img src="/rabby-logo.svg" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    default:
      return (
        <div className={`${baseClass} bg-[#e2e4e9]`}>
          <span style={{ color: "#4a5568" }} className="font-medium text-xs">W</span>
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
  const [hoveredConnector, setHoveredConnector] = useState<string | null>(null);

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

  const activeId = hoveredConnector || selectedConnector;
  const activeConnector = activeId ? sortedConnectors.find((c) => c.id === activeId) : null;
  const activeOption = activeConnector
    ? getWalletOption(activeConnector.id, activeConnector.name)
    : null;

  const modalContent = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-backdrop">
      <div className="relative w-full max-w-[560px] bg-white rounded-2xl border border-[#e2e4e9] shadow-sm overflow-hidden animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e4e9]">
          <h2 className="text-base font-bold text-[#0a0b0d] tracking-tight">
            Connect a Wallet
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-[#4a5568]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Two-column body */}
        <div className="flex min-h-[360px]">

          {/* Left panel — wallet list */}
          <div className="w-[210px] shrink-0 bg-[#f9fafb] border-r border-[#e2e4e9] py-2">
            {sortedConnectors.map((connector) => {
              const option = getWalletOption(connector.id, connector.name);
              const isSelected = selectedConnector === connector.id;
              const isConnecting = isPending && isSelected;

              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  onMouseEnter={() => setHoveredConnector(connector.id)}
                  onMouseLeave={() => setHoveredConnector(null)}
                  disabled={isConnecting}
                  className={`w-full flex items-center gap-3 px-3 py-3 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed ${
                    isSelected ? "bg-white" : "hover:bg-white/60"
                  }`}
                >
                  <WalletIcon type={option.iconType} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#0a0b0d] truncate">{option.label}</div>
                    {isConnecting && (
                      <div className="text-xs text-[#4a5568]">Connecting...</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right panel — wallet detail / prompt */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            {activeOption ? (
              <>
                <WalletIcon type={activeOption.iconType} size="lg" />
                <h3 className="mt-4 text-base font-semibold text-[#0a0b0d]">
                  {activeOption.label}
                </h3>
                <p className="mt-2 text-sm text-[#4a5568] leading-relaxed max-w-[200px]">
                  {activeOption.description}
                </p>
                {isPending && selectedConnector === activeOption.id && (
                  <div className="mt-5 flex items-center gap-2 text-sm text-[#4a5568]">
                    <div className="w-4 h-4 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" aria-hidden />
                    <span>Connecting...</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#f3f4f6] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="text-sm text-[#4a5568] leading-relaxed max-w-[200px]">
                  Select a wallet to connect to the Base ecosystem
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="px-5 py-4 border-t border-[#e2e4e9] text-center text-sm text-[#4a5568] h-[60px]">
          New to crypto?{" "}
          <a
            href={LEARN_MORE_WALLETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#0052ff] hover:text-[#0042cc] hover:underline transition-colors"
          >
            Learn more about wallets
          </a>
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
