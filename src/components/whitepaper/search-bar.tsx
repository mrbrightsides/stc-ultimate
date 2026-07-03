'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useWhitepaper } from '@/contexts/whitepaper-context';
import { searchContent, getContentByLanguage, type WhitepaperSection } from '@/lib/whitepaper-content';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SearchBar(): JSX.Element {
  const { language, searchQuery, setSearchQuery, setActiveSection } = useWhitepaper();
  const [results, setResults] = useState<WhitepaperSection[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const searchResults = searchContent(searchQuery, language);
      setResults(searchResults);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [searchQuery, language]);

  const handleResultClick = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const clearSearch = (): void => {
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={language === 'en' ? 'Search whitepaper...' : 'Cari whitepaper...'}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-black/40 border-white/20 focus:border-purple-500"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 bg-black/95 border-purple-500/30 backdrop-blur-xl">
          <ScrollArea className="max-h-96">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-2 py-1 mb-2">
                {results.length} {language === 'en' ? 'results found' : 'hasil ditemukan'}
              </div>
              {results.map((section: WhitepaperSection) => {
                const { title, content } = getContentByLanguage(section, language);
                const snippet = content.slice(0, 120) + '...';
                
                return (
                  <Button
                    key={section.id}
                    variant="ghost"
                    onClick={() => handleResultClick(section.id)}
                    className="w-full justify-start text-left h-auto py-3 px-2 mb-1 hover:bg-purple-500/20"
                  >
                    <div>
                      <div className="font-semibold text-purple-400 mb-1">{title}</div>
                      <div className="text-xs text-gray-400 line-clamp-2">{snippet}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      )}

      {showResults && results.length === 0 && searchQuery.length > 2 && (
        <Card className="absolute top-full mt-2 w-full z-50 bg-black/95 border-purple-500/30 backdrop-blur-xl">
          <div className="p-4 text-center text-gray-400 text-sm">
            {language === 'en' ? 'No results found' : 'Tidak ada hasil'}
          </div>
        </Card>
      )}
    </div>
  );
}
