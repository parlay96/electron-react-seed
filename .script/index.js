
/*
 * @Author: pl
 * @Date: 2022-05-30 09:55:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-21 11:13:47
 * @Description: file content
 * @FilePath: \yp-electron\.script\index.js
 */
const { spawn } = require('cross-spawn')
const path = require('path')

const { argv } = process

// 表示启动dev electron
if (argv.includes('--dev') && argv.includes('--electron')) {
  spawn('node', [path.join(__dirname, './dev-electron.js')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BABEL_ENV: 'electron',
      NODE_ENV: 'development'
    }
  })
}

// 表示启动dev web
if (argv.includes('--dev') && argv.includes('--web')) {
  spawn('node', [path.join(__dirname, './dev-web.js')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BABEL_ENV: 'web',
      NODE_ENV: 'development'
    }
  })
}

// 打包electron
if (argv.includes('--build') && argv.includes('--electron')) {
  // 截取--electron
  let flgeIndex = argv.findIndex(item => item == '--electron')
  // 打包electron的命令
  let electronBuilderScripts = `electron-builder ${argv.slice(flgeIndex + 1).join(' ')}`
  const buildElectron = spawn('node', [path.join(__dirname, './build-electron.js')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BABEL_ENV: 'electron',
      NODE_ENV: 'production'
    }
  })
  // 等待上面build-electron完毕，在执行构建桌面应用包
  // http://nodejs.cn/api/child_process.html#event-close
  buildElectron.on('close', (code) => {
    // 不使用exec合并 命令的原因： 主要是日志输出问题！
    spawn(electronBuilderScripts, {
      stdio: 'inherit'
    })
  })
}

// 打包web
if (argv.includes('--build') && argv.includes('--web')) {
  spawn('node', [path.join(__dirname, './build-web.js')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BABEL_ENV: 'web',
      NODE_ENV: 'production'
    }
  })
}
