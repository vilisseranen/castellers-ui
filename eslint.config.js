import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierRecommended from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["dist/**", "dev-dist/**"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  prettierConfig,
  {
    files: ["**/*.{js,vue}"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    plugins: { prettier: prettierRecommended },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    // App code runs in the browser: flag leftover Node/webpack globals such as process or require.
    files: ["src/**/*.{js,vue}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["*.config.js"],
    languageOptions: { globals: globals.node },
  },
];
