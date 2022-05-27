
/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-27 11:41:23
 * @Description: 本地运行脚本
 */

// 当前环境
process.env.NODE_ENV = 'development'

const electron = require('electron')
const chalk = require('chalk')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')
const portFinder = require("portfinder")

const { logStats, greeting } = require('./utils')
const config = require('../config')
const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

// 过滤监听文件
const ignoredCatalogue = ['**/.build/*.js', '**/config/*.js', '**/node_modules']
// 桌面进程
let electronProcess = null
// 重新启动的标识
let manualRestart = false
// 热重载
let hotMiddleware

// 执行渲染进程
function startRenderer() {
  return new Promise((resolve, reject) => {
    rendererConfig.mode = 'development'
    portFinder.basePort = config.dev.port
    // 获取一个可用的端口
    portFinder.getPort((err, port) => {
      if (err) {
        reject("------------portError:" + err)
      } else {
        const compiler = webpack(rendererConfig)
        // 热重载
        hotMiddleware = webpackHotMiddleware(compiler, {
          log: false, // 日志
          heartbeat: 2500 // 多久向客户端发送一次心跳更新以保持连接处于活动状态
        })
        // https://webpack.docschina.org/api/compiler-hooks/#afteremit
        // 输出到 output 目录之后执行钩子
        compiler.hooks.afterEmit.tap('afterEmit', (stats) => {
          // 发送通知出发webpack 热模块重新加载。
          hotMiddleware.publish({
            action: 'reload'
          })
        })
        // compilation 创建之后执行。
        compiler.hooks.done.tap('done', stats => {
          logStats('渲染进程正在编译', stats)
        })
        // 创建服务
        const server = new WebpackDevServer(
          { port },
          compiler
        )
        // 挂载端口,开发环境很重要
        process.env.PORT = port
        // 启动服务
        server.start().then(() => {
          resolve()
        })
      }
    })
  })
}

// 主进程
function startMain() {
  return new Promise((resolve) => {
    mainConfig.mode = 'development'
    const compiler = webpack(mainConfig)
    // watchRun在监听模式下，一个新的 compilation 触发之后，但在 compilation 实际开始之前执行
    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      logStats(`主进程`, chalk.white.bold(`正在处理资源文件...'`))
      // 热重载渲染进程
      hotMiddleware.publish({
        action: 'compiling'
      })
      done()
    })
    // 设置监听
    compiler.watch({
      ignored: ignoredCatalogue,
      poll: undefined, // 进行轮询
    }, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }
      logStats(`主进程正在编译`, stats)
      // 如何已经创建
      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        // 进程标识
        process.kill(electronProcess.pid)
        electronProcess = null
        // 主进程更新，重新启动应用
        startElectron()
        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }
      resolve()
    })
  })
}

// 启动应用
function startElectron() {
  var args = [
    '--inspect=5858', // https://nodejs.org/zh-cn/docs/guides/debugging-getting-started/
    path.join(__dirname, '../dist/electron/main.js')
  ]
  // http://nodejs.cn/api/child_process.html#child-process
  // 创建进程 启动electron
  electronProcess = spawn(electron, args)
  // 传给回调的 stdout 和 stderr 参数将包含子进程的标准输出和标准错误的输出
  electronProcess.stdout.on('data', data => {
    electronLog(data.toString().split(/\r?\n/), 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data.toString().split(/\r?\n/), 'red')
  })
  // 进程关闭
  electronProcess.on('close', () => {
    // 退出进程
    if (!manualRestart) process.exit()
  })
}

/** 主程序日志 */
function electronLog(data, color) {
  if (data) {
    let log = ''
    data.forEach(line => { log += `  ${line}\n` })
    console.log(
      chalk[color].bold(`主程序日志-------------------`) +
      '\n' +
      log
    )
  }
}

async function init() {
  console.log(chalk.blue.bgRed(` 准备编译...`))
  try {
    await startRenderer()
    await startMain()
    startElectron()
  } catch (error) {
    console.error(error)
  }
}

init()
