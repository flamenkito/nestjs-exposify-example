// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

// Custom plugin for warn-level restricted syntax patterns
const customRulesPlugin = {
  rules: {
    'no-explicit-null-undefined': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Warn against explicit null/undefined in type definitions',
        },
        schema: [],
      },
      create(context) {
        function checkUnionType(node) {
          if (node.parent?.type !== 'TSUnionType') return;

          const isInPropertySignature =
            node.parent.parent?.type === 'TSTypeAnnotation' &&
            (node.parent.parent.parent?.type === 'TSPropertySignature' ||
              node.parent.parent.parent?.type === 'TSMethodSignature');

          if (!isInPropertySignature) return;

          const typeKeyword = node.type === 'TSNullKeyword' ? 'null' : 'undefined';
          context.report({
            node,
            message: `Explicit ${typeKeyword} is dangerous. Only use when the value cannot be guaranteed otherwise.`,
          });
        }

        return {
          TSNullKeyword: checkUnionType,
          TSUndefinedKeyword: checkUnionType,
        };
      },
    },
    'no-fallback-defaults': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Warn against fallback default patterns like ?? 0 or || []',
        },
        schema: [],
      },
      create(context) {
        function checkLogicalExpression(node) {
          if (node.operator !== '||' && node.operator !== '??') return;

          const right = node.right;
          let message = null;

          if (right.type === 'Literal' && right.value === 0) {
            message = `Avoid "${node.operator} 0" fallback. Handle undefined explicitly.`;
          } else if (right.type === 'Literal' && right.value === '') {
            message = `Avoid "${node.operator} ''" fallback. Handle undefined explicitly.`;
          } else if (right.type === 'ArrayExpression' && right.elements.length === 0) {
            message = `Avoid "${node.operator} []" fallback. Handle undefined explicitly.`;
          } else if (right.type === 'ObjectExpression' && right.properties.length === 0) {
            message = `Avoid "${node.operator} {}" fallback. Handle undefined explicitly.`;
          }

          if (message) {
            context.report({ node, message });
          }
        }

        return {
          LogicalExpression: checkLogicalExpression,
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/node_modules/**',
      '**/coverage',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/__mocks__/**',
      '**/eslint.config.mjs',
      '**/generated/**',
      '**/.angular/cache/**',
      '**/vite.config.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  sonarjs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      custom: customRulesPlugin,
    },
    rules: {
      complexity: 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/void-use': 'off',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/newline-after-import': ['error', { count: 1 }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],
      'no-else-return': ['error', { allowElseIf: true }],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSPropertySignature[optional=true]',
          message: 'Optional properties (?) are not allowed. Properties must be required.',
        },
        {
          selector: 'TSMethodSignature[optional=true]',
          message: 'Optional methods (?) are not allowed. Methods must be required.',
        },
      ],
      'custom/no-explicit-null-undefined': 'warn',
      'custom/no-fallback-defaults': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
