/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-25 13:47:38
 * @Description:
 */
// 这里定义了静态文件路径的位置
import { join } from 'path'

let __static: string
if (process.env.NODE_ENV !== 'development') {
  __static = join(__dirname, '/static').replace(/\\/g, '\\\\')
} else {
  __static = join(__dirname, '..', '..', '..', '/static').replace(/\\/g, '\\\\')
}

export const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : `file://${__dirname}/index.html`

export const loadingURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}/loader.html` : `file://${__static}/loader.html`

export const trayIcon = `${__static}/trayIcon.png`
