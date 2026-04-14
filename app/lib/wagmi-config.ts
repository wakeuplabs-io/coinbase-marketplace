import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { baseAccount as baseAccountConnector, injected } from 'wagmi/connectors';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  baseAccount as baseAccountWallet,
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const appName = 'Coinbase Marketplace';

/** README uses NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID; legacy alias kept for older deploys. */
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?.trim();

/** When true, WalletConnect is not registered — often avoids Chrome’s “Local Network Access” prompt; see docs/chrome-local-network-access.md */
const disableWalletConnect = process.env.NEXT_PUBLIC_DISABLE_WALLETCONNECT === 'true';

const rainbowKitConnectors =
  walletConnectProjectId && !disableWalletConnect
    ? connectorsForWallets(
        [
          {
            groupName: 'Recommended',
            wallets: [
              baseAccountWallet,
              metaMaskWallet,
              rainbowWallet,
              rabbyWallet,
            ],
          },
          {
            groupName: 'More',
            wallets: [walletConnectWallet, injectedWallet],
          },
        ],
        {
          appName,
          projectId: walletConnectProjectId,
        },
      )
    : [];

// RainbowKit throws if WalletConnect-backed wallets are registered without a real project id.
// Without a project id (or when disabled), expose Base Account + browser extension only.
const fallbackConnectors = [
  baseAccountConnector({
    appName,
  }),
  injected(),
];

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors:
    walletConnectProjectId && !disableWalletConnect
      ? rainbowKitConnectors
      : fallbackConnectors,
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
