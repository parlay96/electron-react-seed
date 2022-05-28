/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: pl
 * @LastEditTime: 2022-05-28 19:01:48
 * @Description: 渲染进程配置
 */
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container

const deps = require('../package.json').dependencies
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
    extensions: ['.tsx', ".js", '.ts', '.json', '.scss', '.css']
  },
  target: IsWeb ? 'web' : 'electron-renderer',
  externals: [],
  module: {
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
      }
    }),
    new WebpackBar({
      name: '正在编译，请稍等...',
      color: 'red'
    }),
    new ModuleFederationPlugin({
      name: 'electron',
      filename: 'remoteEntry.js',
      remotes: {
        pc: `pc@http://localhost:3000/remoteEntry.js`,
      },
      shared: [
        {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
        },
      ],
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
    minimize: true, // 插件压缩
    minimizer: [
      new TerserPlugin({ // 压缩js
        test: /\.js($|\?)/i,
        terserOptions: {
          compress: {
            drop_console: true, // 去掉console
            drop_debugger: true, // 去掉debugger
          },
        },
        parallel:  true,
      }),
    ]
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
  rendererConfig.cache = {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  rendererConfig.devtool = 'eval-source-map'
}

module.exports = rendererConfig
