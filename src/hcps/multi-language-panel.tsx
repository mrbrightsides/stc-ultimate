'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Globe2, 
  CheckCircle2, 
  Search,
  TrendingUp,
  Languages,
  Users
} from 'lucide-react';
import { i18nService, languages } from '@/lib/phase3-i18n';
import type { SupportedLanguage } from '@/lib/phase3-i18n';

export function MultiLanguagePanel() {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [searchQuery, setSearchQuery] = useState('');
  
  const stats = i18nService.getStats();
  const currentLangConfig = i18nService.getLanguageConfig(selectedLang);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 90) return 'text-green-400';
    if (completeness >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLanguages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.activeLanguages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Translations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTranslations.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Completeness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{stats.averageCompleteness.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Language List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-green-400" />
              Supported Languages
            </CardTitle>
            <CardDescription>
              Multi-language support for global tourism platform
            </CardDescription>
            <div className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredLanguages.map((lang) => (
                <Card 
                  key={lang.code}
                  className={`cursor-pointer transition-colors ${
                    selectedLang === lang.code ? 'border-green-500/50 bg-green-500/5' : 'hover:border-muted-foreground/30'
                  }`}
                  onClick={() => setSelectedLang(lang.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{lang.flag}</span>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {lang.name}
                            {lang.enabled && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          </div>
                          <div className="text-sm text-muted-foreground">{lang.nativeName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getCompletenessColor(lang.completeness)}`}>
                          {lang.completeness}%
                        </div>
                        {lang.rtl && (
                          <Badge variant="outline" className="text-xs">RTL</Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={lang.completeness} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Language Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-400" />
              Language Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentLangConfig && (
              <>
                <div className="text-center space-y-2">
                  <div className="text-6xl">{currentLangConfig.flag}</div>
                  <div>
                    <div className="text-xl font-bold">{currentLangConfig.name}</div>
                    <div className="text-sm text-muted-foreground">{currentLangConfig.nativeName}</div>
                  </div>
                  <Badge variant={currentLangConfig.enabled ? 'default' : 'secondary'}>
                    {currentLangConfig.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Translation Progress</div>
                    <div className="flex items-center gap-3">
                      <Progress value={currentLangConfig.completeness} className="flex-1" />
                      <span className="font-semibold">{currentLangConfig.completeness}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-3 border border-muted rounded-lg">
                      <div className="text-muted-foreground">Language Code</div>
                      <div className="font-semibold">{currentLangConfig.code.toUpperCase()}</div>
                    </div>
                    <div className="p-3 border border-muted rounded-lg">
                      <div className="text-muted-foreground">Text Direction</div>
                      <div className="font-semibold">{currentLangConfig.rtl ? 'RTL' : 'LTR'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Sample Translations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 border border-muted rounded">
                      <div className="text-muted-foreground">Welcome</div>
                      <div className="font-semibold">
                        {i18nService.translate('welcome', currentLangConfig.code)}
                      </div>
                    </div>
                    <div className="p-2 border border-muted rounded">
                      <div className="text-muted-foreground">Explore Destinations</div>
                      <div className="font-semibold">
                        {i18nService.translate('explore_destinations', currentLangConfig.code)}
                      </div>
                    </div>
                    <div className="p-2 border border-muted rounded">
                      <div className="text-muted-foreground">Book Now</div>
                      <div className="font-semibold">
                        {i18nService.translate('book_now', currentLangConfig.code)}
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Globe2 className="w-4 h-4 mr-2" />
                  Switch to {currentLangConfig.name}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Translation Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Translation Coverage by Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(stats.translationCoverage).map(([code, coverage]) => {
              const lang = languages.find(l => l.code === code);
              if (!lang) return null;
              
              return (
                <div key={code} className="text-center">
                  <div className="text-3xl mb-2">{lang.flag}</div>
                  <div className={`text-xl font-bold ${getCompletenessColor(coverage)}`}>
                    {coverage}%
                  </div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Most Popular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Most Popular Language</div>
              <div className="text-2xl font-bold">{stats.mostPopularLanguage}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Active Translations</div>
              <div className="text-2xl font-bold text-green-400">{stats.activeLanguages}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Coverage Rate</div>
              <div className="text-2xl font-bold text-cyan-400">
                {stats.averageCompleteness.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
