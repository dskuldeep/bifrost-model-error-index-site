'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { getProviderDisplayName } from '@/lib/providerDisplayName';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProvider?: string;
  onProviderChange?: (provider: string | null) => void;
  providers?: Array<{ name: string; count: number; icon?: string }>;
  showProviderFilter?: boolean;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedProvider,
  onProviderChange,
  providers = [],
  showProviderFilter = true,
}: SearchAndFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedProviderObj = selectedProvider
    ? providers.find(p => p.name.toLowerCase() === selectedProvider.toLowerCase())
    : undefined;
  const selectedProviderDisplay = selectedProviderObj
    ? getProviderDisplayName(selectedProviderObj.name)
    : getProviderDisplayName(selectedProvider);

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <Search size={20} style={{ color: '#64748b', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search errors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="clear-search"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showProviderFilter && providers.length > 0 && (
        <div className="provider-filter">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="provider-filter-toggle"
          >
            {selectedProvider ? `Provider: ${selectedProviderDisplay}` : 'All Providers'}
          </button>
          
          {isExpanded && (
            <div className="provider-list">
              <button
                onClick={() => {
                  onProviderChange?.(null);
                  setIsExpanded(false);
                }}
                className={`provider-item ${!selectedProvider ? 'active' : ''}`}
              >
                All Providers
              </button>
              {providers.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => {
                    onProviderChange?.(provider.name.toLowerCase());
                    setIsExpanded(false);
                  }}
                  className={`provider-item ${selectedProvider?.toLowerCase() === provider.name.toLowerCase() ? 'active' : ''}`}
                >
                  {provider.icon && (
                    <img
                      src={provider.icon}
                      alt={getProviderDisplayName(provider.name)}
                      style={{ width: '16px', height: '16px', objectFit: 'contain', marginRight: '0.5rem' }}
                    />
                  )}
                  {getProviderDisplayName(provider.name)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

