import Link from 'next/link';
import Image from 'next/image';
import { useNFTData } from '@/hooks/useNFTData';
import { NFTCardErrorBoundary } from './NFTErrorBoundary';

interface NFTCardProps {
  tokenId: number;
}

export function NFTCard({ tokenId }: NFTCardProps) {
  return (
    <NFTCardErrorBoundary>
      <NFTCardContent tokenId={tokenId} />
    </NFTCardErrorBoundary>
  );
}

function NFTCardContent({ tokenId }: NFTCardProps) {
  const nft = useNFTData(tokenId);

  if (nft.loading) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-square w-full overflow-hidden">
          <div className="animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-full w-full"></div>
        </div>
        <div className="p-4">
          <div className="animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-5 w-3/4 mb-2"></div>
          <div className="animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-4 w-full mb-1"></div>
          <div className="animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-4 w-2/3 mb-3"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-4 w-4 rounded-full"></div>
            <div className="animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-4 w-1/2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-6 w-20 rounded-full"></div>
            <div className="animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-4 w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (nft.error || !nft.metadata) {
    console.error(`Error rendering NFTCard for #${tokenId}:`, nft.error);
    return (
      <div className="group relative bg-red-100 dark:bg-red-950 rounded-2xl overflow-hidden border border-red-200 dark:border-red-800 p-4 text-center">
        <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Error Loading NFT #{tokenId}</h3>
        <p className="text-sm text-red-600 dark:text-red-400">{nft.error || 'Unknown error'}</p>
        <p className="text-xs text-red-500 dark:text-red-300 mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <Link
      href={`/nft/${tokenId}`}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300"
    >
      {/* NFT Image */}
      <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 relative overflow-hidden">
        {nft.metadata?.image && nft.metadata.image.trim() !== '' ? (
          <Image
            src={nft.metadata.image}
            alt={nft.metadata.name || `NFT #${tokenId}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              console.error('❌ Image failed to load for NFT #' + tokenId + ':', nft.metadata?.image);
              const el = (e.target as HTMLElement)?.parentElement?.nextElementSibling as HTMLElement;
              if (el) el.style.display = 'flex';
            }}
            priority={false}
          />
        ) : null}
        
        {/* Fallback when no image or image fails to load */}
        <div 
          className="flex items-center justify-center h-full"
          style={{ display: nft.metadata?.image ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <span className="text-6xl">🎨</span>
            <p className="text-xs text-gray-500 mt-2">
              {nft.metadata?.image ? 'Image failed to load' : 'No image available'}
            </p>
          </div>
        </div>
            
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-semibold">View Details</span>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
          {nft.metadata?.name || `NFT #${tokenId}`}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {nft.metadata?.description || 'No description available'}
        </p>
        
        {/* Artist */}
        {nft.metadata?.artist && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              by {nft.metadata.artist}
            </span>
          </div>
        )}

        {/* Token ID */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
            Token #{tokenId}
          </span>
          <span className="text-xs text-gray-500">
            YOURS
          </span>
        </div>
      </div>
    </Link>
  );
}