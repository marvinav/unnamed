// postcss.config.js
module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {},
        cssnano: {
            preset: 'default',
        },
    },
};
