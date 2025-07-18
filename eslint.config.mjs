import { defineConfig } from "eslint/config"
import prettier from "eslint-plugin-prettier"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:prettier/recommended"
    ),

    plugins: {
      prettier,
    },

    rules: {
      "prettier/prettier": "error",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      indent: ["error", 2],
      "no-unused-vars": "warn",
      "react/jsx-no-literals": "error",
    },
  },
])
