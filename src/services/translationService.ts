// src/services/translationService.ts
// Multi-Tier Dynamic Localization Engine with Native Unicode Script Verification

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguage } from '../types';

const STORAGE_KEY = '@app_translations_cache_v1';

// Verified Human Dictionary
const HUMAN_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत है',
    te: 'స్వాగతం',
    ta: 'வரவேற்பு',
    es: 'Bienvenido',
  },
  home: {
    en: 'Home',
    hi: 'होम',
    te: 'హోమ్',
    ta: 'முகப்பு',
    es: 'Inicio',
  },
  explore: {
    en: 'Explore',
    hi: 'खोजें',
    te: 'అన్వేషించండి',
    ta: 'ஆராயுங்கள்',
    es: 'Explorar',
  },
  analytics: {
    en: 'Analytics',
    hi: 'आंकड़े',
    te: 'విశ్లేషణలు',
    ta: 'புள்ளிவிவரங்கள்',
    es: 'Analíticas',
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
    te: 'ప్రొఫైల్',
    ta: 'சுயவிவரம்',
    es: 'Perfil',
  },
  add_new: {
    en: 'Add New',
    hi: 'नया जोड़ें',
    te: 'కొత్తది జోడించండి',
    ta: 'புதியதைச் சேர்',
    es: 'Agregar Nuevo',
  },
  status: {
    en: 'Status',
    hi: 'स्थिति',
    te: 'స్థితి',
    ta: 'நிலை',
    es: 'Estado',
  },
  completed: {
    en: 'Completed',
    hi: 'पूरा हुआ',
    te: 'పూర్తయింది',
    ta: 'முடிந்தது',
    es: 'Completado',
  },
  pending: {
    en: 'Pending',
    hi: 'लंबित',
    te: 'వేచి ఉంది',
    ta: 'நிலுவையில் உள்ளது',
    es: 'Pendiente',
  },
  save: {
    en: 'Save',
    hi: 'सहेजें',
    te: 'భద్రపరచు',
    ta: 'சேமி',
    es: 'Guardar',
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    te: 'రద్దు చేయి',
    ta: 'ரத்து செய்',
    es: 'Cancelar',
  },
};

// Unicode Script Verification Regexes
const SCRIPT_REGEX_MAP: Record<SupportedLanguage, RegExp | null> = {
  en: /^[\x00-\x7F]+$/,
  hi: /[\u0900-\u097F]/, // Devanagari
  te: /[\u0C00-\u0C7F]/, // Telugu
  ta: /[\u0B80-\u0BFF]/, // Tamil
  es: /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/,
};

class TranslationService {
  private dynamicCache: Map<string, string> = new Map();
  private currentLanguage: SupportedLanguage = 'en';

  constructor() {
    this.loadCache();
  }

  private async loadCache(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.entries(parsed).forEach(([k, v]) => {
          this.dynamicCache.set(k, String(v));
        });
      }
    } catch {}
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage = lang;
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public translate(key: string, targetLang?: SupportedLanguage): string {
    const lang = targetLang || this.currentLanguage;
    if (lang === 'en') return HUMAN_DICTIONARY[key]?.en || key;

    // 1. Human verified dictionary match
    const dictMatch = HUMAN_DICTIONARY[key]?.[lang];
    if (dictMatch) return dictMatch;

    // 2. Dynamic cache match with script guard
    const cacheKey = `${lang}:${key.toLowerCase().trim()}`;
    const cached = this.dynamicCache.get(cacheKey);
    const regex = SCRIPT_REGEX_MAP[lang];
    if (cached && (!regex || regex.test(cached))) {
      return cached;
    }

    // 3. Graceful fallback
    return HUMAN_DICTIONARY[key]?.en || key;
  }
}

export const translationService = new TranslationService();
