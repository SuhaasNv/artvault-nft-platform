'use client';

/**
 * NFT Minting Page - Upload and mint your digital art
 * 
 * Features:
 * - Image upload (drag-and-drop or file picker)
 * - Form inputs (title, description, artist)
 * - Live preview
 * - IPFS upload via Pinata
 * - Smart contract minting
 * - Transaction status tracking
 */

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ARTVAULT_ADDRESS, ARTVAULT_ABI } from '@/contracts/config';
import { uploadImageToIPFS, uploadMetadataToIPFS, createNFTMetadata, getIPFSUrl } from '@/lib/pinata';

interface NFTMetadata {
  title: string;
  description: string;
  artist: string;
  image: File | null;
}

export default function MintPage() {
  const { isConnected, address } = useAccount();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mintingStatus, setMintingStatus] = useState<'idle' | 'uploading' | 'minting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata>({
    title: '',
    description: '',
    artist: '',
    image: null,
  });

  // Smart contract write hook
  const { writeContract, data: hash, isPending, isError } = useWriteContract();
  
  // Transaction receipt hook
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle image file selection
  const handleImageChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setMetadata({ ...metadata, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  }, []);

  // Handle the complete minting process
  const handleMint = async () => {
    if (!isConnected || !metadata.image || !address) {
      setErrorMessage('Please connect your wallet and upload an image');
      return;
    }

    if (!metadata.title.trim()) {
      setErrorMessage('Please enter a title for your NFT');
      return;
    }

    try {
      // Step 1: Upload image to IPFS
      setMintingStatus('uploading');
      setErrorMessage('');
      setIsUploading(true);
      
      console.log('📤 Uploading image to IPFS...');
      const imageHash = await uploadImageToIPFS(metadata.image);
      console.log('✅ Image uploaded! IPFS Hash:', imageHash);

      // Step 2: Create and upload metadata to IPFS
      console.log('📤 Creating metadata...');
      const nftMetadata = createNFTMetadata(
        metadata.title,
        metadata.description || 'No description provided',
        imageHash,
        metadata.artist || 'Anonymous'
      );
      
      console.log('📤 Uploading metadata to IPFS...');
      const metadataHash = await uploadMetadataToIPFS(nftMetadata);
      console.log('✅ Metadata uploaded! IPFS Hash:', metadataHash);

      const tokenURI = getIPFSUrl(metadataHash);
      console.log('🔗 Token URI:', tokenURI);

      // Step 3: Mint NFT on the blockchain
      setMintingStatus('minting');
      console.log('⛓️ Minting NFT on blockchain...');
      
      writeContract({
        address: ARTVAULT_ADDRESS,
        abi: ARTVAULT_ABI,
        functionName: 'mintNFT',
        args: [address, tokenURI],
        value: parseEther('0.01'), // 0.01 ETH mint price
      });

      // The transaction status will be handled by the useWaitForTransactionReceipt hook
      } catch (error: unknown) {
      console.error('❌ Minting error:', error);
      setMintingStatus('error');
      setErrorMessage((error as Error).message || 'Failed to mint NFT. Please try again.');
      setIsUploading(false);
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && mintingStatus === 'minting') {
    setMintingStatus('success');
    setIsUploading(false);
    console.log('🎉 NFT Minted successfully!');
  }

  // Handle transaction error
  if (isError && mintingStatus === 'minting') {
    setMintingStatus('error');
    setErrorMessage('Transaction failed. Please try again.');
    setIsUploading(false);
  }

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Mint Your NFT
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload your artwork and create a unique digital collectible
            </p>
          </div>

          {!isConnected ? (
            // Not connected state
            <div className="max-w-md mx-auto text-center py-20">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please connect your wallet to start minting NFTs
              </p>
              <ConnectButton />
            </div>
          ) : (
            // Minting form
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Artwork Image
                </label>
                
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Drop your image here
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full aspect-square object-cover rounded-2xl"
                    />
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setMetadata({ ...metadata, image: null });
                      }}
                      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Form Fields */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    placeholder="e.g., Abstract Masterpiece #1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    placeholder="Describe your artwork..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Artist Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={metadata.artist}
                    onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
                    placeholder="Your name or pseudonym"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Mint Price Info */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Minting Price
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      0.01 ETH
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Plus gas fees (~$1-5 on Sepolia)
                  </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Mint Button */}
                <button
                  onClick={handleMint}
                  disabled={!metadata.image || !metadata.title || isUploading || mintingStatus === 'success'}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold text-base hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {mintingStatus === 'uploading' && (
                    <>
                      <span className="animate-spin">📤</span>
                      Uploading to IPFS...
                    </>
                  )}
                  {mintingStatus === 'minting' && (
                    <>
                      <span className="animate-spin">⛓️</span>
                      Minting on blockchain...
                    </>
                  )}
                  {mintingStatus === 'success' && (
                    <>
                      <span>✅</span>
                      Minted Successfully!
                    </>
                  )}
                  {mintingStatus === 'idle' && (
                    <>
                      <span>🎨</span>
                      Mint NFT
                    </>
                  )}
                  {mintingStatus === 'error' && (
                    <>
                      <span>🔄</span>
                      Try Again
                    </>
                  )}
                </button>

                {/* Transaction status */}
                {isConfirming && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                      ⏳ Waiting for transaction confirmation...
                    </p>
                  </div>
                )}

                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  By minting, you agree to store your artwork on IPFS and the Ethereum blockchain
                </p>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {mintingStatus === 'success' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md mx-4 text-center animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  NFT Minted!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your artwork has been successfully minted on the Ethereum blockchain!
                </p>
                <div className="space-y-3">
                  <Link
                    href="/gallery"
                    className="block w-full bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all"
                  >
                    View in Gallery
                  </Link>
                  {hash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                    >
                      View on Etherscan →
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setMintingStatus('idle');
                      setMetadata({ title: '', description: '', artist: '', image: null });
                      setImagePreview('');
                    }}
                    className="block w-full text-gray-600 dark:text-gray-400 px-6 py-3 rounded-full font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Mint Another NFT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

