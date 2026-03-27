import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  baseAccount,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  readyWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const disableWalletConnect =
  process.env.NEXT_PUBLIC_DISABLE_WALLETCONNECT === 'true';

if (!projectId && typeof window !== 'undefined' && !disableWalletConnect) {
  console.warn(
    '[wagmi] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing. Get one at https://cloud.walletconnect.com'
  );
}

const rainbowKitProjectId = projectId || 'MISSING_WALLETCONNECT_PROJECT_ID';

const popularWallets = disableWalletConnect
  ? [baseAccount, metaMaskWallet, injectedWallet]
  : [rainbowWallet, baseAccount, metaMaskWallet, walletConnectWallet];

const moreWallets = disableWalletConnect
  ? [injectedWallet]
  : [readyWallet, trustWallet, injectedWallet];

export const wagmiConfig = getDefaultConfig({
  appName: 'Coinbase Marketplace',
  appDescription: 'Base Marketplace',
  appUrl: 'https://www.coinbase.com',
  appIcon: 'https://www.coinbase.com/favicon.ico',
  projectId: rainbowKitProjectId,
  chains: [baseSepolia],
  wallets: [
    {
      groupName: 'Popular',
      wallets: popularWallets,
    },
    {
      groupName: 'More',
      wallets: moreWallets,
    },
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
