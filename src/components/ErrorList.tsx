'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SearchAndFilter } from './SearchAndFilter';
import type { Error } from '@/lib/mdx';
import { getProviderDisplayName } from '@/lib/providerDisplayName';

interface Provider {
  name: string;
  count: number;
  icon?: string;
}

interface ErrorListProps {
  errors: Error[];
  providers: Provider[];
  initialProvider?: string;
}

export function ErrorList({ errors, providers, initialProvider }: ErrorListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(initialProvider || null);

  // Semantic search function
  const semanticSearch = (query: string, text: string): number => {
    if (!query.trim()) return 1;
    
    const queryLower = query.toLowerCase().trim();
    const textLower = text.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === queryLower) return 1;
    
    // Exact substring match
    if (textLower.includes(queryLower)) return 0.9;
    
    // Tokenize both query and text
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    const textWords = textLower.split(/\s+/);
    
    if (queryWords.length === 0) return 0;
    
    // Calculate word match score
    let matchScore = 0;
    let matchedWords = 0;
    
    for (const queryWord of queryWords) {
      // Exact word match
      if (textWords.includes(queryWord)) {
        matchScore += 1;
        matchedWords++;
        continue;
      }
      
      // Partial word match (fuzzy)
      for (const textWord of textWords) {
        if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
          matchScore += 0.5;
          matchedWords++;
          break;
        }
        
        // Levenshtein-like fuzzy matching for typos (simple version)
        if (Math.abs(textWord.length - queryWord.length) <= 2) {
          const minLen = Math.min(textWord.length, queryWord.length);
          let commonChars = 0;
          for (let i = 0; i < minLen; i++) {
            if (textWord[i] === queryWord[i]) commonChars++;
          }
          if (commonChars / minLen >= 0.7) {
            matchScore += 0.3;
            matchedWords++;
            break;
          }
        }
      }
    }
    
    // Calculate final score based on matched words
    const wordMatchRatio = matchedWords / queryWords.length;
    return wordMatchRatio * (matchScore / queryWords.length);
  };

  const filteredErrors = useMemo(() => {
    if (!searchQuery.trim()) {
      // No search query, just filter by provider
      return errors.filter((error) => {
        return !selectedProvider || 
          error.frontmatter.provider.toLowerCase() === selectedProvider.toLowerCase();
      });
    }

    // Score and sort by relevance
    const scoredErrors = errors.map((error) => {
      const titleScore = semanticSearch(searchQuery, error.frontmatter.title);
      const providerScore = semanticSearch(searchQuery, error.frontmatter.provider);
      
      // Combined score (title weighted more heavily)
      const combinedScore = titleScore * 0.8 + providerScore * 0.2;
      
      return {
        error,
        score: combinedScore,
      };
    });

    // Filter by provider and minimum relevance threshold
    return scoredErrors
      .filter(({ error, score }) => {
        const matchesProvider = 
          !selectedProvider || 
          error.frontmatter.provider.toLowerCase() === selectedProvider.toLowerCase();
        
        // Only include results with score > 0.1 (at least some relevance)
        return matchesProvider && score > 0.1;
      })
      .sort((a, b) => b.score - a.score) // Sort by relevance (highest first)
      .map(({ error }) => error);
  }, [errors, searchQuery, selectedProvider]);

  const getErrorUrl = (error: Error) => {
    const provider = error.frontmatter.provider.toLowerCase();
    return `/provider/${provider}/issue/${error.slug}`;
  };

  return (
    <div>
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProvider={selectedProvider || undefined}
        onProviderChange={setSelectedProvider}
        providers={providers}
        showProviderFilter={true}
      />

      {searchQuery || selectedProvider ? (
        <div style={{ marginTop: '2rem', marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredErrors.length} of {errors.length} error{errors.length !== 1 ? 's' : ''}
        </div>
      ) : null}

      {filteredErrors.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          color: '#6b7280',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>No errors found</p>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="error-grid">
          {filteredErrors.map((error) => (
            <Link key={error.slug} href={getErrorUrl(error)} className="card">
              <div>
                <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                  {error.frontmatter.provider_icon && (
                    <img
                      src={error.frontmatter.provider_icon}
                      alt={getProviderDisplayName(error.frontmatter.provider)}
                      style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: 0.8 }}
                    />
                  )}
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {getProviderDisplayName(error.frontmatter.provider)}
                  </span>
                </div>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{error.frontmatter.title}</h3>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginTop: 'auto', 
                paddingTop: '1rem',
                color: 'var(--primary)', 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>
                View Solution <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

