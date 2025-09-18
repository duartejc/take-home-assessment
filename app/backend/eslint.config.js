import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
      },
      globals: {
        process: 'writable',
        Buffer: 'writable',
        __dirname: 'writable',
        __filename: 'writable',
        console: 'writable',
        module: 'writable',
        require: 'writable',
        exports: 'writable',
        global: 'writable',
        jest: 'writable',
        describe: 'writable',
        test: 'writable',
        expect: 'writable',
        beforeEach: 'writable',
        afterEach: 'writable',
        beforeAll: 'writable',
        afterAll: 'writable',
        it: 'writable',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
      'import': importPlugin,
    },
    rules: {
      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_',
          'args': 'after-used',
          'argsIgnorePattern': '^_',
        },
      ],

      // Import order and organization
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'pathGroups': [
            {
              'pattern': '@/**',
              'group': 'internal',
              'position': 'before',
            },
          ],
          'pathGroupsExcludedImportTypes': ['builtin'],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true,
          },
        },
      ],

      // No relative imports (use absolute imports with @ alias)
      'import/no-relative-packages': 'error',
      'no-restricted-imports': [
        'error',
        {
          'patterns': [
            {
              'group': ['../*'],
              'message': 'Please use absolute imports with @ alias instead of relative imports.',
            },
          ],
        },
      ],

      // Additional import rules
      'import/no-unresolved': 'off', // Disabled because TypeScript handles this
      'import/named': 'off', // Disabled because TypeScript handles this better
      'import/namespace': 'off', // Disabled because TypeScript handles this better
      'import/default': 'off', // Disabled because TypeScript handles this better
      'import/export': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'warn',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'off', // Use unused-imports instead
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      
      // Additional recommended TypeScript rules
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'jest.config.js',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        process: 'writable',
        Buffer: 'writable',
        __dirname: 'writable',
        __filename: 'writable',
        console: 'writable',
        module: 'writable',
        require: 'writable',
        exports: 'writable',
        global: 'writable',
        jest: 'writable',
        describe: 'writable',
        test: 'writable',
        expect: 'writable',
        beforeEach: 'writable',
        afterEach: 'writable',
        beforeAll: 'writable',
        afterAll: 'writable',
        it: 'writable',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
];
