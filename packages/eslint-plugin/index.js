/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('./configs/base');
const react = require('./configs/react');
const recommended = require('./configs/recommended');
const testJest = require('./configs/test/jest');
const testReact = require('./configs/test/react');
const prettier = require('./configs/prettier');

module.exports = {
    configs: {
        base,
        react,
        recommended,
        'test:jest': testJest,
        'test:react': testReact,
        prettier,
    },
};
