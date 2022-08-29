/*
 * @Date: 2022-06-23 17:07:30
 * @Description: 共有的
 */
import { screen, ipcMain, dialog, BrowserWindow } from 'electron'
import config from '@config/index'
import { winURL } from '../../config'

const commonIpc = () => {
// 错误弹窗
  ipcMain.handle('open-errorbox', (event, arg) => {
    dialog.showErrorBox(
      arg.title,
      arg.message
    )
  })
  // 创建新窗口
  ipcMain.handle('open-win', (event, arg) => {
    const ChildWin = new BrowserWindow({
      height: config.mainWindowMinHeight,
      useContentSize: true,
      width: config.mainWindowMinWidth,
      autoHideMenuBar: true,
      minWidth: config.mainWindowMinWidth,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        // 如果是开发模式可以使用devTools
        devTools: process.env.NODE_ENV === 'development',
        // devTools: true,
        // 在macos中启用橡皮动画
        scrollBounce: process.platform === 'darwin'
      }
    })
    ChildWin.loadURL(winURL + `#${arg.url}`)
    ChildWin.webContents.once('dom-ready', () => {
      ChildWin.show()
    })
  })
}

// 窗口拖动
export const windowMoveIpc = (win, eventName) => {
  ipcMain.on(eventName, (e, {screenX, screenY}) => {
    const { x, y } = screen.getCursorScreenPoint()
    const winScreen  = screen.getPrimaryDisplay()
    win.setMovable(false)
    if (y <= winScreen.workAreaSize.height) {
      win.setPosition(x - screenX, y - screenY)
    } else {
      win.setMovable(true)
    }
  })
}
