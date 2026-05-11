import i18next from "i18next";

export const applyLanguage = (lang: "fa" | "en") => {
  i18next.changeLanguage(lang);
};
