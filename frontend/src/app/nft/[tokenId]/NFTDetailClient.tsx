'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ARTVAULT_ADDRESS, ARTVAULT_ABI } from '@/contracts/config';
import { ExternalLink, User, Copy, Check, ArrowLeft, Send } from 'lucide-react';

interface NFTDetailClientProps {
  tokenId: string;
}

export default function NFTDetailClient({ tokenId }: NFTDetailClientProps) {
  const { address, isConnected } = useAccount();
  const [metadata, setMetadata] = useState<any>(null);
  const [owner, setOwner] = useState<string>('');
  const [tokenURI, setTokenURI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get token URI from contract
  const { data: tokenURIData } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  });

  // Get owner from contract
  const { data: ownerData } = useReadContract({
    address: ARTVAULT_ADDRESS,
    abi: ARTVAULT_ABI,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  });

  // Write contract for transfer
  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (tokenURIData) {
      setTokenURI(tokenURIData as string);
    }
    if (ownerData) {
      setOwner(ownerData as string);
    }
  }, [tokenURIData, ownerData]);

  // Load metadata from IPFS
  useEffect(() => {
    const loadMetadata = async () => {
      if (!tokenURI) return;

      try {
        setIsLoading(true);
        let metadataUrl = tokenURI;

        // Handle IPFS URLs
        if (tokenURI.includes('ipfs://')) {
          const ipfsHash = tokenURI.replace('ipfs://', '');
          metadataUrl = `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;
        }

        const response = await fetch(metadataUrl);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error('Error loading metadata:', error);
        // Fallback to sample data
        setMetadata({
          name: `Digital Ape #${tokenId}`,
          description: `A unique digital ape with token ID ${tokenId}`,
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop&crop=center',
          artist: 'ArtVault Creator',
          attributes: [
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Token ID', value: tokenId },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [tokenURI, tokenId]);

  const handleTransfer = async () => {
    if (!transferAddress.trim()) {
      toast.error('Please enter a valid address');
      return;
    }

    try {
      setIsTransferring(true);
      toast.loading('Transferring NFT...');

      await writeContract({
        address: ARTVAULT_ADDRESS,
        abi: ARTVAULT_ABI,
        functionName: 'transferFrom',
        args: [address, transferAddress, BigInt(tokenId)],
      });
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>

          {/* NFT Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Image */}
            <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-2xl overflow-hidden">
              {metadata?.image ? (
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-6xl">🎨</span>
                </div>
              )}
            </div>

            {/* NFT Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {metadata?.name || `NFT #${tokenId}`}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {metadata?.description || 'No description available'}
                </p>
              </div>

              {/* Artist */}
              {metadata?.artist && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    by {metadata.artist}
                  </span>
                </div>
              )}

              {/* Token ID */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Token ID
                  </span>
                  <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                    #{tokenId}
                  </span>
                </div>
              </div>

              {/* Owner */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Owner
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : 'Loading...'}
                    </span>
                    {owner && (
                      <button
                        onClick={() => copyToClipboard(owner)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Transfer Button (if owner) */}
              {isConnected && address && owner && address.toLowerCase() === owner.toLowerCase() && (
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Transfer NFT
                </button>
              )}

              {/* Links */}
              <div className="space-y-3">
                {tokenURI && (
                  <a
                    href={tokenURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on IPFS
                  </a>
                )}
                <a
                  href={`https://sepolia.etherscan.io/address/${ARTVAULT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Etherscan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Transfer NFT
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isTransferring || isConfirming}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  {isTransferring || isConfirming ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
