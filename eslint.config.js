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
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { prettier: prettierRecommended },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
