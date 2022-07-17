const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'images/[hash][ext][query]', // Defines path for static files
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], //Check happens from right to left
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource', // Feature introduced in webpack v5
      },
      {
        test: /\.(woff(2)?|eot|tff|otf|svg|)$/,
        type: 'asset/inline', // Feature introduced in webpack v5
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Cleans the previous build
    new HtmlWebpackPlugin({
      inject: true,
      favicon: path.resolve(__dirname, '..', './public/favicon.ico'),
      template: path.resolve(__dirname, '..', './public/index.html'),
    }),
  ],
  stats: 'errors-only', // Surpresses warning
}
