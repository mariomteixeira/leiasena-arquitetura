import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { files: ["**/*.jsonc"], plugins: { json: json as unknown as Record<string, unknown> }, language: "json/jsonc" },
  { files: ["**/*.md"], plugins: { markdown: markdown as unknown as Record<string, unknown> }, language: "markdown/gfm" },
]);
