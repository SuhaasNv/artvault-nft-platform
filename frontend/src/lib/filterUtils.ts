import { FilterOptions } from '@/components/ui/FilterPanel';

export interface NFTData {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  artist: string;
  owner: string;
  rarity?: string;
  mintDate?: Date;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export const filterAndSortNFTs = (nfts: NFTData[], searchQuery: string, filters: FilterOptions): NFTData[] => {
  let filtered = [...nfts];

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(nft => 
      (nft.name || '').toLowerCase().includes(query) ||
      (nft.description || '').toLowerCase().includes(query) ||
      (nft.artist || '').toLowerCase().includes(query) ||
      (nft.tokenId || '').includes(query)
    );
  }

  // Apply owner filter
  if (filters.owner) {
    filtered = filtered.filter(nft => 
      (nft.owner || '').toLowerCase().includes(filters.owner!.toLowerCase())
    );
  }

  // Apply rarity filter
  if (filters.rarity) {
    filtered = filtered.filter(nft => 
      (nft.rarity || '').toLowerCase() === filters.rarity?.toLowerCase()
    );
  }

  // Apply date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    const filterDate = new Date();
    
    switch (filters.dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    filtered = filtered.filter(nft => {
      if (!nft.mintDate) return true;
      return new Date(nft.mintDate) >= filterDate;
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.mintDate || 0).getTime() - new Date(a.mintDate || 0).getTime();
      case 'oldest':
        return new Date(a.mintDate || 0).getTime() - new Date(b.mintDate || 0).getTime();
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'artist':
        return (a.artist || '').localeCompare(b.artist || '');
      default:
        return 0;
    }
  });

  return filtered;
};

export const getFilterStats = (nfts: NFTData[], searchQuery: string, filters: FilterOptions) => {
  const filtered = filterAndSortNFTs(nfts, searchQuery, filters);
  const total = nfts.length;
  const showing = filtered.length;
  
  return {
    total,
    showing,
    hasFilters: searchQuery.trim() !== '' || Object.keys(filters).length > 1 || filters.sortBy !== 'newest'
  };
};
