import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { rmdirSync, existsSync } from 'fs';
import { sync } from 'glob';
import del from 'rollup-plugin-delete';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

if (existsSync('./dist')) {
    rmdirSync('./dist', { recursive: true });
}

const packageJSON = require('./package.json');

const extensions = ['.jsx', '.js', '.tsx', '.ts'];

const plugins = [external(), resolve(extensions), json(), commonjs()];

const styles = sync('./src/components/*/index.tsx').reduce((acc, path) => {
    const entry = path.replace('/index.tsx', '').replace('./src/', '');
    acc.push({
        input: path,
        output: [
            {
                file: `dist/styles/${entry}.js`,
            },
        ],
        plugins: [
            ...plugins,
            typescript({
                typescript: require('typescript'),
                useTsconfigDeclarationDir: true,
            }),
            postcss({
                extract: true,
                modules: true,
                sourceMap: true,
            }),
        ],
    });
    return acc;
}, []);

const esm = {
    input: './src/index.ts',
    output: [
        {
            file: packageJSON.module,
            format: 'esm',
            sourcemap: true,
        },
        {
            file: packageJSON.main,
            format: 'cjs',
            sourcemap: true,
        },
    ],
    plugins: [
        ...plugins,
        typescript({
            typescript: require('typescript'),
            useTsconfigDeclarationDir: true,
        }),
        babel({
            extensions,
            babelHelpers: 'runtime',
            plugins: ['@babel/plugin-transform-runtime'],
        }),
        terser(),
        postcss({
            extract: 'styles/bundle.css',
            modules: true,
            sourceMap: true,
        }),
        del({
            onlyFiles: true,
            targets: 'dist/styles/*/**.js',
            hook: 'buildEnd',
        }),
    ],
};

export default [...styles, esm];
