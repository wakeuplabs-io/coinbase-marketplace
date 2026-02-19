"use client";

import { useState } from 'react';
import { useConnect, useConnectors } from 'wagmi';
import { config } from '../lib/config';
import AppleLogo from './icons/AppleLogo';
import PlayStoreLogo from './icons/PlayStoreLogo';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      setSelectedConnector(connectorId);
      // Coinbase Wallet connector will handle passkey authentication automatically
      connect({ connector }, { onSuccess: onClose });
    }
  };

  const getConnectorName = (connectorId: string) => {
    if (connectorId.includes('coinbase')) return 'Coinbase Wallet';
    if (connectorId.includes('metamask')) return 'MetaMask';
    if (connectorId.includes('injected')) return 'Browser Wallet';
    return 'Wallet';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="sticky top-0 bg-white border-b border-[#e2e4e9] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-[#0a0b0d]">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
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

        <div className="p-6 space-y-4">
          {/* Base App Section */}
          <div className="p-4 bg-linear-to-br from-[#0052ff]/5 to-[#0066ff]/5 border border-[#0052ff]/20 rounded-xl">
            <h3 className="text-sm font-semibold text-[#0a0b0d] mb-2">
              Connect with Base App
            </h3>
            <p className="text-xs text-[#4a5568] mb-4">
              Use your passkey to connect securely. You&apos;ll be prompted to authenticate with your device&apos;s biometric or security method.
            </p>
            
            {/* Connect with Base App button */}
            <div className="mb-4">
              <button
                onClick={() => {
                  const coinbaseConnector = connectors.find((c) => c.id.includes('coinbase'));
                  if (coinbaseConnector) {
                    handleConnect(coinbaseConnector.id);
                  }
                }}
                disabled={isPending && selectedConnector?.includes('coinbase')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0052ff] text-white rounded-xl text-sm font-medium hover:bg-[#0042cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending && selectedConnector?.includes('coinbase') ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Connect with Passkey
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-[#0052ff]/10">
              <p className="text-xs text-[#4a5568] mb-3 text-center">
                Don&apos;t have Base App? Download it:
              </p>
              <div className="flex gap-2">
                <a
                  href={config.baseAppIosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0a0b0d] text-white rounded-lg text-xs font-medium hover:bg-[#1a1b1d] transition-all"
                >
                  <AppleLogo />
                  iOS
                </a>
                <a
                  href={config.baseAppAndroidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#e2e4e9] text-[#0a0b0d] rounded-lg text-xs font-medium hover:bg-[#f9fafb] transition-all"
                >
                  <PlayStoreLogo />
                  Android
                </a>
              </div>
            </div>
          </div>

          {/* Available Wallets */}
          {connectors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#0a0b0d] mb-3">
                    Or connect with an installed wallet
                  </h3>
                  <div className="space-y-2">
                    {connectors.map((connector) => {
                      const isCoinbaseWallet = connector.id.includes('coinbase');
                      return (
                        <button
                          key={connector.id}
                          onClick={() => handleConnect(connector.id)}
                          disabled={isPending && selectedConnector === connector.id}
                          className="w-full flex items-center justify-between px-4 py-3 border border-[#e2e4e9] rounded-xl hover:bg-[#f9fafb] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-sm font-medium text-[#0a0b0d]">
                            {getConnectorName(connector.id)}
                            {isCoinbaseWallet && (
                              <span className="ml-2 text-xs text-[#4a5568]">(Use passkey)</span>
                            )}
                          </span>
                          {isPending && selectedConnector === connector.id ? (
                            <span className="text-xs text-[#4a5568]">Connecting...</span>
                          ) : (
                            <svg
                              className="w-5 h-5 text-[#0052ff]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

          {connectors.length === 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                No wallets detected. Please install a wallet extension or download Base App.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
