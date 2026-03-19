"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useConnect, useConnectors } from "wagmi";

interface WalletOption {
  id: string;
  label: string;
  iconType: "base" | "walletconnect" | "metamask" | "browser" | "rabby" | "default";
  description: string;
}

function isBaseConnector(connectorId: string): boolean {
  return connectorId === "coinbaseWalletSDK" || connectorId.includes("coinbase");
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess?: () => void;
  /** When true, Base Wallet is hidden from the list (e.g. for "Connect another wallet" flow). */
  excludeBaseWallet?: boolean;
}

const WALLET_ORDER: Record<string, number> = {
  coinbaseWalletSDK: 0,
  walletConnect: 1,
  metaMaskSDK: 2,
  injected: 3,
};

/** First N sorted connectors are shown under "Popular" (RainbowKit-style grouping). */
const POPULAR_LIMIT = 4;

function getWalletOption(connectorId: string, connectorName: string): WalletOption {
  if (connectorId.includes("coinbase") || connectorId === "coinbaseWalletSDK") {
    return {
      id: connectorId,
      label: "Base Account",
      iconType: "base",
      description: "Connect using the Base app on mobile or desktop",
    };
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
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e5e7eb] p-0.5`}>
          <img src="/base-app-logo.png" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    case "walletconnect":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e5e7eb] p-1`}>
          <img src="/walletconnect-logo.png" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    case "metamask":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e5e7eb] p-1`}>
          <img src="/metamask-logo.png" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    case "browser":
      return (
        <div className={`${baseClass} bg-[#f3f4f6] border border-[#e5e7eb]`}>
          <svg className={size === "lg" ? "w-8 h-8" : "w-5 h-5"} style={{ color: "#6b7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      );
    case "rabby":
      return (
        <div className={`${baseClass} overflow-hidden bg-white border border-[#e5e7eb] p-1`}>
          <img src="/rabby-logo.svg" alt="" className="w-full h-full object-contain" aria-hidden />
        </div>
      );
    default:
      return (
        <div className={`${baseClass} bg-[#f3f4f6] border border-[#e5e7eb]`}>
          <span style={{ color: "#6b7280" }} className="font-medium text-xs">
            W
          </span>
        </div>
      );
  }
}

function InfoIconAssets() {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex gap-3">
        <div
          className="w-11 h-11 shrink-0 rounded-lg border border-[#e5e7eb] bg-white flex items-center justify-center overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          aria-hidden
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="11" height="11" rx="2" fill="#6366F1" />
            <rect x="17" y="4" width="11" height="11" rx="2" fill="#22C55E" />
            <rect x="4" y="17" width="11" height="11" rx="2" fill="#F59E0B" />
            <rect x="17" y="17" width="11" height="11" rx="2" fill="#EC4899" />
          </svg>
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-[#111827] leading-snug">A Home for your Digital Assets</h4>
          <p className="mt-1 text-sm text-[#6b7280] leading-relaxed">
            Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <div
          className="w-11 h-11 shrink-0 rounded-lg border border-[#e5e7eb] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          style={{
            background: "linear-gradient(135deg, #e879f9 0%, #a855f7 45%, #6366f1 100%)",
          }}
          aria-hidden
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white/95">
              <path
                d="M12 4L4 9v6l8 5 8-5V9l-8-5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.2"
              />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-[#111827] leading-snug">A New Way to Log In</h4>
          <p className="mt-1 text-sm text-[#6b7280] leading-relaxed">
            Instead of creating new accounts and passwords on every website, just connect your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

const LEARN_MORE_WALLETS_URL = "https://www.coinbase.com/learn/tips-and-tutorials/how-to-set-up-a-crypto-wallet";
const GET_WALLET_URL = "https://www.coinbase.com/wallet";

const listScrollClass =
  "max-h-[min(52vh,380px)] overflow-y-auto pr-1 " +
  "[scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent] " +
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d1d5db]";

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnectSuccess,
  excludeBaseWallet = false,
}: WalletConnectModalProps) {
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const sortedConnectors = useMemo(() => {
    const filtered = excludeBaseWallet ? connectors.filter((c) => !isBaseConnector(c.id)) : connectors;
    return [...filtered].sort((a, b) => (WALLET_ORDER[a.id] ?? 99) - (WALLET_ORDER[b.id] ?? 99));
  }, [connectors, excludeBaseWallet]);

  const popularConnectors = sortedConnectors.slice(0, POPULAR_LIMIT);
  const moreConnectors = sortedConnectors.slice(POPULAR_LIMIT);

  if (!isOpen || !mounted) return null;

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      setSelectedConnector(connectorId);
      connect({ connector }, { onSuccess: onConnectSuccess ?? onClose });
    }
  };

  const connectingOption = selectedConnector
    ? getWalletOption(
        selectedConnector,
        connectors.find((c) => c.id === selectedConnector)?.name ?? ""
      )
    : null;

  const renderWalletRow = (connector: (typeof connectors)[number]) => {
    const option = getWalletOption(connector.id, connector.name);
    const isSelected = selectedConnector === connector.id;
    const isConnecting = isPending && isSelected;

    return (
      <button
        key={connector.id}
        type="button"
        onClick={() => handleConnect(connector.id)}
        disabled={isConnecting}
        className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed ${
          isSelected ? "bg-[#f3f4f6]" : "hover:bg-[#f9fafb]"
        }`}
      >
        <WalletIcon type={option.iconType} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium text-[#111827] truncate">{option.label}</div>
          {isConnecting && <div className="text-xs text-[#6b7280] mt-0.5">Connecting…</div>}
        </div>
      </button>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-fade-backdrop">
      <div
        className="relative w-full max-w-[640px] bg-white rounded-[24px] border-2 border-[#1e3a5f] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)] overflow-hidden animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb] transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex min-h-[400px]">
          {/* Left — wallet list */}
          <div className="w-[min(42%,260px)] shrink-0 flex flex-col pl-5 pr-3 pt-14 pb-6 border-r border-[#e5e7eb]">
            <h2 id="wallet-modal-title" className="text-lg font-bold text-[#111827] tracking-tight pr-10">
              Connect a Wallet
            </h2>

            <div className={`mt-5 flex-1 min-h-0 ${listScrollClass}`}>
              {popularConnectors.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] px-2 mb-2">Popular</p>
                  <div className="flex flex-col gap-0.5">{popularConnectors.map(renderWalletRow)}</div>
                </div>
              )}
              {moreConnectors.length > 0 && (
                <div className={popularConnectors.length > 0 ? "mt-5" : ""}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] px-2 mb-2">More</p>
                  <div className="flex flex-col gap-0.5">{moreConnectors.map(renderWalletRow)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right — education + CTAs */}
          <div className="flex-1 flex flex-col px-8 pt-14 pb-8 min-w-0 bg-white">
            <h3 className="text-lg font-bold text-[#111827] text-center">What is a Wallet?</h3>

            <div className="mt-8 flex-1 flex flex-col justify-center">
              <InfoIconAssets />
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={GET_WALLET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-w-[200px] px-8 py-3 rounded-full bg-[#1a73e8] text-white text-[15px] font-semibold hover:bg-[#155fc4] transition-colors shadow-sm"
              >
                Get a Wallet
              </a>
              <a
                href={LEARN_MORE_WALLETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-medium text-[#1a73e8] hover:text-[#155fc4] hover:underline transition-colors"
              >
                Learn More
              </a>
            </div>

            {isPending && connectingOption && (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                <div className="w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" aria-hidden />
                <span>Opening {connectingOption.label}…</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
