import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { baseAccount as baseAccountConnector, injected } from 'wagmi/connectors';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  baseAccount as baseAccountWallet,
  metaMaskWallet,
  rainbowWallet,
  readyWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const appName = 'Coinbase Marketplace';

/** README uses NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID; legacy alias kept for older deploys. */
function getWalletConnectProjectId() {
  return (
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?.trim()
  );
}

function getFallbackConnectors() {
  // Without WalletConnect, expose Base Account + browser extension only.
  return [
    baseAccountConnector({
      appName,
    }),
    injected(),
  ];
}

function getRainbowKitConnectors(walletConnectProjectId: string) {
  return connectorsForWallets(
    [
      {
        groupName: 'Popular',
        wallets: [
          baseAccountWallet,
          rainbowWallet,
          metaMaskWallet,
          walletConnectWallet,
        ],
      },
      {
        groupName: 'More',
        wallets: [readyWallet, trustWallet, uniswapWallet],
      },
    ],
    {
      appName,
      projectId: walletConnectProjectId,
    },
  );
}

export function createWagmiConfig({
  includeWalletConnect,
}: {
  includeWalletConnect: boolean;
}) {
  const walletConnectProjectId = getWalletConnectProjectId();
  const connectors =
    includeWalletConnect && walletConnectProjectId
      ? getRainbowKitConnectors(walletConnectProjectId)
      : getFallbackConnectors();

  return createConfig({
    chains: [baseSepolia],
    connectors,
    transports: {
      [baseSepolia.id]: http(),
    },
    ssr: true,
  });
}
