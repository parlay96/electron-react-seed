/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-29 16:47:12
 * @Description: 主进程窗口
 */
import { app, BrowserWindow, dialog, Menu } from 'electron'
import config from '@config/index'
import { setTray, MenuBuilder, updateApp } from '../utils'
import { ipcWinMain } from './ipc-main'
import { winURL, loadingURL } from '../config'

export default class mainInit {
  public winURL = ''
  public shartURL = ''
  public loadWindow: BrowserWindow = null
  public mainWindow: BrowserWindow = null
  private willQuitApp = false;

  constructor () {
    this.winURL = winURL
    this.shartURL = loadingURL
    this.initWindow()
  }
  // 主窗口函数
  createMainWindow () {
    const isMac = process.platform === 'darwin'
    this.mainWindow = new BrowserWindow({
      title: '鱼泡工程云',
      useContentSize: true, // 将设置为 web 页面的尺寸(译注: 不包含边框), 这意味着窗口的实际
      width: config.mainWindowMinWidth,
      height: config.mainWindowMinHeight,
      minWidth: config.mainWindowMinWidth,
      minHeight: config.mainWindowMinHeight,
      show: false,
      frame: config.IsUseFrame, // false代表无边框窗口
      titleBarStyle: 'hiddenInset', // 隐藏标题栏
      // transparent: true, // 背景透明，会导致拖动问题
      webPreferences: {
        contextIsolation: false,
        nodeIntegrationInSubFrames: true,
        webviewTag: true,
        nodeIntegration: true,
        webSecurity: false,
        devTools: true,
        // 在macos中启用橡皮动画
        scrollBounce: process.platform === 'darwin'
      },
      // icon: path.join(__dirname, '../../../assets/icons/icon.icns')
    })

    // if (isMac) {
    //   app.dock.setIcon(path.join(__dirname, '../../../assets/icons/icon.icns'))
    // }

    // 默认窗口最大化
    if (config.IsMaximize) {
      this.mainWindow.maximize()
    }
    // 是否创建托盘
    if (config.IsInitTray) {
      setTray(this.mainWindow)
    }
    // 是否创建菜单
    if (config.IsInitMenu) {
      const menuBuilder = new MenuBuilder(this.mainWindow)
      menuBuilder.buildMenu()
    }
    // 加载主窗口
    this.mainWindow.loadURL(this.winURL)
    // 启用协议
    ipcWinMain(this.mainWindow)
    // 应用更新
    updateApp(this.mainWindow)
    // dom-ready之后显示界面
    this.mainWindow.webContents.once('dom-ready', () => {
      this.mainWindow.show()
      if (config.UseStartupChart) this.loadWindow.destroy()
    })
    if (process.env.NODE_ENV === 'development' || config.IsBuildTools) {
      // 开发模式下自动开启devtools
      this.mainWindow.webContents.openDevTools({ mode: 'right', activate: true })
    }
    app.on('activate', () => {
      // 显示主程序
      this.mainWindow.show()
      // 将窗口从最小化状态恢复到以前的状态
      this.mainWindow.restore()
    })
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


    // 只有显式调用quit才退出系统，区分MAC系统程序坞退出和点击X关闭退出
    app.on('before-quit', () => {
      console.log('before-quit')
      this.willQuitApp = true
    })

    // 窗口关闭前, 隐藏窗口: https://www.electronjs.org/zh/docs/latest/api/browser-window#%E4%BA%8B%E4%BB%B6-close
    this.mainWindow.on('close', (e) => {
      if (process.platform == 'darwin'){
        console.log('这是mac系统 close')
        if (!this.willQuitApp) {
          this.mainWindow.hide()
          e.preventDefault()
        }
      }
      if (process.platform == 'win32' || process.platform == 'linux'){
        this.mainWindow.hide()
        e.preventDefault()
      }
    })
    // 窗口被关闭时 : https://www.electronjs.org/zh/docs/latest/api/browser-window#%E4%BA%8B%E4%BB%B6-closed
    this.mainWindow.on('closed', () => {
      console.log('关闭')
      // 在窗口关闭时触发 当你接收到这个事件的时候, 你应当移除相应窗口的引用对象，避免再次使用它
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
