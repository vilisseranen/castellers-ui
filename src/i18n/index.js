import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const locales = require.context(
    "./translations",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const i18n = createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "fr",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "fr",
  silentTranslationWarn: process.env.NODE_ENV === "production",
  messages: loadLocaleMessages(),
});

export default i18n;
