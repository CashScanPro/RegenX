import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(amountInCents: number, currency = 'eur', locale = 'fr-FR'): string {
    return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency.toUpperCase(),
          minimumFractionDigits: 0,
    }).format(amountInCents / 100);
}

export function formatDate(date: string | Date, locale = 'fr-FR'): string {
    return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
    }).format(new Date(date));
}

export function getLocaleFromCountry(country: string): string {
    const localeMap: Record<string, string> = {
          FR: 'fr-FR', DE: 'de-DE', ES: 'es-ES', IT: 'it-IT',
          PT: 'pt-PT', NL: 'nl-NL', BE: 'fr-BE', CH: 'fr-CH',
          GB: 'en-GB', US: 'en-US',
    };
    return localeMap[country] || 'fr-FR';
}

export function detectUserLanguage(): string {
    if (typeof navigator !== 'undefined') {
          const lang = navigator.language.split('-')[0];
          const supported = ['fr', 'en', 'de', 'es', 'it', 'pt', 'nl'];
          return supported.includes(lang) ? lang : 'fr';
    }
    return 'fr';
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const SUPPORTED_COUNTRIES = [
  { code: 'FR', name: 'France', currency: 'EUR', locale: 'fr-FR' },
  { code: 'DE', name: 'Allemagne', currency: 'EUR', locale: 'de-DE' },
  { code: 'ES', name: 'Espagne', currency: 'EUR', locale: 'es-ES' },
  { code: 'IT', name: 'Italie', currency: 'EUR', locale: 'it-IT' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', locale: 'pt-PT' },
  { code: 'NL', name: 'Pays-Bas', currency: 'EUR', locale: 'nl-NL' },
  { code: 'BE', name: 'Belgique', currency: 'EUR', locale: 'fr-BE' },
  { code: 'CH', name: 'Suisse', currency: 'CHF', locale: 'fr-CH' },
  { code: 'GB', name: 'Royaume-Uni', currency: 'GBP', locale: 'en-GB' },
  ];
