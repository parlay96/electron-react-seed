/*
 * @Author: pl
 * @Date: 2022-05-30 17:00:57
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 17:08:31
 * @Description: 模块依赖
 * @FilePath: \yp-electron\.script\renderer\module-federation.js
 */
// https://webpack.docschina.org/plugins/module-federation-plugin
const { ModuleFederationPlugin } = require('webpack').container
const deps = require('../../package.json').dependencies

// 模块联邦在这里配置
module.exports = [
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
]
