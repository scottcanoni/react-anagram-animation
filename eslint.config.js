import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

// Flat config. The migration was forced rather than chosen: deleting
// babel.config.json broke @babel/eslint-parser, and flat config's default
// espree parses JSX natively, so the parser dependency could go too. The repo
// now contains no Babel at all.
export default [
    {
        ignores: ['dist/**', 'demo-build/**', 'coverage/**'],
    },
    {
        settings: {
            react: { version: 'detect' },
        },
    },
    js.configs.recommended,
    react.configs.flat.recommended,
    reactHooks.configs['recommended-latest'],
    jsxA11y.flatConfigs.recommended,
    {
        // Build/tooling config at the repo root is not application code, so it
        // gets correctness rules but not the stylistic ones below.
        files: ['*.config.js'],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
    {
        files: ['src/**/*.{js,jsx}'],
        plugins: { import: importPlugin },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            indent: ['warn', 4],
            'react/jsx-indent': ['warn', 4],
            'react/jsx-indent-props': ['warn', 4],
            quotes: [0, 'double', { avoidEscape: true }],
            'quote-props': ['error', 'as-needed'],
            'jsx-quotes': [2, 'prefer-double'],
            'no-undef': 2,
            'id-length': 0,
            'max-len': 0,
            'brace-style': [1, 'stroustrup', { allowSingleLine: true }],
            curly: 2,
            'no-use-before-define': [1, 'nofunc'],
            'no-unused-vars': [1, { args: 'none', ignoreRestSiblings: true }],
            'arrow-body-style': 0,
            'no-unused-expressions': [2, { allowShortCircuit: true }],
            'object-curly-spacing': ['warn', 'always', { objectsInObjects: true }],
            'object-curly-newline': ['warn', { multiline: true }],
            'prefer-const': 'warn',
            'no-restricted-syntax': [1, 'WithStatement', 'DebuggerStatement'],
            'no-underscore-dangle': 0,
            'react/jsx-boolean-value': 0,
            'react/jsx-first-prop-new-line': 0,
            'react/jsx-no-bind': 0,
            'react/no-did-mount-set-state': 0,
            'react/prefer-stateless-function': 0,
            'react/jsx-one-expression-per-line': [0],
            'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
            'react/jsx-props-no-spreading': 0,
            'react/no-array-index-key': 1,
            'react/destructuring-assignment': 'off',
            'react/jsx-fragments': 'off',
            'import/prefer-default-export': 0,
            'jsx-a11y/anchor-is-valid': ['off', { aspects: ['invalidHref'] }],
        },
    },
    {
        // The published bundle has no `process`: it is browser ESM, and Vite
        // library builds can leak `process.env.NODE_ENV` into output. Keep the
        // library source free of it so that can never happen.
        files: ['src/lib/**/*.{js,jsx}'],
        rules: {
            'no-restricted-properties': [
                2,
                {
                    object: 'process',
                    property: 'env',
                    message: 'process.env must not appear in published library code; there is no process in browser ESM.',
                },
            ],
            'no-console': [1, { allow: ['error'] }],
        },
    },
];
