import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));
process.env.VUE_APP_VERSION = version;

export default defineConfig({
  // Keep the VUE_APP_ prefix used by the deployment (e.g. VUE_APP_API_URL).
  envPrefix: ["VITE_", "VUE_APP_"],

  css: {
    // @oruga-ui/theme-bulma 0.2 ships a few invalid selectors (e.g. ".check:before:hover").
    // Drop them when minifying instead of failing the build.
    lightningcss: { errorRecovery: true },
  },

  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },

  define: {
    // vue-i18n esm-bundler flags: the app uses the legacy API ($t, $i18n.locale).
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },

  plugins: [
    vue(),
    VitePWA({
      // Same file names as the former Vue CLI PWA plugin, so already installed
      // service workers update in place.
      filename: "service-worker.js",
      manifestFilename: "manifest.json",
      // Registration is done in src/registerServiceWorker.js.
      injectRegister: false,
      // Icons are already precached through workbox.globPatterns.
      includeManifestIcons: false,
      registerType: "autoUpdate",
      manifest: {
        name: "Castellers de Montréal",
        short_name: "castellers",
        description:
          "Organiser les pratiques et présentations des castellers de Montréal",
        theme_color: "#e0dac5",
        background_color: "#000000",
        display: "standalone",
        start_url: "/events",
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
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
        // Never serve API calls from the cache or rewrite them to index.html.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],

  server: {
    proxy: {
      "^/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
