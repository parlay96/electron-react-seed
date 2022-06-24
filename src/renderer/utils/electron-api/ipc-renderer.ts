/*
 * @Date: 2022-06-21 16:46:48
 * @Description: 从呈现程序进程到主进程异步通信。
 */
import { ipcRenderer } from 'electron'

// 从呈现程序进程到主进程异步通信。
export default {
  // 通过 channel 向主过程发送消息，并异步等待结果。
  invoke (name: string, data?: any) {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke(name, data).then(res => {
        resolve(res)
      })
    })
  },
  // 监听 channel, 当新消息到达，将通过 listener(event, args...) 调用 listener。
  on (name: string) {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(name, (event, args) => {
        resolve(args)
      })
    })
  },
  // 移除所有的监听器，当指定 channel 时只移除与其相关的所有监听器
  remove (data: null | string) {
    ipcRenderer.removeAllListeners(data)
  },
  // 通过 向主进程发送异步消息channel以及参数
  send (name: string, data?: any) {
    ipcRenderer.send(name, data)
  }
}
