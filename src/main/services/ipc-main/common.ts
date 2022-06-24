/*
 * @Date: 2022-06-23 17:07:30
 * @Description: 共有的
 */

import { screen, ipcMain, dialog, BrowserWindow } from 'electron'
import { winURL } from '../../config/static-path'

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
      height: 595,
      useContentSize: true,
      width: 842,
      autoHideMenuBar: true,
      minWidth: 842,
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
  let winStartPosition = {x: 0, y: 0}
  let mouseStartPosition = {x: 0, y: 0}
  let movingInterval = null
  /**
   * 窗口移动事件
   * canMoving：true 开起拖动  false 停止
   * mixFlag 是否从最大化，通过拖动的方式变为取消最大化时，且带移动！
   */
  ipcMain.on(eventName, (events, params) => {
    if (params.canMoving) {
      // 读取原位置
      const winPosition = win.getPosition()
      // 窗口的宽度和高度
      const winSize = win.getSize()
      // 原位置的坐标
      winStartPosition = { x: winPosition[0], y: winPosition[1] }
      // 鼠标指针的当前绝对位置
      mouseStartPosition = screen.getCursorScreenPoint()
      // 这个表示窗口从最大化，通过拖动的方式变为取消最大化时，且带移动！
      // 这个时候不能再取原位置，必须通过计算得到当前窗口的x y坐标
      if (params.mixFlag) {
        // 把当前的y变为0，任何桌面端应用窗口最大化时，再去拖动，都是吧y变化0
        winStartPosition.y = 0
        // 计算x坐标： 当前鼠标的位置比如为200，那么窗口的位置，就为 200 - 屏幕的宽度 / 2
        // 这样可以保证鼠标完全不脱离于目前拖动元素, 不然就会有bug, 会导致窗口一直跟着鼠标不放！
        winStartPosition.x = mouseStartPosition.x - Math.round(winSize[0] / 2)
        win.setPosition(winStartPosition.x, winStartPosition.y, true)
      }
      // 清除
      if (movingInterval) {
        clearInterval(movingInterval)
      }
      // 新开
      movingInterval = setInterval(() => {
        // 实时更新位置
        const cursorPosition = screen.getCursorScreenPoint()
        const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x
        const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y
        win.setPosition(x, y, true)
      }, 20)
    } else {
      // console.log('我被清除了----', new Date().getTime())
      clearInterval(movingInterval)
      movingInterval = null
    }
  })
}
