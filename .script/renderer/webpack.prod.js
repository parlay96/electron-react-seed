/*
 * @Author: pl
 * @Date: 2022-05-30 11:05:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 11:48:56
 * @Description: file content
 * @FilePath: \yp-electron\.script\renderer\webpack.prod.js
 */
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const utils = require('../utils')
const webpackConfig = require('./webpack.common')
const config = require('../../config')

const IsWeb = process.env.BABEL_ENV === 'web'

const optimizationConfig = IsWeb ? {
  splitChunks: {
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
  },
  runtimeChunk: { name: 'runtime' }
} : {}

// 发布路径，如果是桌面端publicPath不能配置，不然路径错误，文件引入失败项目启动不了
const output = IsWeb ? { publicPath : '/' } : {}

// 是否需要删除console， 如果打包后测试站需要调试，我们就不去掉console
const compress = config.IsBuildTools ? {} : {
  drop_console: true, // 去掉console
  drop_debugger: true, // 去掉debugger
}

module.exports = merge(webpackConfig, {
  mode: 'production',
  output: {
    ...output,
    path: IsWeb ? utils.resolve('dist/web'): utils.resolve('dist/electron'),//输出文件夹
    filename: utils.assetsPath('js/[name].[chunkhash:8].js'),//输出文件命名规则
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:8].js'), // 此选项决定了非初始（non-initial）chunk 文件的名称。
  },
  optimization: {
    minimize: true, // 插件压缩
    minimizer: [
      new TerserPlugin({ // 压缩js
        test: /\.js($|\?)/i,
        terserOptions: {
          compress: compress,
        },
        parallel:  true,
      }),
    ],
    ...optimizationConfig
  },
  // 不打包的模块过滤
  externals: [],
  plugins: [
    new WebpackBar({
      name: '正在编译，请稍等...',
      color: 'red'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: utils.resolve('static'),
          to: utils.resolve(`dist/${IsWeb ? 'web' : 'electron'}/static`),
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    })
  ]
})
