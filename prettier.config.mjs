/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 110,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
