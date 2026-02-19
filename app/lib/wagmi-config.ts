import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Coinbase Marketplace',
      preference: 'all',
    }),
    metaMask(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
