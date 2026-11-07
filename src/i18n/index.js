import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const locales = import.meta.glob("./translations/*.json", {
    eager: true,
    import: "default",
  });
  const messages = {};
  Object.entries(locales).forEach(([path, translations]) => {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i);
    if (matched && matched.length > 1) {
      messages[matched[1]] = translations;
    }
  });
  return messages;
}

const i18n = createI18n({
  locale: import.meta.env.VUE_APP_I18N_LOCALE || "fr",
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || "fr",
  silentTranslationWarn: import.meta.env.PROD,
  messages: loadLocaleMessages(),
});

export default i18n;
