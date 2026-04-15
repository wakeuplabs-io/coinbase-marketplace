'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '../lib/wagmi-config';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckout = pathname === '/checkout';
  const includeWalletConnect = !isCheckout;
  const wagmiConfig = useMemo(
    () => createWagmiConfig({ includeWalletConnect }),
    [includeWalletConnect],
  );
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig} key={isCheckout ? 'checkout' : 'default'}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme()}
          showRecentTransactions={false}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
