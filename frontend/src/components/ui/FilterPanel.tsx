import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

export interface FilterOptions {
  sortBy: 'newest' | 'oldest' | 'name' | 'artist';
  owner?: string;
  rarity?: 'legendary' | 'epic' | 'rare' | 'common';
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'newest'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { sortBy: 'newest' as const };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 1 || filters.sortBy !== 'newest';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
      >
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700 font-medium">Filters</span>
        {hasActiveFilters && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-6 space-y-6">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name', label: 'Name A-Z' },
                { value: 'artist', label: 'Artist A-Z' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('sortBy', option.value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.sortBy === option.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Owner Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Owner</label>
            <input
              type="text"
              placeholder="Enter wallet address..."
              value={filters.owner || ''}
              onChange={(e) => handleFilterChange('owner', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Rarity</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'legendary', label: 'Legendary', color: 'text-yellow-600' },
                { value: 'epic', label: 'Epic', color: 'text-purple-600' },
                { value: 'rare', label: 'Rare', color: 'text-blue-600' },
                { value: 'common', label: 'Common', color: 'text-gray-600' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('rarity', filters.rarity === option.value ? undefined : option.value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.rarity === option.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={option.color}>●</span> {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'all', label: 'All Time' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('dateRange', option.value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.dateRange === option.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
