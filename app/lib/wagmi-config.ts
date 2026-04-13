import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const appName = 'Coinbase Marketplace';

// RainbowKit throws during module init if projectId is empty (SSR/prerender, e.g. Amplify
// before env vars are set). WalletConnect-backed wallets need a real ID from cloud.walletconnect.com.
const rainbowConnectors = walletConnectProjectId
  ? connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [metaMaskWallet, rainbowWallet, rabbyWallet],
        },
        {
          groupName: 'More',
          wallets: [injectedWallet],
        },
      ],
      {
        appName,
        projectId: walletConnectProjectId,
      },
    )
  : [];

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName,
      preference: { options: 'all' },
      version: '4',
    }),
    ...(walletConnectProjectId ? rainbowConnectors : [injected()]),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
