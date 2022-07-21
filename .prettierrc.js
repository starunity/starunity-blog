module.exports = {
  semi: false,
  singleQuote: true,
  arrowParens: "avoid",

  plugins: [require.resolve("prettier-plugin-astro")],

  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
