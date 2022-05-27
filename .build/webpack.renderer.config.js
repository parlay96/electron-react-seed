/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-27 11:46:27
 * @Description: 渲染进程配置
 */
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const scssLoader = require('./scss-loader')
const utils = require('./utils')

const IsWeb = process.env.BUILD_TARGET === 'web'
process.env.BABEL_ENV = IsWeb ? 'web' : 'renderer'

let rendererConfig = {
  infrastructureLogging: { level: 'warn' },
  entry: {
    renderer: utils.resolve('src/renderer/index.tsx')
  },
  output: {
    path: IsWeb ? path.join(__dirname, '../dist/web') : path.join(__dirname, '../dist/electron'),//输出文件夹
    filename: utils.assetsPath('js/[name].[chunkhash:8].js'),//输出文件命名规则
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:8].js'), // 此选项决定了非初始（non-initial）chunk 文件的名称。
  },
  resolve: {
    alias: {
      '@': utils.resolve('src/renderer'),
    },
    extensions: ['.tsx', ".js", '.ts', '.json', '.less', '.css', '.node']
  },
  // https://webpack.docschina.org/configuration/target/
  target: IsWeb ? 'web' : 'electron-renderer',
  externals: [],
  module: {
    // https://webpack.docschina.org/configuration/module/#rulegenerator
    rules: [
      ...scssLoader,
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: 'imgs/[name]--[hash].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: 'media/[name]--[hash].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: 'fonts/[name]--[hash].[ext]'
        }
      },
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          IsWeb ?
          // esbuild-loader打包速度快，但是在web上可能有些浏览器不兼容
          { loader: 'babel-loader', options: { cacheDirectory: true } }
          :
          { loader: 'esbuild-loader', options: { loader: 'tsx' } }
        ]
      }
    ]
  },
  // https://webpack.docschina.org/configuration/node/#node__filename
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[chunkhash:8].css'),
      chunkFilename: utils.assetsPath('css/[id].[chunkhash:8].css')
    }),
    new webpack.DefinePlugin({
      'process.env.IS_WEB': IsWeb,
      'process.env.NODE_ENV': process.env.NODE_ENV !== 'production' ? '"development"' : '"production"',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.resolve('src/index.html'),
      minify: {
        removeComments: true,//移除注释
        collapseWhitespace: true, //合并多余空格
        removeAttributeQuotes: true//移除分号
        // 更多选项请参见:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),
    new WebpackBar({
      name: '正在编译，请稍等...',
      color: 'red'
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

if (process.env.NODE_ENV === 'production') {
  rendererConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, `../dist/${IsWeb ? 'web' : 'electron'}/static`),
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    }),
  )
  rendererConfig.optimization = {
    minimizer: []
  }
  if (IsWeb) {
    rendererConfig.optimization.splitChunks = {
      chunks: "async",
      cacheGroups: {
        vendor: { // 将第三方模块提取出来
          minSize: 30000,
          minChunks: 1,
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 1
        },
        commons: {
          test: /[\\/]src[\\/]utils[\\/]/,
          name: 'commons',
          minSize: 30000,
          minChunks: 3,
          chunks: 'initial',
          priority: -1,
          reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
        }
      }
    }
    rendererConfig.optimization.runtimeChunk = { name: 'runtime' }
  }
} else {
  // https://webpack.docschina.org/configuration/devtool/#root
  rendererConfig.devtool = 'eval-source-map'
}

module.exports = rendererConfig
