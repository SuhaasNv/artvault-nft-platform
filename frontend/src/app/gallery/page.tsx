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
import axios from 'axios';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface NFT {
  tokenId: number;
  tokenURI: string;
  metadata?: NFTMetadata;
  loading: boolean;
}

export default function GalleryPage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get total supply of NFTs
  const { data: totalSupply } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'getTotalSupply',
  });

  // Load all NFT metadata
  useEffect(() => {
    const loadNFTs = async () => {
      if (!totalSupply) {
        setIsLoading(false);
        return;
      }

      const supply = Number(totalSupply);
      console.log('📊 Total NFTs minted:', supply);

      if (supply === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Create array of NFT objects
      const nftArray: NFT[] = Array.from({ length: supply }, (_, i) => ({
        tokenId: i,
        tokenURI: '',
        loading: true,
      }));

      setNfts(nftArray);

      // Fetch metadata for each NFT
      for (let i = 0; i < supply; i++) {
        try {
          console.log(`🔍 Loading NFT #${i}...`);
          
          // We need to use wagmi's readContract to fetch tokenURI
          // For now, we'll use a dynamic import approach
          const { readContract } = await import('wagmi/actions');
          const { getDefaultConfig } = await import('@rainbow-me/rainbowkit');
          const { sepolia } = await import('wagmi/chains');
          const { http } = await import('wagmi');
          
          // Create a config for reading
          const config = getDefaultConfig({
            appName: 'ArtVault',
            projectId: 'c82b1d0e0b5f8c0e0b5f8c0e0b5f8c0e',
            chains: [sepolia],
            transports: {
              [sepolia.id]: http(),
            },
            ssr: false,
          });

          // Fetch token URI from the smart contract
          const tokenURI = await readContract(config, {
            address: ARTVAULT_ADDRESS,
            abi: ARTVAULT_ABI,
            functionName: 'tokenURI',
            args: [BigInt(i)],
          }) as string;

          console.log(`📝 Token URI for #${i}:`, tokenURI);

          // Fetch metadata from IPFS
          if (tokenURI) {
            try {
              const metadataResponse = await axios.get(tokenURI);
              const metadata: NFTMetadata = metadataResponse.data;
              
              console.log(`✅ Loaded metadata for #${i}:`, metadata);

              setNfts(prev => prev.map(nft => 
                nft.tokenId === i 
                  ? { 
                      ...nft, 
                      tokenURI,
                      loading: false,
                      metadata,
                    }
                  : nft
              ));
            } catch (metadataError) {
              console.error(`❌ Error loading metadata for NFT ${i}:`, metadataError);
              setNfts(prev => prev.map(nft => 
                nft.tokenId === i 
                  ? { 
                      ...nft, 
                      tokenURI,
                      loading: false,
                      metadata: {
                        name: `NFT #${i}`,
                        description: 'Error loading metadata from IPFS',
                        image: '',
                      }
                    }
                  : nft
              ));
            }
          }
        } catch (error) {
          console.error(`❌ Error loading NFT ${i}:`, error);
          setNfts(prev => prev.map(nft => 
            nft.tokenId === i 
              ? { 
                  ...nft, 
                  loading: false,
                  metadata: {
                    name: `NFT #${i}`,
                    description: 'Error loading NFT data',
                    image: '',
                  }
                }
              : nft
          ));
        }
      }

      setIsLoading(false);
    };

    loadNFTs();
  }, [totalSupply]);

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              NFT Gallery
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore all minted artworks in the ArtVault collection
            </p>
            {totalSupply && (
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 rounded-full px-6 py-2 border border-blue-200 dark:border-blue-800">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {Number(totalSupply)} NFTs Minted
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && nfts.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-gray-600 dark:text-gray-400">Loading NFTs...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && nfts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎨</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No NFTs Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Be the first to mint an NFT in the ArtVault collection!
              </p>
              <Link
                href="/mint"
                className="inline-block bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all"
              >
                Mint Your First NFT
              </Link>
            </div>
          )}

          {/* NFT Grid */}
          {nfts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <Link
                  key={nft.tokenId}
                  href={`/nft/${nft.tokenId}`}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {nft.loading ? (
                    // Loading skeleton
                    <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 animate-pulse">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-4xl animate-spin">⏳</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* NFT Image */}
                      <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 relative overflow-hidden">
                        {nft.metadata?.image ? (
                          <img
                            src={nft.metadata.image}
                            alt={nft.metadata.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-6xl">🎨</span>
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-semibold">View Details</span>
                        </div>
                      </div>

                      {/* NFT Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {nft.metadata?.name || `NFT #${nft.tokenId}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {nft.metadata?.description || 'No description available'}
                        </p>
                        
                        {/* Token ID Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-500">
                            Token #{nft.tokenId}
                          </span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            ERC-721
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {nfts.length > 0 && (
            <div className="text-center mt-16">
              <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Want to add your art?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join the ArtVault collection and mint your own NFT
                </p>
                <Link
                  href="/mint"
                  className="inline-block bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all"
                >
                  Mint Your NFT
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

