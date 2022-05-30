/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 16:30:50
 * @Description: 打包脚本
 */
const webpack = require('webpack')
const chalk = require('chalk')
const Multispinner = require('multispinner')

const { greeting, clean } = require('./utils')
const mainConfig = require('./main/webpack.prod')
const rendererConfig = require('./renderer/webpack.prod')

// 包裹
function pack(config) {
  return new Promise((resolve, reject) => {
    // https://webpack.docschina.org/api/node#webpack
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  })
}

// 打包
async function build() {
  await greeting()
  await clean('electron')

  const tasks = ['main', 'renderer']
  // https://www.npmjs.com/package/multispinner
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  })
  let results = ''
  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results}`)
    console.log(`${chalk.yellow.bgRed('---------------编译完成, 开始electron-builder输出产物, 请耐心等待---------------')}\n`)
    // 结束之前编译的进程，
    process.exit()
  })

  pack(mainConfig).then(result => {
    results += result + '\n\n'
    m.success('main')
  }).catch(err => {
    m.error('main')
    console.error(`\n${err}\n`)
    process.exit(1)
  })

  pack(rendererConfig).then(result => {
    results += result + '\n\n'
    m.success('renderer')
  }).catch(err => {
    m.error('renderer')
    console.error(`\n${err}\n`)
    process.exit(1)
  })
}

build()
