/**
 * STC Ultimate - Internationalization
 * Multi-language support for immersive experience
 */

export type Language = 'en' | 'id';

export interface TranslationKeys {
  // Navigation
  'nav.home': string;
  'nav.locations': string;
  'nav.achievements': string;
  'nav.settings': string;

  // Common
  'common.loading': string;
  'common.error': string;
  'common.close': string;
  'common.cancel': string;
  'common.confirm': string;
  'common.save': string;
  'common.back': string;
  'common.next': string;

  // Panorama Viewer
  'panorama.title': string;
  'panorama.description': string;
  'panorama.controls.drag': string;
  'panorama.controls.zoom': string;
  'panorama.controls.hotspots': string;
  'panorama.hotspots.title': string;
  'panorama.hotspots.interactivePoints': string;
  'panorama.quality': string;
  'panorama.coverage': string;

  // Audio
  'audio.play': string;
  'audio.pause': string;
  'audio.mute': string;
  'audio.unmute': string;
  'audio.volume': string;
  'audio.narration': string;

  // Weather
  'weather.title': string;
  'weather.clear': string;
  'weather.cloudy': string;
  'weather.rain': string;
  'weather.fog': string;
  'weather.sunset': string;
  'weather.sunrise': string;

  // Photo Mode
  'photo.title': string;
  'photo.capture': string;
  'photo.download': string;
  'photo.filters': string;
  'photo.effects': string;

  // Achievements
  'achievements.title': string;
  'achievements.unlocked': string;
  'achievements.progress': string;
  'achievements.points': string;
  'achievements.tier': string;

  // VR Mode
  'vr.title': string;
  'vr.enter': string;
  'vr.exit': string;
  'vr.notSupported': string;

  // Locations
  'location.bali': string;
  'location.yogyakarta': string;
  'location.lombok': string;
  'location.jakarta': string;
}

/**
 * English translations
 */
export const EN_TRANSLATIONS: TranslationKeys = {
  // Navigation
  'nav.home': 'Home',
  'nav.locations': 'Locations',
  'nav.achievements': 'Achievements',
  'nav.settings': 'Settings',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.back': 'Back',
  'common.next': 'Next',

  // Panorama Viewer
  'panorama.title': '360° Panoramic Experience',
  'panorama.description': 'Immersive 360° views - Click and drag to explore',
  'panorama.controls.drag': 'Click & Drag to rotate and explore in any direction',
  'panorama.controls.zoom': 'Scroll to zoom in and out',
  'panorama.controls.hotspots': 'Click colored spheres for information',
  'panorama.hotspots.title': 'Interactive Points',
  'panorama.hotspots.interactivePoints': 'Points of Interest',
  'panorama.quality': 'View Quality',
  'panorama.coverage': 'Coverage',

  // Audio
  'audio.play': 'Play Audio',
  'audio.pause': 'Pause Audio',
  'audio.mute': 'Mute',
  'audio.unmute': 'Unmute',
  'audio.volume': 'Volume',
  'audio.narration': 'Audio Narration',

  // Weather
  'weather.title': 'Weather & Atmosphere',
  'weather.clear': 'Clear',
  'weather.cloudy': 'Cloudy',
  'weather.rain': 'Rain',
  'weather.fog': 'Fog',
  'weather.sunset': 'Sunset',
  'weather.sunrise': 'Sunrise',

  // Photo Mode
  'photo.title': 'Photo Mode',
  'photo.capture': 'Capture Photo',
  'photo.download': 'Download',
  'photo.filters': 'Filters',
  'photo.effects': 'Effects',

  // Achievements
  'achievements.title': 'Achievements',
  'achievements.unlocked': 'Unlocked',
  'achievements.progress': 'Progress',
  'achievements.points': 'Points',
  'achievements.tier': 'Tier',

  // VR Mode
  'vr.title': 'Virtual Reality',
  'vr.enter': 'Enter VR Mode',
  'vr.exit': 'Exit VR Mode',
  'vr.notSupported': 'VR not supported on this device',

  // Locations
  'location.bali': 'Bali',
  'location.yogyakarta': 'Yogyakarta',
  'location.lombok': 'Lombok',
  'location.jakarta': 'Jakarta'
};

/**
 * Indonesian translations
 */
export const ID_TRANSLATIONS: TranslationKeys = {
  // Navigation
  'nav.home': 'Beranda',
  'nav.locations': 'Lokasi',
  'nav.achievements': 'Pencapaian',
  'nav.settings': 'Pengaturan',

  // Common
  'common.loading': 'Memuat...',
  'common.error': 'Kesalahan',
  'common.close': 'Tutup',
  'common.cancel': 'Batal',
  'common.confirm': 'Konfirmasi',
  'common.save': 'Simpan',
  'common.back': 'Kembali',
  'common.next': 'Selanjutnya',

  // Panorama Viewer
  'panorama.title': 'Pengalaman Panorama 360°',
  'panorama.description': 'Tampilan 360° yang imersif - Klik dan seret untuk menjelajah',
  'panorama.controls.drag': 'Klik & Seret untuk memutar dan menjelajah ke segala arah',
  'panorama.controls.zoom': 'Gulir untuk memperbesar dan memperkecil',
  'panorama.controls.hotspots': 'Klik bola berwarna untuk informasi',
  'panorama.hotspots.title': 'Titik Interaktif',
  'panorama.hotspots.interactivePoints': 'Tempat Menarik',
  'panorama.quality': 'Kualitas Tampilan',
  'panorama.coverage': 'Cakupan',

  // Audio
  'audio.play': 'Putar Audio',
  'audio.pause': 'Jeda Audio',
  'audio.mute': 'Bisukan',
  'audio.unmute': 'Aktifkan Suara',
  'audio.volume': 'Volume',
  'audio.narration': 'Narasi Audio',

  // Weather
  'weather.title': 'Cuaca & Atmosfer',
  'weather.clear': 'Cerah',
  'weather.cloudy': 'Berawan',
  'weather.rain': 'Hujan',
  'weather.fog': 'Kabut',
  'weather.sunset': 'Matahari Terbenam',
  'weather.sunrise': 'Matahari Terbit',

  // Photo Mode
  'photo.title': 'Mode Foto',
  'photo.capture': 'Ambil Foto',
  'photo.download': 'Unduh',
  'photo.filters': 'Filter',
  'photo.effects': 'Efek',

  // Achievements
  'achievements.title': 'Pencapaian',
  'achievements.unlocked': 'Terbuka',
  'achievements.progress': 'Progres',
  'achievements.points': 'Poin',
  'achievements.tier': 'Tingkat',

  // VR Mode
  'vr.title': 'Realitas Virtual',
  'vr.enter': 'Masuk Mode VR',
  'vr.exit': 'Keluar Mode VR',
  'vr.notSupported': 'VR tidak didukung di perangkat ini',

  // Locations
  'location.bali': 'Bali',
  'location.yogyakarta': 'Yogyakarta',
  'location.lombok': 'Lombok',
  'location.jakarta': 'Jakarta'
};

/**
 * Get translations for a language
 */
export function getTranslations(language: Language): TranslationKeys {
  return language === 'id' ? ID_TRANSLATIONS : EN_TRANSLATIONS;
}

/**
 * Translate a key
 */
export function translate(key: keyof TranslationKeys, language: Language = 'en'): string {
  const translations = getTranslations(language);
  return translations[key] || key;
}
