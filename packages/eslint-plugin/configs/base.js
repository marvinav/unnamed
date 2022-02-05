module.exports = {
  plugins: ["@typescript-eslint", "import", "unicorn"],
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:unicorn/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
};
