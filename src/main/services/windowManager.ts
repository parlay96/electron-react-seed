/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: pl
 * @LastEditTime: 2022-05-28 16:41:56
 * @Description: 主进程窗口
 */
import { platform } from 'os'
import { app, BrowserWindow, dialog } from 'electron'
import config from '@config/index'
import { winURL, loadingURL } from '../config/StaticPath'

class MainInit {
  public winURL = ''
  public shartURL = ''
  public loadWindow: BrowserWindow = null
  public mainWindow: BrowserWindow = null

  constructor () {
    this.winURL = winURL
    this.shartURL = loadingURL
  }
  // 主窗口函数
  createMainWindow () {
    this.mainWindow = new BrowserWindow({
      useContentSize: true, // 将设置为 web 页面的尺寸(译注: 不包含边框), 这意味着窗口的实际
      width: 1700,
      height: 800,
      minWidth: 500,
      minHeight: 500,
      show: false,
      frame: config.IsUseSysTitle, // false代表无边框窗口
      // titleBarStyle: 'hidden', // 隐藏标题栏, 内容充满整个窗口,
      backgroundColor: '#f7f7f7', // 窗口背景色
      transparent: false, // 背景透明，不然拖动窗口有个黑色背景恶心
      webPreferences: {
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true,
        webSecurity: false,
        // 如果是开发模式可以使用devTools
        // devTools: process.env.NODE_ENV === 'development',
        devTools: true,
        // 在macos中启用橡皮动画
        scrollBounce: process.platform === 'darwin'
      }
    })
    // 默认窗口最大化
    if (config.IsMaximize) {
      this.mainWindow.maximize()
    }
    // 加载主窗口
    this.mainWindow.loadURL(this.winURL)
    // dom-ready之后显示界面
    this.mainWindow.webContents.once('dom-ready', () => {
      this.mainWindow.show()
      if (config.UseStartupChart) this.loadWindow.destroy()
    })
    // 开发模式下自动开启devtools
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools({ mode: 'undocked', activate: true })
    }
    // 当确定渲染进程卡死时，分类型进行告警操作
    app.on('render-process-gone', (event, webContents, details) => {
      const message = {
        title: "",
        buttons: [],
        message: '',
      }
      switch (details.reason) {
      case 'crashed':
        message.title = "警告"
        message.buttons = ['确定', '退出']
        message.message = "图形化进程崩溃，是否进行软重启操作？"
        break
      case 'killed':
        message.title = "警告"
        message.buttons = ['确定', '退出']
        message.message = "由于未知原因导致图形化进程被终止，是否进行软重启操作？"
        break
      case 'oom':
        message.title = "警告"
        message.buttons = ['确定', '退出']
        message.message = "内存不足，是否软重启释放内存？"
        break

      default:
        break
      }
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: message.title,
        buttons: message.buttons,
        message: message.message,
        noLink: true
      }).then(res => {
        if (res.response === 0) this.mainWindow.reload()
        else this.mainWindow.close()
      })
    })
    // 不知道什么原因，反正就是这个窗口里的页面触发了假死时执行
    this.mainWindow.on('unresponsive', () => {
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: '警告',
        buttons: ['重载', '退出'],
        message: '图形化进程失去响应，是否等待其恢复？',
        noLink: true
      }).then(res => {
        if (res.response === 0) this.mainWindow.reload()
        else this.mainWindow.close()
      })
    })
    /**
     * 新的gpu崩溃检测，详细参数详见：http://www.electronjs.org/docs/api/app
     */
    app.on('child-process-gone', (event, details) => {
      const message = {
        title: "",
        buttons: [],
        message: '',
      }
      switch (details.type) {
      case 'GPU':
        switch (details.reason) {
        case 'crashed':
          message.title = "警告"
          message.buttons = ['确定', '退出']
          message.message = "硬件加速进程已崩溃，是否关闭硬件加速并重启？"
          break
        case 'killed':
          message.title = "警告"
          message.buttons = ['确定', '退出']
          message.message = "硬件加速进程被意外终止，是否关闭硬件加速并重启？"
          break
        default:
          break
        }
        break

      default:
        break
      }
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: message.title,
        buttons: message.buttons,
        message: message.message,
        noLink: true
      }).then(res => {
        // 当显卡出现崩溃现象时使用该设置禁用显卡加速模式。
        if (res.response === 0) {
          if (details.type === 'GPU') app.disableHardwareAcceleration()
          this.mainWindow.reload()
        } else {
          this.mainWindow.close()
        }
      })
    })
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }
  // 加载窗口函数
  loadingWindow (loadingURL: string) {
    this.loadWindow = new BrowserWindow({
      width: 400,
      height: 600,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      webPreferences: { experimentalFeatures: true }
    })

    this.loadWindow.loadURL(loadingURL)
    this.loadWindow.show()
    this.loadWindow.setAlwaysOnTop(true)
    // 延迟两秒可以根据情况后续调快
    setTimeout(() => {
      this.createMainWindow()
    }, 1500)
  }
  // 初始化窗口函数
  initWindow () {
    if (config.UseStartupChart) {
      return this.loadingWindow(this.shartURL)
    } else {
      return this.createMainWindow()
    }
  }
}
export default MainInit
