const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/boot.js',
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
    publicPath: '/',
    chunkFilename: '[id].chunk.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      },
    }],
  },
};
