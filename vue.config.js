module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'assets/translations',
      enableInSFC: true
    }
  },
  chainWebpack: config => {
    config.resolve
      .symlinks(true)
    return config
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
