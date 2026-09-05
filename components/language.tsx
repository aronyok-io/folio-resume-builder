'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { translations, Key } from '@/lib/i18n';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
const Context = createContext({
  lang: 'en',
  setLang: (_s: string) => {},
  t: (s: Key) => translations.en[s],
});
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    try {
      const s = localStorage.getItem('folio-language');
      if (s && translations[s]) setLang(s);
    } catch {}
  }, []);
  function change(s: string) {
    setLang(s);
    try {
      localStorage.setItem('folio-language', s);
    } catch {}
  }
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <Context.Provider
      value={{ lang, setLang: change, t: (s) => translations[lang][s] }}
    >
      {children}
    </Context.Provider>
  );
}
export const useLanguage = () => useContext(Context);
export function LanguageSelect() {
  const { lang, setLang, t } = useLanguage();
  return (
    <Select value={lang} onValueChange={(v) => v && setLang(v)}>
      <SelectTrigger aria-label={t('language')}>
        <Globe size={16} />
        <SelectValue>
          {
            (
              { en: 'English', es: 'Español', fr: 'Français' } as Record<
                string,
                string
              >
            )[lang]
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries({ en: 'English', es: 'Español', fr: 'Français' }).map(
          ([k, v]) => (
            <SelectItem key={k} value={k}>
              {v}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
