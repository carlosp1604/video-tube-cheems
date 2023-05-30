const SEVERITY_OFF = 0
const SEVERITY_ERROR = 2

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'unused-imports',
  ],
  extends: [
    'standard',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@dword-design/import-alias/recommended',
  ],
  // add your custom rules here
  rules: {
    'padding-line-between-statements': [
      SEVERITY_ERROR,
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'always', prev: ['let', 'const', 'var'], next: '*' },
      { blankLine: 'any', prev: ['let', 'const', 'var'], next: ['let', 'const', 'var'] },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'comma-dangle': [
      SEVERITY_ERROR,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'max-len': [
      SEVERITY_ERROR,
      {
        code: 120,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': [
      SEVERITY_ERROR,
      'interface',
    ],
    '@typescript-eslint/naming-convention': [
      SEVERITY_ERROR,
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'react/jsx-curly-spacing': [
      SEVERITY_ERROR,
      {
        when: 'always',
        children: true,
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      SEVERITY_ERROR,
      {
        multiline: {
          delimiter: 'none',
        },
      },
    ],
    '@next/next/no-img-element': [
      SEVERITY_OFF,
    ],
    'prefer-arrow-callback': [
      SEVERITY_ERROR,
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'react/jsx-wrap-multilines': SEVERITY_ERROR,
  },
}
