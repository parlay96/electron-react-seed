/*
 * @Date: 2022-06-21 16:46:48
 * @Description: 从呈现程序进程到主进程异步通信。
 *  process.env.IS_WEB通过环境，按需引入electron，不然web端网页报错
 */
let oldIpcRenderer = null
// 从呈现程序进程到主进程异步通信。
export default {
  // 通过 channel 向主过程发送消息，并异步等待结果。
  invoke (name: string, data?: any) {
    return new Promise((resolve, reject) => {
      if (process.env.IS_WEB) {
        console.error('不支持electron')
        resolve('不支持electron')
      } else {
        if (oldIpcRenderer) {
          oldIpcRenderer.invoke(name, data).then(res => {
            resolve(res)
          })
        } else {
          import('electron').then(({ipcRenderer}) => {
            oldIpcRenderer = ipcRenderer
            ipcRenderer.invoke(name, data).then(res => {
              resolve(res)
            })
          })
        }
      }
    })
  },
  // 监听 channel, 当新消息到达，将通过 listener(event, args...) 调用 listener。
  on (name: string, cb) {
    if (process.env.IS_WEB) {
      console.error('不支持electron')
    } else {
      if (oldIpcRenderer) {
        oldIpcRenderer.on(name, (event, args) => {
          cb(event, args)
        })
      } else {
        import('electron').then(({ipcRenderer}) => {
          oldIpcRenderer = ipcRenderer
          ipcRenderer.on(name, (event, args) => {
            cb(event, args)
          })
        })
      }
    }
  },
  // 移除所有的监听器，当指定 channel 时只移除与其相关的所有监听器
  remove (data: null | string) {
    if (process.env.IS_WEB) {
      console.error('不支持electron')
    } else {
      if (oldIpcRenderer) {
        oldIpcRenderer.removeAllListeners(data)
      } else {
        import('electron').then(({ipcRenderer}) => {
          oldIpcRenderer = ipcRenderer
          ipcRenderer.removeAllListeners(data)
        })
      }
    }
  },
  // 通过 向主进程发送异步消息channel以及参数
  send (name: string, data?: any) {
    if (process.env.IS_WEB) {
      console.error('不支持electron')
    } else {
      if (oldIpcRenderer) {
        oldIpcRenderer.send(name, data)
      } else {
        import('electron').then(({ipcRenderer}) => {
          oldIpcRenderer = ipcRenderer
          ipcRenderer.send(name, data)
        })
      }
    }
  }
}
