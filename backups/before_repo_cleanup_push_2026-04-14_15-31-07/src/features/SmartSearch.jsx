/**
 * SMART SEARCH SYSTEM
 * Advanced search with filters, AI, and recommendations
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import storage from '../core/storage';
import { track } from '../core/analytics';

export default function SmartSearch({
  data = [],
  onSearch,
  placeholder = 'Search...',
  lang = 'ru',
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, data]);

  const loadRecentSearches = () => {
    const saved = storage.get('recent_searches', []);
    setRecentSearches(saved);
  };

  const saveSearch = (searchQuery) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery),
    ].slice(0, 10);
    storage.set('recent_searches', updated);
    setRecentSearches(updated);
  };

  const clearRecentSearches = () => {
    storage.remove('recent_searches');
    setRecentSearches([]);
  };

  const generateSuggestions = useCallback(() => {
    if (!data || data.length === 0) return;

    const lowerQuery = query.toLowerCase();
    const matches = [];

    // Search in titles
    data.forEach(item => {
      if (item.title?.toLowerCase().includes(lowerQuery)) {
        matches.push({
          type: 'title',
          text: item.title,
          item,
        });
      }
    });

    // Search in tags
    data.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerQuery)) {
            matches.push({
              type: 'tag',
              text: tag,
              item,
            });
          }
        });
      }
    });

    // Search in categories
    data.forEach(item => {
      if (item.category?.toLowerCase().includes(lowerQuery)) {
        matches.push({
          type: 'category',
          text: item.category,
          item,
        });
      }
    });

    // Remove duplicates and limit
    const unique = matches
      .filter((match, index, self) =>
        index === self.findIndex(m => m.text === match.text)
      )
      .slice(0, 8);

    setSuggestions(unique);
  }, [query, data]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    saveSearch(searchQuery);
    track('search', { query: searchQuery });

    if (onSearch) {
      onSearch(searchQuery, filters);
    }

    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleRecentClick = (recent) => {
    setQuery(recent);
    handleSearch(recent);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '14px 48px 14px 44px',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#fff',
            fontSize: 15,
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
        />

        {/* Search Icon */}
        <div style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 18,
          color: 'rgba(255, 255, 255, 0.4)',
        }}>
          🔍
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (query || recentSearches.length > 0) && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 998,
              }}
            />

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                maxHeight: 400,
                overflowY: 'auto',
                borderRadius: 16,
                background: 'rgba(13, 15, 26, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                zIndex: 999,
              }}
            >
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div style={{ padding: '8px 0' }}>
                  <div style={{
                    padding: '8px 16px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {lang === 'ru' ? 'Предложения' : 'Suggestions'}
                  </div>
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 14,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>
                        {suggestion.type === 'title' && '📄'}
                        {suggestion.type === 'tag' && '🏷️'}
                        {suggestion.type === 'category' && '📁'}
                      </span>
                      <span>{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div style={{ padding: '8px 0' }}>
                  <div style={{
                    padding: '8px 16px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span>{lang === 'ru' ? 'Недавние' : 'Recent'}</span>
                    <button
                      onClick={clearRecentSearches}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#F87171',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {lang === 'ru' ? 'Очистить' : 'Clear'}
                    </button>
                  </div>
                  {recentSearches.map((recent, i) => (
                    <button
                      key={i}
                      onClick={() => handleRecentClick(recent)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 14,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>🕐</span>
                      <span>{recent}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query && suggestions.length === 0 && (
                <div style={{
                  padding: 32,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 14 }}>
                    {lang === 'ru' ? 'Ничего не найдено' : 'No results found'}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
