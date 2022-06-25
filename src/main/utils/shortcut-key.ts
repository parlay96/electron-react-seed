/*
 * @Date: 2022-05-27 11:51:37
 * @Description: 快捷键操作
 */
import { globalShortcut } from 'electron'

export const shortcutKry = (copyWindow) => {
  // 用户试图按F11
  globalShortcut.register('F11', () => {
    let isMax = false
    // 如果窗口最大化了。就取消最大化
    if (copyWindow.isMaximized()) {
      copyWindow.unmaximize()
      // 不是最大化时，才可以手动调整窗口大小
      copyWindow.setResizable(true)
      isMax = false
    } else {
      copyWindow.maximize()
      // 是最大化时，不才可以手动调整窗口大小
      copyWindow.setResizable(false)
      isMax = true
    }
    // 给渲染进程发送消息
    copyWindow.webContents.send('shortcutKeyEleven', isMax)
  })
}
