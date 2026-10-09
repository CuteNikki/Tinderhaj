import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-plugin-react can't detect React's version under ESLint 10 (it calls
  // context.getFilename, which ESLint 10 removed) and crashes, so it's named here.
  { settings: { react: { version: '19.3' } } },
  // Leaving a field out by destructuring the rest, e.g. `const { id, ...data } = input`, isn't an unused variable.
  { rules: { '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }] } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
