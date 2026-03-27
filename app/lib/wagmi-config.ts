import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const appName = 'Coinbase Marketplace';
const rainbowConnectors = connectorsForWallets(
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
    projectId: walletConnectProjectId ?? '',
  },
);

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName,
      preference: { options: 'all' },
      version: '4',
    }),
    ...rainbowConnectors,
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
