/* eslint-env node */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const developmentMode = process.env.NODE_ENV !== 'production';
const AssetsPlugin = require('assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const package = require('./package.json');
const webpack = require('webpack');

const isDevelopmentServer = process.env.WEBPACK_DEV_SERVE;
const isDevelopment = process.env.NODE_ENV !== 'production';

const publicPath = path.resolve(__dirname, 'dist/public');

/**
 * @type {import('webpack-dev-server').Configuration}
 */
var developmentServer = {
    devMiddleware: {
        writeToDisk: (path) => {
            return path.includes(publicPath);
        },
    },
    server: {
        type: 'https',
    },
    static: path.resolve(__dirname, 'dist/'),
    host: 'localhost',
    historyApiFallback: {
        disableDotRule: false,
    },
    hot: true,
    port: 4242,
};

/**
 * @type {import('webpack').Configuration}
 */
var config = {
    entry: [`./src/index`],
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['*/**', '*.*', '!plugins/**'] }),
        new MiniCssExtractPlugin({
            filename: developmentMode ? '[name].css' : 'static/styles/[chunkhash].css',
            chunkFilename: developmentMode ? '[id].css' : 'static/styles/[chunkhash].css',
        }),
        new HtmlWebpackPlugin({
            template: 'static/index.html',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: 'public',
                },
            ],
        }),
        /**Generate webpack-asset file with all static files url */
        new AssetsPlugin({
            useCompilerPath: true,
            includeManifest: true,
            keepInMemory: isDevelopmentServer,
            removeFullPathAutoPrefix: true,
        }),
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                // Загрузчик typescript
                test: /\.(tsx$|ts$|js$)/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, 'postcss.config.js'),
                            },
                        },
                    },
                ],
            },
            {
                // Загрузчик картинок
                test: /\.(png|svg|jpg|jpeg|gif|ttf|woff|woff2|eot|otf|json)$/,
                type: 'asset/resource',
                generator: {
                    filename: (m) => m.filename,
                },
            },
            {
                type: 'asset/source',
                resourceQuery: /raw/,
            },
            {
                type: 'asset/inline',
                resourceQuery: /inline/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    stats: {
        errorDetails: true,
    },
    output: {
        filename: '[name].[contenthash].bundle.js',
        chunkFilename: (path) => {
            // Place Service Worker in root scope
            if (path.chunk.name === 'service-worker') {
                return 'service-worker.chunk.js';
            }
            return `scripts/[name].[chunkhash].chunk.js`;
        },
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]', // map to source with absolute file path not webpack:// protocol
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: developmentServer,
};

module.exports = (environment, argv) => {
    config.mode = argv?.mode;
    config.devtool = argv?.mode === 'development' ? 'source-map' : false;
    config.plugins.push(
        new webpack.DefinePlugin({
            webpack_env: {
                SERVICE_WORKER: process.env.SERVICE_WORKER === 'true',
                MODE: JSON.stringify(config.mode),
                VERSION: JSON.stringify(package.version),
                GITHUB_AVATAR: JSON.stringify('https://avatars.githubusercontent.com/u/44019557'),
                CORE_PLUGIN_SOURCE: JSON.stringify('https://localhost:8080/plugins'),
                WEBPACK_ASSET: JSON.stringify('webpack-assets.json'),
            },
        }),
    );
    if (isDevelopment) {
        config.plugins.push(new ReactRefreshWebpackPlugin({}));
    }
    return config;
};
