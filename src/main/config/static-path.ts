/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-10 18:15:47
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

// 路由路径基础地址
export const basePath = process.env.NODE_ENV === 'development' ? `localhost:${process.env.PORT}` : `${__dirname}/index.html`
// 主窗口地址
export const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : `file://${__dirname}/index.html`

export const loadingURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}/loader.html` : `file://${__static}/loader.html`

export const trayIcon = `${__static}/trayIcon.png`

export const trayMac = `${__static}/trayMac.png`
