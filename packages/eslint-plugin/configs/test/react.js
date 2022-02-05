module.exports = {
  plugins: ["jest", "testing-library"],
  extends: [
    "plugin:@marvinav/base",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
  ],
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};
