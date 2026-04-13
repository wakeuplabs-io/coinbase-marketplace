import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet as coinbaseWalletRK,
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

/** Prefer EOA path over `all` to avoid a QR-first Coinbase connection UX in the RainbowKit modal (wagmi: `eoaOnly`). */
const coinbaseConnectorOptions = {
  preference: { options: 'eoaOnly' as const },
  version: '4' as const,
};

/** RainbowKit expects wallet factories, not pre-instantiated `Wallet` objects. */
const coinbaseSmartWallet = ((opts: {
  appName: string;
  appIcon?: string;
  projectId: string;
}) =>
  coinbaseWalletRK({
    ...opts,
    ...coinbaseConnectorOptions,
  })) as unknown as typeof metaMaskWallet;

const rainbowKitConnectors =
  walletConnectProjectId && !disableWalletConnect
    ? connectorsForWallets(
        [
          {
            groupName: 'Recommended',
            wallets: [
              coinbaseSmartWallet,
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
// Without a project id (or when disabled), expose Coinbase + browser extension only.
const fallbackConnectors = [
  coinbaseWallet({
    appName,
    ...coinbaseConnectorOptions,
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
