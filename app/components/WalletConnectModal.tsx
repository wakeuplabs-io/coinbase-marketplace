"use client";

import { useState } from "react";
import { useConnect, useConnectors } from "wagmi";

interface WalletOption {
  id: string;
  label: string;
  description?: string;
  isPrimary?: boolean;
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
    return {
      id: connectorId,
      label: "Base Wallet",
      description: "Extension or passkey (desktop)",
      isPrimary: true,
    };
  }
  if (connectorId === "walletConnect") {
    return {
      id: connectorId,
      label: "WalletConnect",
      description: "Scan QR code (desktop + Base app)",
      isPrimary: true,
    };
  }
  if (connectorId.includes("injected")) {
    return { id: connectorId, label: "Browser Wallet" };
  }

  return { id: connectorId, label: connectorName };
}

export default function WalletConnectModal({
  isOpen,
  onClose,
}: WalletConnectModalProps) {
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(
    null
  );

  if (!isOpen) return null;

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      setSelectedConnector(connectorId);
      connect({ connector }, { onSuccess: onClose });
    }
  };

  const sortedConnectors = [...connectors].sort(
    (a, b) =>
      (WALLET_ORDER[a.id] ?? 99) - (WALLET_ORDER[b.id] ?? 99)
  );

  console.log(connectors);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e4e9]">
          <h2 className="text-lg font-semibold text-[#0a0b0d]">
            Connect wallet
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
            aria-label="Close"
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

        <div className="p-4 space-y-2">
          <div className="flex gap-3 p-3 mb-3 rounded-xl bg-[#f8fafc] border border-[#e2e4e9]">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0052ff]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0052ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#0a0b0d]">Using Base app on mobile?</p>
              <p className="text-xs text-[#4a5568] mt-0.5">Open this page from Base Wallet → DApps tab to connect.</p>
            </div>
          </div>
          {sortedConnectors.map((connector) => {
            const option = getWalletOption(connector.id, connector.name);
            const isConnecting =
              isPending && selectedConnector === connector.id;

            return (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={isConnecting}
                className={`relative w-full flex flex-col items-start px-4 py-3 rounded-xl border transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed ${
                  option.isPrimary
                    ? "bg-[#0052ff]/5 border-[#0052ff]/20 hover:bg-[#0052ff]/10"
                    : "border-[#e2e4e9] hover:bg-[#f9fafb]"
                }`}
              >
                <span className="text-sm font-medium text-[#0a0b0d]">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-[#4a5568] mt-0.5">
                    {option.description}
                  </span>
                )}
                {isConnecting && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#4a5568]">
                    Connecting...
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
