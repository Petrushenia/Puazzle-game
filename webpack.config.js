const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production';
const styleHandler = isProd ? MiniCssExtractPlugin.loader : 'style-loader';


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  devtool: isProd ? 'source-map' : 'inline-source-map',
  entry: './index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 4200,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Puzzle Game',
      filename: './index.html'
    }),

    new MiniCssExtractPlugin(),

    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [styleHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(?:ico|png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?.eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      }
    ]
  }
}