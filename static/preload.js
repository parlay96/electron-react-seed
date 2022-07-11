/*
 * @Author: penglei
 * @Date: 2022-07-10 19:08:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-11 11:34:49
 * @Description:
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron')
// 桥接
contextBridge.exposeInMainWorld(
  '_ypTalkApi',
  {
    isYpTalk: true
  }
)
