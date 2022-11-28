const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development';
const load = !isDev ? MiniCssExtractPlugin.loader : 'style-loader'


const optimization = () => {
  const config = {};
  if (!isDev) {
    config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()]
  }
  return config
}


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  devtool: isDev ? 'inline-source-map' : 'source-map',
   optimization: optimization(), 
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 4200,
    hot: !isDev,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Puzzle Game',
      filename: './index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: load,
            options: {},
        }, 'css-loader', 'postcss-loader', 'sass-loader'],
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