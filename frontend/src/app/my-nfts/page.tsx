'use client';

/**
 * My NFTs Page - Display only NFTs owned by the connected wallet
 * 
 * Features:
 * - Wallet connection required
 * - Fetch only user's NFTs using getTokensOfOwner
 * - Load metadata from IPFS
 * - Beautiful responsive grid layout
 * - Loading states and animations
 * - Empty state if no NFTs owned
 */

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ARTVAULT_ADDRESS, ARTVAULT_ABI } from '@/contracts/config';
import axios from 'axios';
import { NFTGridSkeleton } from '@/components/ui/NFTCardSkeleton';

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

export default function MyNFTsPage() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's token IDs
  const { data: userTokenIds, isLoading: isLoadingTokens } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'getTokensOfOwner',
    args: address ? [address] : undefined,
  });

  // Load all NFT metadata
  useEffect(() => {
    const loadNFTs = async () => {
      if (!userTokenIds || !isConnected) {
        setIsLoading(false);
        return;
      }

      const tokenIds = userTokenIds as bigint[];
      console.log('📊 Your NFT Token IDs:', tokenIds);

      if (tokenIds.length === 0) {
        setIsLoading(false);
        setNfts([]);
        return;
      }

      setIsLoading(true);

      // Create array of NFT objects
      const nftArray: NFT[] = tokenIds.map((id) => ({
        tokenId: Number(id),
        tokenURI: '',
        loading: true,
      }));

      setNfts(nftArray);

      // Fetch metadata for each NFT
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = Number(tokenIds[i]);
        
        try {
          console.log(`🔍 Loading your NFT #${tokenId}...`);
          
          // We need to use wagmi's readContract to fetch tokenURI
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
            args: [BigInt(tokenId)],
          }) as string;

          console.log(`📝 Token URI for #${tokenId}:`, tokenURI);

          // Fetch metadata from IPFS
          if (tokenURI) {
            try {
              const metadataResponse = await axios.get(tokenURI);
              const metadata: NFTMetadata = metadataResponse.data;
              
              console.log(`✅ Loaded metadata for #${tokenId}:`, metadata);

              setNfts(prev => prev.map(nft => 
                nft.tokenId === tokenId
                  ? { 
                      ...nft, 
                      tokenURI,
                      loading: false,
                      metadata,
                    }
                  : nft
              ));
            } catch (metadataError) {
              console.error(`❌ Error loading metadata for NFT ${tokenId}:`, metadataError);
              setNfts(prev => prev.map(nft => 
                nft.tokenId === tokenId
                  ? { 
                      ...nft, 
                      tokenURI,
                      loading: false,
                      metadata: {
                        name: `NFT #${tokenId}`,
                        description: 'Error loading metadata from IPFS',
                        image: '',
                      }
                    }
                  : nft
              ));
            }
          }
        } catch (error) {
          console.error(`❌ Error loading NFT ${tokenId}:`, error);
          setNfts(prev => prev.map(nft => 
            nft.tokenId === tokenId
              ? { 
                  ...nft, 
                  loading: false,
                  metadata: {
                    name: `NFT #${tokenId}`,
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
  }, [userTokenIds, isConnected]);

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
              <Link href="/gallery" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Gallery
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
              My Collection
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isConnected ? 'Your personal NFT collection' : 'Connect your wallet to view your NFTs'}
            </p>
            {isConnected && address && (
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 rounded-full px-6 py-2 border border-blue-200 dark:border-blue-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </span>
              </div>
            )}
            {isConnected && !isLoadingTokens && nfts.length > 0 && (
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/20 rounded-full px-6 py-2 border border-purple-200 dark:border-purple-800">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} Owned
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Not Connected State */}
          {!isConnected && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🦊</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please connect your wallet to view your NFT collection
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          )}

          {/* Loading State */}
          {isConnected && (isLoading || isLoadingTokens) && nfts.length === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-8">Loading your NFTs...</p>
              </div>
              <NFTGridSkeleton count={6} />
            </div>
          )}

          {/* Empty State - No NFTs Owned */}
          {isConnected && !isLoading && !isLoadingTokens && nfts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎨</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No NFTs Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You don't own any ArtVault NFTs yet. Start your collection today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/mint"
                  className="inline-block bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all"
                >
                  Mint Your First NFT
                </Link>
                <Link
                  href="/gallery"
                  className="inline-block border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                >
                  Browse Gallery
                </Link>
              </div>
            </div>
          )}

          {/* NFT Grid */}
          {isConnected && nfts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <Link
                  key={nft.tokenId}
                  href={`/nft/${nft.tokenId}`}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {nft.loading ? (
                    // Loading skeleton
                    <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer">
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
                        
                        {/* Owner Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            YOURS
                          </span>
                        </div>

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
                        
                        {/* Token ID Badge & Artist */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-500">
                            Token #{nft.tokenId}
                          </span>
                          {nft.metadata?.attributes && nft.metadata.attributes[0] && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              by {nft.metadata.attributes[0].value}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {isConnected && nfts.length > 0 && (
            <div className="text-center mt-16">
              <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Grow your collection
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Mint more unique artworks and expand your NFT portfolio
                </p>
                <Link
                  href="/mint"
                  className="inline-block bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all"
                >
                  Mint Another NFT
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

