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

// Generate static params for static export
export async function generateStaticParams() {
  // Generate static params for the first 20 NFTs (0-19)
  // This allows static export to work with dynamic routes
  return Array.from({ length: 20 }, (_, i) => ({
    tokenId: i.toString(),
  }));
}

import NFTDetailClient from './NFTDetailClient';

interface NFTDetailPageProps {
  params: {
    tokenId: string;
  };
}

export default function NFTDetailPage({ params }: NFTDetailPageProps) {
  const { tokenId } = params;

  return <NFTDetailClient tokenId={tokenId} />;
}