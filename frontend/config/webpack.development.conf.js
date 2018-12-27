const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const devPort = 8080
const apiPort = 8000

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader?name=fonts/[name]-[hash].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: 'file-loader?name=images/[name]-[hash].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      CONFIG: {
        BASE_PATH: JSON.stringify('')
      },
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  devServer: {
    port: devPort,
    proxy: {
      '/api': `http://localhost:${apiPort}`
    },
    historyApiFallback: true
  },
  devtool: 'source-map'
}
