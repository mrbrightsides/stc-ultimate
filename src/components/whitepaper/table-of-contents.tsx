'use client';

import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useWhitepaper } from '@/contexts/whitepaper-context';
import { whitepaperContent, getContentByLanguage, type WhitepaperSection } from '@/lib/whitepaper-content';
import { cn } from '@/lib/utils';

export function TableOfContents(): JSX.Element {
  const { language, activeSection, setActiveSection } = useWhitepaper();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string): void => {
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const renderSection = (section: WhitepaperSection, level: number = 0): JSX.Element => {
    const { title } = getContentByLanguage(section, language);
    const hasSubsections = section.subsections && section.subsections.length > 0;
    const isExpanded = expandedSections[section.id];
    const isActive = activeSection === section.id;

    return (
      <div key={section.id} className={cn('mb-1', level > 0 && 'ml-4')}>
        <div className="flex items-center gap-1">
          {hasSubsections && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(section.id)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'justify-start text-left h-auto py-1 px-2 text-sm w-full',
              isActive && 'bg-purple-500/20 text-purple-400 font-semibold',
              !hasSubsections && 'ml-7'
            )}
          >
            {title}
          </Button>
        </div>
        {hasSubsections && isExpanded && (
          <div className="mt-1">
            {section.subsections!.map((subsection: WhitepaperSection) => 
              renderSection(subsection, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Auto-expand sections containing active section
  useEffect(() => {
    const findAndExpandParent = (sections: WhitepaperSection[]): void => {
      sections.forEach((section: WhitepaperSection) => {
        if (section.id === activeSection) {
          setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [section.id]: true }));
        }
        if (section.subsections) {
          const hasActiveChild = section.subsections.some(
            (sub: WhitepaperSection) => sub.id === activeSection
          );
          if (hasActiveChild) {
            setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [section.id]: true }));
          }
          findAndExpandParent(section.subsections);
        }
      });
    };
    findAndExpandParent(whitepaperContent);
  }, [activeSection]);

  return (
    <div className="h-full border-r border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-bold text-lg text-purple-400">
          {language === 'en' ? 'Table of Contents' : 'Daftar Isi'}
        </h3>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-4 space-y-1">
          {whitepaperContent.map((section: WhitepaperSection) => renderSection(section))}
        </div>
      </ScrollArea>
    </div>
  );
}
