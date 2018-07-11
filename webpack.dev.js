const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const vConsolePlugin = require('vconsole-webpack-plugin');

module.exports = {
    mode: 'development',

    context: path.resolve(__dirname, 'example/src'),
    entry: {
        app: './app.js',
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'example/src'),
        host: '0.0.0.0',
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
        new vConsolePlugin({
            enable: true,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: false,
            template: path.resolve(__dirname, 'example/src/index.html')
        }),
    ]
}
