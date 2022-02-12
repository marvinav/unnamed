// postcss.config.js
module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-extend': {},
        'postcss-nested': {},
        'postcss-preset-env': {},
        cssnano: {
            preset: 'default',
        },
    },
};
