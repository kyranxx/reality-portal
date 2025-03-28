import nextPlugin from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Base config extending Next.js recommended configs
  {
    ...nextPlugin,
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "public/**",
      "build/**",
      "dist/**"
    ]
  },
  // React specific rules
  {
    plugins: {
      react: require('eslint-plugin-react')
    },
    rules: {
      // Enforce proper use of 'use client' directive
      "react/function-component-definition": [
        "warn",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function"
        }
      ],
      // Prevent server components being marked as client components
      "react/no-unknown-property": [
        "error",
        {
          ignore: ["jsx", "global"]
        }
      ]
    }
  },
  // Client components rules
  {
    files: [
      "src/client/**/*.{js,ts,jsx,tsx}", 
      "src/**/Client*.{js,ts,jsx,tsx}",
      "src/app/_client-*.{js,ts,jsx,tsx}",
      "src/app/error.tsx",
      "src/app/global-error.tsx",
      "src/app/ClientWrapper.tsx"
    ],
    rules: {
      // Ensure all client components have 'use client' directive
      "react/no-unknown-property": "off"
    }
  },
  // Server components rules
  {
    files: ["src/app/**/*.{js,ts,jsx,tsx}", "src/components/**/*.{js,ts,jsx,tsx}"],
    ignores: [
      "src/**/Client*.{js,ts,jsx,tsx}",
      "src/app/_client-*.{js,ts,jsx,tsx}",
      "src/app/error.tsx",
      "src/app/global-error.tsx",
      "src/app/ClientWrapper.tsx"
    ],
    rules: {
      // Server components shouldn't use client hooks/APIs
      "react/react-in-jsx-scope": "off"
    }
  },
  // Modern configuration options
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error"
    }
  }
];
