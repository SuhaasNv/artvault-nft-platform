'use client';

/**
 * NFT Detail Page - Display full details of a single NFT
 * 
 * Features:
 * - Dynamic route (/nft/[tokenId])
 * - Full-size image display
 * - Complete metadata
 * - Owner information
 * - Token URI & IPFS links
 * - Etherscan transaction link
 * - Transfer button (if owner)
 */

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ARTVAULT_ADDRESS, ARTVAULT_ABI, ETHERSCAN_LINK } from '@/contracts/config';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { isAddress } from 'viem';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export default function NFTDetailPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const router = useRouter();
  const { address, isConnected } = useAccount();
  
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [tokenURI, setTokenURI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Transfer modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferError, setTransferError] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Get NFT owner
  const { data: owner, refetch: refetchOwner } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  });

  const isOwner = owner && address && owner.toString().toLowerCase() === address.toLowerCase();

  // Transfer contract hooks
  const { data: transferHash, writeContract, isPending: isWritePending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({
    hash: transferHash,
  });

  // Handle successful transfer
  useEffect(() => {
    if (isTransferSuccess) {
      console.log('✅ NFT transferred successfully!');
      setIsTransferring(false);
      setShowTransferModal(false);
      setRecipientAddress('');
      
      // Refetch owner to update UI
      refetchOwner();
      
      toast.success('✅ NFT transferred successfully!', {
        duration: 5000,
      });
      
      // Show success message and redirect after delay
      setTimeout(() => {
        router.push('/my-nfts');
      }, 2000);
    }
  }, [isTransferSuccess, refetchOwner, router]);

  // Handle transfer submission
  const handleTransfer = () => {
    if (!recipientAddress) {
      toast.error('Please enter a recipient address');
      return;
    }

    if (!isAddress(recipientAddress)) {
      toast.error('Invalid Ethereum address');
      return;
    }

    if (recipientAddress.toLowerCase() === address?.toLowerCase()) {
      toast.error('Cannot transfer to yourself');
      return;
    }

    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setTransferError('');
    setIsTransferring(true);
    toast.loading('🔄 Transferring NFT...');

    try {
      console.log('🔄 Transferring NFT...');
      console.log('From:', address);
      console.log('To:', recipientAddress);
      console.log('Token ID:', tokenId);

      // Call safeTransferFrom on the contract
      writeContract({
        address: ARTVAULT_ADDRESS,
        abi: ARTVAULT_ABI,
        functionName: 'safeTransferFrom',
        args: [address, recipientAddress as `0x${string}`, BigInt(tokenId)],
      });
    } catch (error: any) {
      console.error('❌ Transfer error:', error);
      setTransferError(error.message || 'Failed to transfer NFT');
      setIsTransferring(false);
    }
  };

  // Load NFT metadata
  useEffect(() => {
    const loadNFT = async () => {
      if (!tokenId) return;

      setIsLoading(true);
      setError('');

      try {
        console.log(`🔍 Loading NFT #${tokenId}...`);
        
        // Fetch token URI from the smart contract
        const { readContract } = await import('wagmi/actions');
        const { getDefaultConfig } = await import('@rainbow-me/rainbowkit');
        const { sepolia } = await import('wagmi/chains');
        const { http } = await import('wagmi');
        
        const config = getDefaultConfig({
          appName: 'ArtVault',
          projectId: 'c82b1d0e0b5f8c0e0b5f8c0e0b5f8c0e',
          chains: [sepolia],
          transports: {
            [sepolia.id]: http(),
          },
          ssr: false,
        });

        const uri = await readContract(config, {
          address: ARTVAULT_ADDRESS,
          abi: ARTVAULT_ABI,
          functionName: 'tokenURI',
          args: [BigInt(tokenId)],
        }) as string;

        console.log(`📝 Token URI:`, uri);
        setTokenURI(uri);

        // Fetch metadata from IPFS
        if (uri) {
          const metadataResponse = await axios.get(uri);
          const nftMetadata: NFTMetadata = metadataResponse.data;
          
          console.log(`✅ Loaded metadata:`, nftMetadata);
          setMetadata(nftMetadata);
        }
      } catch (error: any) {
        console.error(`❌ Error loading NFT:`, error);
        setError('Failed to load NFT details. This NFT may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNFT();
  }, [tokenId]);

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
          {/* Back Button */}
          <Link 
            href="/gallery" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Gallery</span>
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-gray-600 dark:text-gray-400">Loading NFT details...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">❌</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                NFT Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {error}
              </p>
              <Link
                href="/gallery"
                className="inline-block bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all"
              >
                Back to Gallery
              </Link>
            </div>
          )}

          {/* NFT Details */}
          {!isLoading && !error && metadata && (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Image */}
              <div className="space-y-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 border border-gray-200 dark:border-gray-800 shadow-2xl">
                  {metadata.image ? (
                    <img
                      src={metadata.image}
                      alt={metadata.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-9xl">🎨</span>
                    </div>
                  )}
                  
                  {/* Owner Badge */}
                  {isOwner && (
                    <div className="absolute top-6 right-6">
                      <span className="bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        YOU OWN THIS
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  {tokenURI && (
                    <a
                      href={tokenURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      View on IPFS
                    </a>
                  )}
                  <a
                    href={`${ETHERSCAN_LINK}/token/${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-8">
                {/* Title & Description */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {metadata.name}
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Token #{tokenId}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {metadata.description || 'No description provided'}
                  </p>
                </div>

                {/* Owner Info */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Owner
                  </h3>
                  {owner ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        {owner.toString().slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">
                          {owner.toString().slice(0, 6)}...{owner.toString().slice(-4)}
                        </p>
                        {isOwner && (
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            This is you!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                  )}
                </div>

                {/* Attributes */}
                {metadata.attributes && metadata.attributes.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                      Attributes
                    </h3>
                    <div className="space-y-3">
                      {metadata.attributes.map((attr, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {attr.trait_type}
                          </span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contract Details */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Contract Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contract Address</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {ARTVAULT_ADDRESS}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Token Standard</p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        ERC-721
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Blockchain</p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        Ethereum (Sepolia Testnet)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transfer Button (if owner) */}
                {isOwner && isConnected && (
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                    <button
                      className="w-full bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setShowTransferModal(true)}
                      disabled={isTransferSuccess}
                    >
                      {isTransferSuccess ? '✅ Transferred!' : 'Transfer NFT'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                      Send this NFT to another wallet address
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-200 dark:border-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transfer NFT
              </h2>
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferError('');
                  setRecipientAddress('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={isTransferring || isConfirming}
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* NFT Preview */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex-shrink-0">
                {metadata?.image ? (
                  <img src={metadata.image} alt={metadata.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-2xl">🎨</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  {metadata?.name || `NFT #${tokenId}`}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Token #{tokenId}
                </p>
              </div>
            </div>

            {/* Recipient Address Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => {
                  setRecipientAddress(e.target.value);
                  setTransferError('');
                }}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                disabled={isTransferring || isConfirming}
              />
              {transferError && (
                <p className="text-red-500 text-sm mt-2">
                  {transferError}
                </p>
              )}
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Important
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    This action cannot be undone. Make sure you've entered the correct address. You will lose ownership of this NFT.
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Status */}
            {(isTransferring || isConfirming) && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin text-2xl">⏳</div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      {isWritePending ? 'Confirm in wallet...' : 'Transferring NFT...'}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Please wait, this may take a moment
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferError('');
                  setRecipientAddress('');
                }}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={isTransferring || isConfirming}
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!recipientAddress || isTransferring || isConfirming}
              >
                {isWritePending ? 'Confirm in Wallet' : isConfirming ? 'Transferring...' : 'Transfer NFT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

