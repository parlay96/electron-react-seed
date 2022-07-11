/*
 * @Author: penglei
 * @Date: 2022-05-26 12:03:14
 * @LastEditors: penglei
 * @LastEditTime: 2022-07-10 22:07:58
 * @Description:
 */
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare let __static: string
interface Window {
  __static: string;
}
