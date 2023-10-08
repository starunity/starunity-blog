/** @type {import("prettier").Config} */
export default {
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',

  plugins: ['prettier-plugin-astro'],

  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
