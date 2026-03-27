import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Coinbase Marketplace',
      preference: 'all',
    }),
    metaMask(),
    injected(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
