"use client";

import Image from "next/image";
import BackArrowIcon from "./icons/BackArrowIcon";
import Link from "next/link";
import { useWallet } from "../hooks/useWallet";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  /** When true, back/logo triggers disconnect before `onBackClick` (e.g. marketplace → home). */
  disconnectOnBack?: boolean;
  showConnectWallet?: boolean;
  showDemoBadge?: boolean;
  onDisconnect?: () => void;
}

export default function Header({
  showBackButton = false,
  onBackClick,
  disconnectOnBack = false,
  showConnectWallet = true,
  showDemoBadge = false,
  onDisconnect,
}: HeaderProps) {
  const { address, isConnected, usdcBalance, isLoadingBalance, disconnect } = useWallet();
  const handleBackClick = () => {
    if (disconnectOnBack) {
      disconnect();
    }
    onBackClick?.();
  };
  const LogoLink = showBackButton ? (
    <button
      onClick={handleBackClick}
      className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-semibold text-[#0a0b0d] hover:opacity-80 transition-opacity min-w-0"
      aria-label="Back to home"
    >
      <BackArrowIcon className="sm:w-5 sm:h-5" size={18} />
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        <Image src="/coinbase-logo.svg" alt="" width={24} height={24} className="w-6 h-6 sm:w-7 sm:h-7" />
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
      <Image src="/coinbase-logo.svg" alt="" width={24} height={24} className="w-6 h-6" />
      <span className="tracking-tight hidden xs:inline">
        Coinbase Marketplace
      </span>
      <span className="tracking-tight xs:hidden">Coinbase</span>
    </Link>
  );

  return (
    <header className="w-full border-b border-[#e2e4e9]">
      <nav className="w-full max-w-6xl mx-auto px-3 sm:px-5 md:px-8 h-14 sm:h-16 flex items-center justify-between box-border">
        {LogoLink}
        <div className="flex items-center gap-2">
        {showDemoBadge && (
          <span className="px-2.5 py-1 text-xs font-medium bg-[#0052ff]/10 text-[#0052ff] rounded-full">
            Demo
          </span>
        )}
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
                  onClick={() => {
                    disconnect();
                    onDisconnect?.();
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#0052ff] border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Disconnect wallet"
                >
                  <span className="hidden xs:inline">Disconnect</span>
                  <span className="xs:hidden">Disconnect</span>
                </button>
              </div>
            ) : null}
          </>
        )}
        </div>
      </nav>
    </header>
  );
}
