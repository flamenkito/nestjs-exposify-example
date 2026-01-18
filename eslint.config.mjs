// @ts-check
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import sonarjs from 'eslint-plugin-sonarjs';
import path from 'node:path';
import tseslint from 'typescript-eslint';
const { flatConfigs: importFlatConfigs } = importPlugin;

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
    'prefer-relative-imports': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prefer ./ or ../ imports over ~/ when target is nearby',
        },
        fixable: 'code',
        schema: [],
      },
      create(context) {
        const filename = context.filename || context.getFilename();
        const fileDir = path.dirname(filename);

        // Find the src directory by looking for it in the path
        const srcMatch = fileDir.match(/^(.+?\/src)(\/|$)/);
        if (!srcMatch) return {};

        const srcDir = srcMatch[1];

        return {
          ImportDeclaration(node) {
            const importPath = node.source.value;
            if (typeof importPath !== 'string' || !importPath.startsWith('~/')) return;

            // Convert ~/ path to absolute path
            const relativePart = importPath.slice(2); // Remove ~/
            const absoluteTarget = path.join(srcDir, relativePart);

            // Calculate relative path from current file to target
            let relativePath = path.relative(fileDir, absoluteTarget);

            // Normalize to use forward slashes
            relativePath = relativePath.replace(/\\/g, '/');

            // Add ./ prefix if needed
            if (!relativePath.startsWith('.')) {
              relativePath = './' + relativePath;
            }

            // Check if it's a simple relative path (./ or ../ but not ../../)
            const isSimpleRelative =
              relativePath.startsWith('./') || (relativePath.startsWith('../') && !relativePath.startsWith('../../'));

            if (isSimpleRelative) {
              context.report({
                node: node.source,
                message: `Use relative import '${relativePath}' instead of '${importPath}'.`,
                fix(fixer) {
                  return fixer.replaceText(node.source, `'${relativePath}'`);
                },
              });
            }
          },
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
    ...importFlatConfigs.typescript,
    plugins: {
      ...importFlatConfigs.typescript.plugins,
      custom: customRulesPlugin,
    },
    rules: {
      ...importFlatConfigs.typescript.rules,
      'complexity': 'error',
      'sonarjs/cognitive-complexity': 'error',
      'sonarjs/function-return-type': 'off',
      'sonarjs/void-use': 'off',
      'import/no-unresolved': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*', '../../../*', '../../../../*'],
              message: 'Use path alias ~/ instead of deep relative imports.',
            },
          ],
        },
      ],
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
      'custom/prefer-relative-imports': 'error',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
