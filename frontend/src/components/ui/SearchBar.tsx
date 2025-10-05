import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search NFTs by name, artist, or description...",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
            <Search className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-16 pr-16 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 font-medium placeholder-gray-500"
        />
        
        {/* Clear Button */}
        {isClient && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-xl transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          </button>
        )}
        
        {/* Search Hint */}
        {isClient && !query && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-white px-2 py-1 rounded-lg shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Press Enter</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};