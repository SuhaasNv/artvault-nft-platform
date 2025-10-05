'use client';

/**
 * Web3Provider Component
 * 
 * This wraps the entire app and provides:
 * - Wallet connection functionality (via RainbowKit)
 * - Blockchain state management (via wagmi)
 * - React Query for caching
 * 
 * Think of this as the "power source" for all Web3 features!
 */

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';

// Configure wagmi with Sepolia testnet
const config = getDefaultConfig({
  // App info for wallet connection
  appName: 'ArtVault',
  
  // Project ID from WalletConnect
  // Using a generic public project ID for testing
  projectId: 'c82b1d0e0b5f8c0e0b5f8c0e0b5f8c0e',
  
  // Which blockchain networks to support
  chains: [sepolia],
  
  // RPC endpoints
  transports: {
    [sepolia.id]: http(),
  },
  
  // Enable SSR (Server-Side Rendering) support
  ssr: true,
});

// Create React Query client for caching
const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

