'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar(): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollableElement = document.getElementById('whitepaper-content');
      if (!scrollableElement) return;

      const scrollTop = scrollableElement.scrollTop;
      const scrollHeight = scrollableElement.scrollHeight - scrollableElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const scrollableElement = document.getElementById('whitepaper-content');
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
      return () => scrollableElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/40">
      <div
        className={cn(
          'h-full transition-all duration-300 ease-out',
          'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500'
        )}
        style={{ width: `${scrollProgress}%` }}
      />
      {scrollProgress > 0 && scrollProgress < 100 && (
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-lg shadow-purple-500/50"
          style={{ left: `${scrollProgress}%` }}
        />
      )}
    </div>
  );
}
