// Phase 3: Internationalization (i18n) System
// Multi-language support for global tourism platform

export type SupportedLanguage = 'en' | 'id' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ar' | 'hi';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  enabled: boolean;
  completeness: number; // percentage of translated strings
}

export interface TranslationStats {
  totalLanguages: number;
  activeLanguages: number;
  totalTranslations: number;
  averageCompleteness: number;
  mostPopularLanguage: string;
  translationCoverage: {
    [key in SupportedLanguage]: number;
  };
}

export interface ContentTranslation {
  key: string;
  category: 'ui' | 'content' | 'destination' | 'help' | 'legal';
  translations: {
    [key in SupportedLanguage]?: string;
  };
  context?: string;
  lastUpdated: Date;
}

export interface LocalizationPreferences {
  language: SupportedLanguage;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  currency: string;
  numberFormat: 'comma' | 'period' | 'space';
  timezone: string;
}

// Language configurations
export const languages: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    rtl: false,
    enabled: true,
    completeness: 100
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    rtl: false,
    enabled: true,
    completeness: 100
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    enabled: true,
    completeness: 95
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    enabled: true,
    completeness: 92
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false,
    enabled: true,
    completeness: 88
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    enabled: true,
    completeness: 85
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    enabled: true,
    completeness: 83
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    enabled: true,
    completeness: 80
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    enabled: true,
    completeness: 75
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    rtl: false,
    enabled: true,
    completeness: 70
  }
];

// Sample translations for common UI elements
export const commonTranslations: ContentTranslation[] = [
  {
    key: 'welcome',
    category: 'ui',
    translations: {
      en: 'Welcome to STC Ultimate',
      id: 'Selamat datang di STC Ultimate',
      zh: '欢迎来到 STC Ultimate',
      ja: 'STC Ultimateへようこそ',
      ko: 'STC Ultimate에 오신 것을 환영합니다',
      es: 'Bienvenido a STC Ultimate',
      fr: 'Bienvenue sur STC Ultimate',
      de: 'Willkommen bei STC Ultimate',
      ar: 'مرحبا بك في STC Ultimate',
      hi: 'STC Ultimate में आपका स्वागत है'
    },
    lastUpdated: new Date()
  },
  {
    key: 'explore_destinations',
    category: 'ui',
    translations: {
      en: 'Explore Destinations',
      id: 'Jelajahi Destinasi',
      zh: '探索目的地',
      ja: '目的地を探索',
      ko: '목적지 탐색',
      es: 'Explorar Destinos',
      fr: 'Explorer les Destinations',
      de: 'Reiseziele erkunden',
      ar: 'استكشف الوجهات',
      hi: 'गंतव्यों का अन्वेषण करें'
    },
    lastUpdated: new Date()
  },
  {
    key: 'book_now',
    category: 'ui',
    translations: {
      en: 'Book Now',
      id: 'Pesan Sekarang',
      zh: '立即预订',
      ja: '今すぐ予約',
      ko: '지금 예약',
      es: 'Reservar Ahora',
      fr: 'Réserver Maintenant',
      de: 'Jetzt Buchen',
      ar: 'احجز الآن',
      hi: 'अभी बुक करें'
    },
    lastUpdated: new Date()
  },
  {
    key: 'search',
    category: 'ui',
    translations: {
      en: 'Search',
      id: 'Cari',
      zh: '搜索',
      ja: '検索',
      ko: '검색',
      es: 'Buscar',
      fr: 'Rechercher',
      de: 'Suchen',
      ar: 'بحث',
      hi: 'खोजें'
    },
    lastUpdated: new Date()
  }
];

