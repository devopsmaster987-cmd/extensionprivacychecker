import { defaultLocale, locales, type Locale } from "./config";
import { en, type MessageKey, type Messages } from "./messages/en";
import { es } from "./messages/es";
import { fr } from "./messages/fr";
import { de } from "./messages/de";
import { it } from "./messages/it";
import { pt } from "./messages/pt";
import { nl } from "./messages/nl";
import { pl } from "./messages/pl";
import { tr } from "./messages/tr";
import { ar } from "./messages/ar";
import { ur } from "./messages/ur";
import { hi } from "./messages/hi";

const dictionaries: Record<Locale, Partial<Messages>> = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  nl,
  pl,
  tr,
  ar,
  ur,
  hi,
};

export function getMessages(locale: Locale): Messages {
  if (locale === defaultLocale) return en;
  return { ...en, ...dictionaries[locale] };
}

export type Translator = (key: MessageKey, vars?: Record<string, string | number>) => string;

export function createTranslator(locale: Locale): Translator {
  const messages = getMessages(locale);
  return (key, vars) => {
    let value = messages[key] ?? en[key] ?? String(key);
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
    }
    return value;
  };
}

export { locales, defaultLocale } from "./config";
export type { Locale, MessageKey, Messages };
