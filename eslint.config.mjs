import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "next-env.d.ts",
      "**/*.js",
      "**/*.d.ts",
      "**/*.map",
      "**/*.tsbuildinfo",
    ],
    rules: {
      // Allow unused variables that start with underscore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Allow require() imports in generated files
      "@typescript-eslint/no-require-imports": "off",
      // Allow unused expressions in generated files
      "@typescript-eslint/no-unused-expressions": "off",
      // Allow empty object types in generated files
      "@typescript-eslint/no-empty-object-type": "off",
      // Allow explicit any in generated files
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unsafe function types in generated files
      "@typescript-eslint/no-unsafe-function-type": "off",
      // Allow wrapper object types in generated files
      "@typescript-eslint/no-wrapper-object-types": "off",
      // Allow @ts-ignore comments in generated files
      "@typescript-eslint/ban-ts-comment": "off",
      // Allow triple slash references in generated files
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];

export default eslintConfig;
