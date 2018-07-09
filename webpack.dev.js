const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    context: path.resolve(__dirname, 'example/src'),
    entry: {
        app: './app.js',
    },
    output: {
        path: path.resolve(__dirname, 'example/dist'),
        filename: '[name].js',
        publicPath: '/',
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'example/src'),
        host: 'localhost',
        port: 8001,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['example/src/dist']),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: false,
            template: path.resolve(__dirname, 'example/src/index.html')
        }),
    ]
}
