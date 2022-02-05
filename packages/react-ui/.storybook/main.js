module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config, env) => {
    config.module.rules = config.module.rules.filter(
      (f) => f.test.toString() !== "/\\.css$/"
    );

    config.module.rules.push(
      {
        test: /(?<!global)\.css/i,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true } },
          "postcss-loader",
        ],
      },
      {
        test: /global\.css/i,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: false } },
          "postcss-loader",
        ],
      }
    );
    return config;
  },
};
