'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { avalancheFuji, avalanche, mainnet, polygon, bsc, arbitrum, optimism } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

/*EXPORT CONFIG */
export const config = createConfig({
  chains: [
    avalancheFuji,
    avalanche,      // Avalanche Mainnet
    mainnet,        // Ethereum Mainnet
    polygon,        // Polygon
    bsc,            // BSC
    arbitrum,       // Arbitrum
    optimism,       // Optimism
  ],
  transports: {
    [avalancheFuji.id]: http(),
    [avalanche.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}