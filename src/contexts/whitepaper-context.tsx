'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'id';

interface WhitepaperContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
}

interface Comment {
  id: string;
  section: string;
  text: string;
  author: string;
  timestamp: number;
}

const WhitepaperContext = createContext<WhitepaperContextType | undefined>(undefined);

export function WhitepaperProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('whitepaper-language') as Language;
    const savedComments = localStorage.getItem('whitepaper-comments');
    
    if (savedLang) setLanguage(savedLang);
    if (savedComments) setComments(JSON.parse(savedComments));
  }, []);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('whitepaper-language', language);
  }, [language]);

  // Save comments to localStorage
  useEffect(() => {
    localStorage.setItem('whitepaper-comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = (comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setComments((prev: Comment[]) => [...prev, newComment]);
  };

  return (
    <WhitepaperContext.Provider
      value={{
        language,
        setLanguage,
        searchQuery,
        setSearchQuery,
        activeSection,
        setActiveSection,
        comments,
        addComment,
      }}
    >
      {children}
    </WhitepaperContext.Provider>
  );
}

export function useWhitepaper(): WhitepaperContextType {
  const context = useContext(WhitepaperContext);
  if (!context) {
    throw new Error('useWhitepaper must be used within WhitepaperProvider');
  }
  return context;
}
