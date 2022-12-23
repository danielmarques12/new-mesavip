/** @type {import("prettier").Config} */
module.exports = {
  importOrder: ['^components/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  arrowParens: 'always',
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  trailingComma: 'all',
  tabWidth: 2,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindConfig: './packages/config/tailwind',
  pluginSearchDirs: false,
}
