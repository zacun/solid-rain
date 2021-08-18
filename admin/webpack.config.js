// Generated using webpack-cli http://github.com/webpack-cli
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

dev = process.env.NODE_ENV === "development";
const apiPath = {
    development: JSON.stringify('http://localhost:3376'),
    production: JSON.stringify('https://******/game/api')
};

console.log("dev =", dev);

let config = {
    mode: dev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../api/public'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            scriptLoading: 'blocking'
        }),
        new webpack.DefinePlugin({
            'apiPath': dev ? apiPath.development : apiPath.production
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new ESLintPlugin()
    ],
    module: {
        rules: [
            {
                test: /\\.(js|jsx)$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
                type: 'asset'
            }
        ]
    },
};

if (dev) config.devtool = "eval-cheap-module-source-map";

module.exports = config;