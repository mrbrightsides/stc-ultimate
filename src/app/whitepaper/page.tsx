'use client';

import React, { useEffect, useRef } from 'react';
import { WhitepaperProvider, useWhitepaper } from '@/contexts/whitepaper-context';
import { TableOfContents } from '@/components/whitepaper/table-of-contents';
import { SearchBar } from '@/components/whitepaper/search-bar';
import { ProgressBar } from '@/components/whitepaper/progress-bar';
import { CommentWidget } from '@/components/whitepaper/comment-widget';
import {
  MarketGrowthChart,
  TokenDistributionChart,
  UserGrowthChart,
  CostComparisonChart,
  IoTSensorChart,
} from '@/components/whitepaper/chart-components';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Globe, Home } from 'lucide-react';
import { whitepaperContent, getContentByLanguage, type WhitepaperSection } from '@/lib/whitepaper-content';
import { parseMarkdown } from '@/lib/markdown-parser';
import { generateWhitepaperPDF } from '@/lib/pdf-generator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

function WhitepaperContent(): JSX.Element {
  const { language, setLanguage, setActiveSection } = useWhitepaper();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  // Track active section based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setActiveSection]);

  const handleDownloadPDF = async (): Promise<void> => {
    try {
      toast.loading(
        language === 'en' 
          ? 'Generating PDF... This may take a moment.' 
          : 'Menghasilkan PDF... Ini mungkin memakan waktu sebentar.',
        { id: 'pdf-generation' }
      );

      await generateWhitepaperPDF(whitepaperContent, language);

      toast.success(
        language === 'en' 
          ? 'Whitepaper PDF downloaded successfully! 📄' 
          : 'PDF whitepaper berhasil diunduh! 📄',
        { id: 'pdf-generation' }
      );
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to generate PDF. Please try again.' 
          : 'Gagal menghasilkan PDF. Silakan coba lagi.',
        { id: 'pdf-generation' }
      );
    }
  };

  const renderSection = (section: WhitepaperSection, level: number = 0): JSX.Element => {
    const { title, content } = getContentByLanguage(section, language);
    const HeadingTag = level === 0 ? 'h2' : level === 1 ? 'h3' : 'h4';

    return (
      <div key={section.id} id={section.id} data-section className="mb-12">
        <HeadingTag className={`font-bold mb-4 ${level === 0 ? 'text-3xl' : level === 1 ? 'text-2xl' : 'text-xl'} text-purple-400`}>
          {title}
        </HeadingTag>
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
          {parseMarkdown(content)}
        </div>

        {/* Insert charts at specific sections */}
        {section.id === 'introduction' && (
          <div className="my-8 bg-white/5 p-6 rounded-lg border border-purple-500/30">
            <MarketGrowthChart />
          </div>
        )}
        {section.id === 'pain-points' && (
          <div className="my-8 bg-white/5 p-6 rounded-lg border border-purple-500/30">
            <CostComparisonChart />
          </div>
        )}
        {section.id === 'token-utility' && (
          <div className="my-8 bg-white/5 p-6 rounded-lg border border-purple-500/30">
            <TokenDistributionChart />
          </div>
        )}
        {section.id === 'iot-layer' && (
          <div className="my-8 bg-white/5 p-6 rounded-lg border border-purple-500/30">
            <IoTSensorChart />
          </div>
        )}
        {section.id === 'roadmap-2027-2030' && (
          <div className="my-8 bg-white/5 p-6 rounded-lg border border-purple-500/30">
            <UserGrowthChart />
          </div>
        )}

        {section.subsections && section.subsections.length > 0 && (
          <div className="mt-8 space-y-8">
            {section.subsections.map((subsection: WhitepaperSection) => 
              renderSection(subsection, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white">
      <ProgressBar />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              STC Ultimate Whitepaper
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'ID' : 'EN'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2 bg-purple-500 hover:bg-purple-600"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Table of Contents Sidebar */}
        <div className="w-80 hidden lg:block">
          <TableOfContents />
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1" id="whitepaper-content">
          <div ref={contentRef} className="container max-w-4xl mx-auto px-8 py-12">
            {/* Cover Page */}
            <div className="mb-16 text-center py-20">
              <div className="inline-block mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-6xl font-bold mx-auto">
                  STC
                </div>
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                STC ULTIMATE
              </h1>
              <p className="text-2xl text-gray-400 mb-4">
                {language === 'en' 
                  ? 'Smart Tourism & Culture Platform' 
                  : 'Platform Pariwisata & Budaya Pintar'}
              </p>
              <p className="text-lg text-gray-500 mb-8">
                {language === 'en' 
                  ? 'Powered by Blockchain, IoT, AI & Extended Reality' 
                  : 'Didukung oleh Blockchain, IoT, AI & Extended Reality'}
              </p>
              <div className="flex gap-4 justify-center text-sm text-gray-400">
                <span>Version 1.0</span>
                <span>•</span>
                <span>December 2025</span>
                <span>•</span>
                <span>ELPEEF x RANTAI</span>
              </div>
            </div>

            {/* Content Sections */}
            {whitepaperContent.map((section: WhitepaperSection) => renderSection(section))}

            {/* Footer */}
            <footer className="mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
              <p className="mb-4">
                {language === 'en' 
                  ? '© 2025 STC Ultimate. All rights reserved.' 
                  : '© 2025 STC Ultimate. Hak cipta dilindungi.'}
              </p>
              <p>
                {language === 'en' 
                  ? 'For inquiries: support@elpeef.com' 
                  : 'Untuk pertanyaan: support@elpeef.com'}
              </p>
            </footer>
          </div>
        </ScrollArea>
      </div>

      {/* Comment Widget */}
      <CommentWidget />
    </div>
  );
}

export default function WhitepaperPage(): JSX.Element {
  return (
    <WhitepaperProvider>
      <WhitepaperContent />
    </WhitepaperProvider>
  );
}
