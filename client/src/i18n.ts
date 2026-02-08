import en from '../public/locales/en/common.json';
import fr from '../public/locales/fr/common.json';
import rw from '../public/locales/rw/common.json';
import sw from '../public/locales/sw/common.json';
import { useAppStore } from './store';

const LOCALES: Record<string, any> = {
  en,
  fr,
  rw,
  sw,
};

export function useT() {
  const { language } = useAppStore();
  const dict = LOCALES[language] || LOCALES['en'];
  return (key: string, fallback?: string) => {
    const parts = key.split('.');
    let cur: any = dict;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return fallback ?? key;
    }
    return typeof cur === 'string' ? cur : fallback ?? key;
  };
}
