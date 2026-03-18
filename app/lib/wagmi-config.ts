import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const disableWalletConnect =
  process.env.NEXT_PUBLIC_DISABLE_WALLETCONNECT === 'true';
if (!projectId && typeof window !== 'undefined' && !disableWalletConnect) {
  console.warn(
    '[wagmi] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing. Get one at https://cloud.walletconnect.com'
  );
}

const connectors = [
  coinbaseWallet({
    appName: 'Coinbase Marketplace',
    preference: 'all',
  }),
  ...(projectId && !disableWalletConnect
    ? [
        walletConnect({
          projectId,
          metadata: {
            name: 'Coinbase Marketplace',
            description: 'Base Marketplace',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: ['https://www.coinbase.com/favicon.ico'],
          },
          showQrModal: true,
        }),
      ]
    : []),
  metaMask(),
  injected(),
];

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
});
