'use client';

/**
 * NFT Gallery Page - Display all minted NFTs
 * 
 * Features:
 * - Fetch all NFTs from the smart contract
 * - Load metadata from IPFS
 * - Beautiful responsive grid layout
 * - Loading states and animations
 * - Click to view details
 */

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ARTVAULT_ADDRESS, ARTVAULT_ABI } from '@/contracts/config';
import { NFTGridSkeleton } from '@/components/ui/NFTCardSkeleton';
import { SearchBar } from '@/components/ui/SearchBar';
import { NFTCard } from '@/components/NFTCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  artist?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface NFT {
  tokenId: number;
  tokenURI: string;
  metadata?: NFTMetadata;
  loading: boolean;
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get total supply of NFTs
  const { data: totalSupply, isLoading: isLoadingSupply } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'getTotalSupply',
  });

  const supply = totalSupply ? Number(totalSupply) : 0;
  const isLoading = isLoadingSupply;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="group">
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight group-hover:opacity-70 transition-opacity">
                ArtVault
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/mint" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Mint
              </Link>
              <Link href="/my-nfts" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                My NFTs
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-6 md:px-8">
        <ErrorBoundary>
          <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              NFT Gallery
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore all minted artworks in the ArtVault collection
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 space-y-6">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <SearchBar
                  placeholder="Search NFTs by name, artist, or description..."
                  onSearch={setSearchQuery}
                />
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-8">Loading NFTs...</p>
                <NFTGridSkeleton count={8} />
              </div>
            ) : supply === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No NFTs yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Be the first to mint an NFT on ArtVault!
                </p>
                <Link 
                  href="/mint"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Mint Your First NFT
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: supply }, (_, i) => (
                  <NFTCard key={i} tokenId={i} />
                ))}
              </div>
            )}
          </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}