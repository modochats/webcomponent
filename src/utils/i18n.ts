import i18next from "i18next";
import {i18nextInitPromise} from "../../i18n/config.js";

export const applyLanguage = async (lang: "fa" | "en") => {
  await i18nextInitPromise;
  return i18next.changeLanguage(lang);
};
