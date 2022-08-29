/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: penglei
 * @LastEditTime: 2022-08-23 14:24:28
 * @Description: 主进程入口
 */
import { app, globalShortcut, ipcMain } from 'electron'
import mainInit from './services/main-init'
import {shortcutKry} from './utils'
import config from '@config/index'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

let myWindow = null
// 获取可执行文件位置
const ex = process.execPath

// 是否单例模式
if (config.IsSingleInstances) {
  // 此方法的返回值表示你的应用程序实例是否成功取得了锁。 如果它取得锁失败，你可以假设另一个应用实例已经取得了锁并且仍旧在运行，并立即退出。
  const gotTheLock = app.requestSingleInstanceLock()
  // 如果我的应用已经存在，那么就退出当前的进程
  if (!gotTheLock) {
    app.quit()
  } else {
    // 当第二个实例被执行并且调用 app.requestSingleInstanceLock() 时，这个事件将在你的应用程序的首个实例中触发
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      if (myWindow) {
        myWindow.show()
        if (myWindow.isMinimized()) myWindow.restore()
        myWindow.focus()
      }
    })
    // 创建 myWindow, 加载应用的其余部分, etc...
    app.isReady() ? onAppReady() : app.on('ready', onAppReady)
  }
} else {
  // 多开模式，每次创建一个进程window会是一个新的，
  // 第一次打开的进程实例的window对象，如你在上面存储window上面的localStorage，会是你下次创建第一个进程实例的window
  // 上面的话不好理解?意思就是你第一次创建的进程window上存的值，如果后面再次创建第一个进程，
  // 那么那个进程的window对象上的值，会是你第一次创建应用的值！
  // 当Electron 初始化完成。 可用作检查 app.isReady() 的方便选择
  // 创建 myWindow, 加载应用的其余部分, etc...
  app.isReady() ? onAppReady() : app.on('ready', onAppReady)
}

function onAppReady () {
  if (!myWindow) {
    myWindow = new mainInit().mainWindow
    // 快捷键
    shortcutKry(myWindow)
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`已安装 ${name}`))
        .catch(err => console.log(`无法安装: \n 可能发生得错误：网络连接问题 \n`, err))
    }
  }
}

// Electron 已完成初始化? https://www.electronjs.org/zh/docs/latest/api/app#事件-ready
// app.isReady() ? onAppReady() : app.on('ready', onAppReady)

// 由于9.x版本问题，需要加入该配置关闭跨域问题
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

// https://www.electronjs.org/zh/docs/latest/api/app#事件-window-all-closed
app.on('window-all-closed', () => {
  // 所有平台均为所有窗口关闭就退出软件
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

// 应用程序退出时发出
app.on('quit', () => {
  // 取消注册所有快捷方式
  globalShortcut.unregisterAll()
})

// 在创建新的 browserWindow 时触发
app.on('browser-window-created', () => {
  console.log('window-created')
})

// 开启 开机自启动
ipcMain.on('openAutoStart', () => {
  app.setLoginItemSettings({
    openAtLogin: true,
    path: ex,
    args: []
  })
})

// 关闭 开机自启动
ipcMain.on('closeAutoStart', ()=>{
  app.setLoginItemSettings({
    openAtLogin: false,
    path: ex,
    args: []
  })
})

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient('yupao')
    console.log('有于框架特殊性开发环境下无法使用')
  }
} else {
  app.setAsDefaultProtocolClient('yupao')
}
