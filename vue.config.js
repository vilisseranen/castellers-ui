module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "en",
      localeDir: "assets/translations",
      enableInSFC: true
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true);
    return config;
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  },
  pwa: {
    name: "Castellers de Montréal",
    themeColor: "#e0dac5",
    msTileColor: "#e0dac5",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      short_name: "castellers",
      start_url: "/login",
      description:
        "Organiser les pratiques et présentations des castellers de Montréal",
      dir: "ltr",
      scope: "/"
    },
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/mstile-150x150.png"
    },
    // configure the workbox plugin
    workboxPluginMode: "GenerateSW"
  }
};
