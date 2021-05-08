process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "en",
      localeDir: "assets/translations",
      enableInSFC: true,
    },
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
    return config;
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  pwa: {
    name: "Castellers de Montréal",
    themeColor: "#e0dac5",
    msTileColor: "#e0dac5",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      short_name: "castellers",
      start_url: "/events",
      description:
        "Organiser les pratiques et présentations des castellers de Montréal",
      dir: "ltr",
      scope: "/",
      icons: [
        {
          src: "static/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "static/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "static/icons/android-chrome-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "static/icons/android-chrome-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    iconPaths: {
      favicon32: "static/icons/favicon-32x32.png",
      favicon16: "static/icons/favicon-16x16.png",
      appleTouchIcon: "static/icons/apple-touch-icon.png",
      maskIcon: "static/icons/safari-pinned-tab.svg",
      msTileImage: "static/icons/mstile-150x150.png",
    },
    // configure the workbox plugin
    workboxPluginMode: "GenerateSW",
  },
};
