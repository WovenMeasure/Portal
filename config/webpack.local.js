var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const ConfigPlugin = require('config-webpack-plugin')
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');


const ENV = process.env.NODE_ENV = process.env.ENV = 'local';

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.NormalModuleReplacementPlugin(/environment\.ts/, './environment-local.ts')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    } 
});
