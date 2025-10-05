'use client';

import React, { useState } from 'react';
import { Filter, ChevronDown, X, Search, Calendar, Users, Star, Sparkles } from 'lucide-react';

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

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterOptions];
    return value !== undefined && value !== 'newest' && value !== 'all';
  });

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.sortBy !== 'newest') count++;
    if (filters.owner) count++;
    if (filters.rarity) count++;
    if (filters.dateRange && filters.dateRange !== 'all') count++;
    return count;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 shadow-sm w-full"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
            <Filter className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-800 font-bold text-sm group-hover:text-blue-700 transition-colors">Filters</span>
            <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">Customize your search</span>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 rounded-full shadow-md">
              {getActiveFilterCount()}
            </span>
          </div>
        )}
        
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-[420px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Advanced Filters</h3>
                  <p className="text-blue-100 text-sm">Refine your NFT search</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8 max-h-96 overflow-y-auto">
            {/* Sort Options */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <label className="text-lg font-bold text-gray-800">Sort By</label>
                  <p className="text-sm text-gray-500">Choose how to organize results</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'newest', label: 'Newest First', icon: '🆕', desc: 'Latest creations' },
                  { value: 'oldest', label: 'Oldest First', icon: '📅', desc: 'Original pieces' },
                  { value: 'name', label: 'Name A-Z', icon: '🔤', desc: 'Alphabetical' },
                  { value: 'artist', label: 'Artist A-Z', icon: '👤', desc: 'By creator' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                      filters.sortBy === option.value
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-2 border-blue-300 shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-bold text-sm">{option.label}</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-700">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Owner Filter */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <label className="text-lg font-bold text-gray-800">Filter by Owner</label>
                  <p className="text-sm text-gray-500">Search by wallet address</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter wallet address (0x...)"
                  value={filters.owner || ''}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-sm font-medium"
                />
                {filters.owner && (
                  <button
                    onClick={() => handleFilterChange('owner', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Rarity Filter */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <label className="text-lg font-bold text-gray-800">Rarity</label>
                  <p className="text-sm text-gray-500">Filter by NFT rarity level</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'legendary', label: 'Legendary', color: 'from-yellow-400 to-orange-500', icon: '👑', desc: 'Ultra rare' },
                  { value: 'epic', label: 'Epic', color: 'from-purple-400 to-pink-500', icon: '💎', desc: 'Very rare' },
                  { value: 'rare', label: 'Rare', color: 'from-blue-400 to-cyan-500', icon: '⭐', desc: 'Uncommon' },
                  { value: 'common', label: 'Common', color: 'from-gray-400 to-slate-500', icon: '🔸', desc: 'Standard' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('rarity', filters.rarity === option.value ? undefined : option.value)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                      filters.rarity === option.value
                        ? `bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105 border-transparent`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-bold text-sm">{option.label}</span>
                    <span className="text-xs opacity-75">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <label className="text-lg font-bold text-gray-800">Date Range</label>
                  <p className="text-sm text-gray-500">Filter by creation time</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'today', label: 'Today', icon: '📅', desc: 'Last 24h' },
                  { value: 'week', label: 'This Week', icon: '📆', desc: 'Last 7 days' },
                  { value: 'month', label: 'This Month', icon: '🗓️', desc: 'Last 30 days' },
                  { value: 'all', label: 'All Time', icon: '∞', desc: 'Everything' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('dateRange', option.value)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                      filters.dateRange === option.value
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-bold text-sm">{option.label}</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-700">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          {hasActiveFilters && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 border-2 border-gray-200 hover:border-red-300 hover:shadow-lg"
              >
                <span className="text-xl">🗑️</span>
                <span>Clear All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};