// Destination-specific translations
export const destinationTranslations: ContentTranslation[] = [
  {
    key: 'borobudur_description',
    category: 'destination',
    translations: {
      en: 'The world\'s largest Buddhist temple, a UNESCO World Heritage Site',
      id: 'Candi Buddha terbesar di dunia, Situs Warisan Dunia UNESCO',
      zh: '世界上最大的佛教寺庙，联合国教科文组织世界遗产',
      ja: '世界最大の仏教寺院、ユネスコ世界遺産',
      ko: '세계에서 가장 큰 불교 사원, 유네스코 세계 문화유산',
      es: 'El templo budista más grande del mundo, Patrimonio de la Humanidad por la UNESCO',
      fr: 'Le plus grand temple bouddhiste du monde, site du patrimoine mondial de l\'UNESCO',
      de: 'Der größte buddhistische Tempel der Welt, UNESCO-Weltkulturerbe',
      ar: 'أكبر معبد بوذي في العالم، أحد مواقع التراث العالمي لليونسكو',
      hi: 'दुनिया का सबसे बड़ा बौद्ध मंदिर, यूनेस्को विश्व धरोहर स्थल'
    },
    context: 'Borobudur Temple description',
    lastUpdated: new Date()
  },
  {
    key: 'raja_ampat_description',
    category: 'destination',
    translations: {
      en: 'Pristine diving paradise with the world\'s richest marine biodiversity',
      id: 'Surga menyelam dengan keanekaragaman hayati laut terkaya di dunia',
      zh: '拥有世界上最丰富的海洋生物多样性的原始潜水天堂',
      ja: '世界で最も豊かな海洋生物多様性を誇る手つかずのダイビングパラダイス',
      ko: '세계에서 가장 풍부한 해양 생물 다양성을 자랑하는 원시 다이빙 천국',
      es: 'Paraíso de buceo prístino con la biodiversidad marina más rica del mundo',
      fr: 'Paradis de plongée vierge avec la biodiversité marine la plus riche au monde',
      de: 'Unberührtes Tauchparadies mit der reichsten marinen Biodiversität der Welt',
      ar: 'جنة الغوص البكر مع أغنى التنوع البيولوجي البحري في العالم',
      hi: 'दुनिया की सबसे समृद्ध समुद्री जैव विविधता वाला प्राचीन डाइविंग स्वर्ग'
    },
    context: 'Raja Ampat description',
    lastUpdated: new Date()
  }
];

// i18n Service
class I18nService {
  private currentLanguage: SupportedLanguage = 'en';
  private translations: Map<string, ContentTranslation> = new Map();

  constructor() {
    // Load all translations
    [...commonTranslations, ...destinationTranslations].forEach(t => {
      this.translations.set(t.key, t);
    });
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage = lang;
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  translate(key: string, lang?: SupportedLanguage): string {
    const language = lang || this.currentLanguage;
    const translation = this.translations.get(key);
    
    if (!translation) {
      return key; // Return key if translation not found
    }

    return translation.translations[language] || translation.translations.en || key;
  }

  getLanguageConfig(code: SupportedLanguage): LanguageConfig | undefined {
    return languages.find(l => l.code === code);
  }

  getAllLanguages(): LanguageConfig[] {
    return [...languages];
  }

  getEnabledLanguages(): LanguageConfig[] {
    return languages.filter(l => l.enabled);
  }

  getStats(): TranslationStats {
    const enabledLanguages = this.getEnabledLanguages();
    const translationCoverage: { [key in SupportedLanguage]?: number } = {};

    languages.forEach(lang => {
      translationCoverage[lang.code] = lang.completeness;
    });

    return {
      totalLanguages: languages.length,
      activeLanguages: enabledLanguages.length,
      totalTranslations: this.translations.size,
      averageCompleteness: languages.reduce((sum, l) => sum + l.completeness, 0) / languages.length,
      mostPopularLanguage: 'English',
      translationCoverage: translationCoverage as { [key in SupportedLanguage]: number }
    };
  }

  formatDate(date: Date, preferences: LocalizationPreferences): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (preferences.dateFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString();
    }
  }

  formatNumber(num: number, preferences: LocalizationPreferences): string {
    const separator = preferences.numberFormat === 'comma' ? ',' : 
                     preferences.numberFormat === 'period' ? '.' : ' ';
    
    return num.toLocaleString('en-US').replace(/,/g, separator);
  }
}

export const i18nService = new I18nService();
