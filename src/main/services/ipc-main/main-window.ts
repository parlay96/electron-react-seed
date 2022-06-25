/*
 * @Date: 2022-06-23 17:06:22
 * @Description: 主窗口的ipc通信
 */
import { ipcMain, dialog, BrowserWindow, shell } from 'electron'
import { windowMoveIpc } from './common'
import { setTray } from '../../utils'

/** 主窗口的 ipc通信*/
export const ipcWinMain = (mainWindow: BrowserWindow) => {
  // 窗口拖动时
  windowMoveIpc(mainWindow, 'main-window-move')
  // 最小化
  ipcMain.handle('windows-mini', () => {
    mainWindow.minimize()
  })
  // 取消最大化窗口
  ipcMain.handle('window-mix', async () => {
    mainWindow.unmaximize()
    // 不是最大化时，才可以手动调整窗口大小
    mainWindow.setResizable(true)
  })
  // 最大化窗口。如果尚未显示该窗口，它还将显示（但不聚焦）该窗口。
  ipcMain.handle('window-max', async () => {
    mainWindow.maximize()
    // 是最大化时，不才可以手动调整窗口大小
    mainWindow.setResizable(false)
  })
  // 关闭窗口
  ipcMain.handle('window-close', () => {
    mainWindow.close()
  })
  // 用浏览器打开需要访问的网页地址
  ipcMain.handle('open-external', (event, arg) => {
    shell.openExternal(arg)
  })
  // 主进程监听打开托盘事件
  ipcMain.handle('open-tray', ()=>{
    return setTray(mainWindow)
  })
  // 设置窗口的位置
  ipcMain.handle('main-set-position', (event, arg)=>{
    mainWindow.setPosition(arg.x, arg.y, true)
  })
  // 消息弹窗
  ipcMain.handle('open-messagebox', async (event, arg) => {
    const res = await dialog.showMessageBox(mainWindow, {
      type: arg.type || 'info',
      title: arg.title || '',
      buttons: arg.buttons || [],
      message: arg.message || '',
      noLink: arg.noLink || true
    })
    return res
  })
}
