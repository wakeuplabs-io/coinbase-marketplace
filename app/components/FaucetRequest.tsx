"use client";

import { useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { waitForTransactionReceipt } from 'viem/actions';
import { useFaucet } from '../hooks/useFaucet';
import { useWallet } from '../hooks/useWallet';

const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

interface FaucetRequestProps {
  onSuccess?: () => void;
  /** When true, omits title and outer container (for use inside modal) */
  embedded?: boolean;
}

export default function FaucetRequest({ onSuccess, embedded }: FaucetRequestProps) {
  const {
    address,
    isConnected,
    isLoading: isWalletLoading,
    error: walletError,
    refetchUsdcBalance,
  } = useWallet();
  const { openConnectModal } = useConnectModal();
  const { requestFaucet, isLoading: isFaucetLoading, error: faucetError, reset } = useFaucet();
  const [success, setSuccess] = useState<{ transactionHash: string; explorerUrl: string } | null>(null);
  const [isConfirmingOnChain, setIsConfirmingOnChain] = useState(false);

  const isLoading = isWalletLoading || isFaucetLoading || isConfirmingOnChain;
  const error = walletError || faucetError;

  const handleRequestFaucet = async () => {
    reset();
    setSuccess(null);

    if (!address) {
      return;
    }

    try {
      const result = await requestFaucet({
        address: address,
        token: 'usdc',
      });

      setIsConfirmingOnChain(true);
      try {
        await waitForTransactionReceipt(baseSepoliaClient, {
          hash: result.transactionHash as `0x${string}`,
          timeout: 180_000,
        });
      } catch (waitErr) {
        console.warn(
          '[FaucetRequest] Transaction receipt wait failed or timed out; balance may still update shortly.',
          waitErr
        );
      }

      await refetchUsdcBalance();
      setTimeout(() => {
        void refetchUsdcBalance();
      }, 2_000);
      setTimeout(() => {
        void refetchUsdcBalance();
      }, 6_000);

      setSuccess({
        transactionHash: result.transactionHash,
        explorerUrl: result.explorerUrl,
      });
      onSuccess?.();
    } catch (err) {
      console.error('Faucet request failed:', err);
    } finally {
      setIsConfirmingOnChain(false);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    reset();
  };

  return (
    <div className={`w-full max-w-md mx-auto ${embedded ? "" : "p-6"}`}>
      <div className={embedded ? "" : "bg-white border border-[#e2e4e9] rounded-2xl p-6 shadow-sm"}>
        {!embedded && (
          <h2 className="text-xl font-semibold text-[#0a0b0d] mb-2">
            Request Test Tokens
          </h2>
        )}
        <p className="text-sm text-[#4a5568] mb-6">
          Get test USDC tokens on Base Sepolia for testing
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-green-800">
                  Faucet request successful!
                </span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Transaction hash: <code className="text-xs bg-green-100 px-2 py-1 rounded">{success.transactionHash.slice(0, 10)}...{success.transactionHash.slice(-8)}</code>
              </p>
              <a
                href={success.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium underline"
              >
                View on BaseScan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2.5 text-sm font-medium text-[#0052ff] border border-[#0052ff]/20 rounded-xl hover:bg-[#0052ff]/5 transition-all"
            >
              Request More Tokens
            </button>
          </div>
        ) : !isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 mb-4">
                Connect your wallet to request test tokens. We&apos;ll use your connected wallet address automatically.
              </p>
              <button
                onClick={() => openConnectModal?.()}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-[#0052ff] text-white rounded-xl font-medium hover:bg-[#0042cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0052ff]"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-green-800">Wallet Connected</span>
              </div>
              <p className="text-xs text-green-700 font-mono break-all">
                {address}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleRequestFaucet}
              disabled={isLoading || !address}
              className="w-full px-4 py-2.5 bg-[#0052ff] text-white rounded-xl font-medium hover:bg-[#0042cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0052ff]"
            >
              {isConfirmingOnChain
                ? 'Confirming on chain...'
                : isLoading
                  ? 'Requesting...'
                  : 'Request USDC'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
