"use client";

import { useState } from "react";
import CoinbaseLogo from "./icons/CoinbaseLogo";
import BackArrowIcon from "./icons/BackArrowIcon";
import Link from "next/link";
import { useWallet } from "../hooks/useWallet";
import WalletConnectModal from "./WalletConnectModal";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  showConnectWallet?: boolean;
}

export default function Header({
  showBackButton = false,
  onBackClick,
  showConnectWallet = true,
}: HeaderProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { address, isConnected, isLoading, usdcBalance, isLoadingBalance, disconnect } = useWallet();
  const LogoLink = showBackButton ? (
    <button
      onClick={onBackClick}
      className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-semibold text-[#0a0b0d] hover:opacity-80 transition-opacity min-w-0"
      aria-label="Back to home"
    >
      <BackArrowIcon className="sm:w-5 sm:h-5" size={18} />
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        <CoinbaseLogo className="sm:w-7 sm:h-7" size={24} />
        <span className="tracking-tight hidden xs:inline truncate">
          Coinbase Marketplace
        </span>
        <span className="tracking-tight xs:hidden truncate">Marketplace</span>
      </div>
    </button>
  ) : (
    <Link
      href="/"
      className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-semibold text-[#0a0b0d] hover:opacity-80 transition-opacity"
      aria-label="Coinbase Marketplace home"
    >
      <CoinbaseLogo />
      <span className="tracking-tight hidden xs:inline">
        Coinbase Marketplace
      </span>
      <span className="tracking-tight xs:hidden">Coinbase</span>
    </Link>
  );

  return (
    <header className="w-full border-b border-[#e2e4e9]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 h-14 sm:h-16 flex items-center justify-between">
        {LogoLink}
        {showConnectWallet && (
          <>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end gap-0.5 px-3 py-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#4a5568]">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-mono text-[10px]">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-[#4a5568]">
                    {isLoadingBalance ? (
                      <span className="text-[#9ca3af]">Loading...</span>
                    ) : (
                      <span>${usdcBalance.toFixed(2)} USDC</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={disconnect}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#0052ff] border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Disconnect wallet"
                >
                  <span className="hidden xs:inline">Disconnect</span>
                  <span className="xs:hidden">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConnectModal(true)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#0052ff] border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Connect your crypto wallet"
              >
                <span className="hidden xs:inline">
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </span>
                <span className="xs:hidden">{isLoading ? '...' : 'Connect'}</span>
              </button>
            )}
          </>
        )}
      </nav>

      <WalletConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </header>
  );
}
