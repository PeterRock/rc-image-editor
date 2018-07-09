const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        index: './src/index.js'
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "dist"),
        libraryTarget: 'commonjs2'
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
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
}
