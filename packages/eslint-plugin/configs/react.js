module.exports = {
  plugins: ["react", "react-hooks", "jsx-a11y"],
  extends: [
    "plugin:@marvinav/base",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  rules: {
    "react/prop-types": ["off"],
  },
};
