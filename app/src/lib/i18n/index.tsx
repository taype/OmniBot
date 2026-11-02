import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { zh } from "./zh";

/**
 * The interface language, in one place.
 *
 * Two rules make this small enough to grow screen by screen:
 *
 * 1. ENGLISH IS THE SOURCE AND THE KEY. `t("Ask anything")` looks the sentence up in the Chinese
 *    dictionary; a missing entry renders the English. An untranslated screen is therefore the old
 *    screen rather than a failure.
 * 2. THE CHOICE IS PER BROWSER, NOT PER ACCOUNT. Language is a reading preference of the person at
 *    this machine, and it has to work before anybody signs in. It is stored in `localStorage`, the
 *    same place the theme lives.
 */
export type Locale = "en" | "zh";

export const LOCALE_STORAGE_KEY = "omnibot.locale";

type Variables = Record<string, string | number>;

export type Translate = (english: string, variables?: Variables) => string;

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
};

const I18nContext = createContext<I18nValue | null>(null);

function storedLocale(): Locale | null {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return saved === "zh" || saved === "en" ? saved : null;
  } catch {
    return null;
  }
}

/** The browser's own preference, for a first visit that has not chosen yet. */
function browserLocale(): Locale {
  const languages =
    navigator.languages?.length && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  return languages.some((language) => language?.toLowerCase().startsWith("zh"))
    ? "zh"
    : "en";
}

export function initialLocale(): Locale {
  return storedLocale() ?? browserLocale();
}

function fill(template: string, variables?: Variables): string {
  if (!variables) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in variables ? String(variables[name]) : whole,
  );
}

export function translate(
  locale: Locale,
  english: string,
  variables?: Variables,
): string {
  const template =
    locale === "zh"
      ? ((zh as Record<string, string>)[english] ?? english)
      : english;
  return fill(template, variables);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleState(next);
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, next);
        } catch {
          // A browser that refuses storage still gets the language for this page load.
        }
      },
      t: (english, variables) => translate(locale, english, variables),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside an I18nProvider.");
  }
  return value;
}
