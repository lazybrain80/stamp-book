import "server-only";

import type { Locale } from "~/config/i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () =>
    import("~/config/dictionaries/en.json").then((module) => module.default),
  ko: () =>
    import("~/config/dictionaries/ko.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();

export const getDictionarySync = (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
