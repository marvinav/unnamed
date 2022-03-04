import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { rmdirSync, existsSync } from 'fs';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

if (existsSync('./dist')) {
    rmdirSync('./dist', { recursive: true });
}

const packageJSON = require('./package.json');

const extensions = ['.js', '.ts'];

const plugins = [external(), resolve(extensions), commonjs()];

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
    ],
};

export default esm;
