export const i18n = {
  defaultLocale: "ko",
  locales: ["en", "ko"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

// 新增的映射对象
export const localeMap = {
  en: "English",
  ko: "한국어",
} as const;
