/*
 * @Author: penglei
 * @Date: 2022-05-27 11:51:37
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-27 11:51:56
 * @Description:
 */
import { globalShortcut } from 'electron'
import config from '@config/index'

export default {
  Disablef12 () {
    if (process.env.NODE_ENV === 'production' && config.build.DisableF12) {
      globalShortcut.register('f12', () => {
        console.log('用户试图启动控制台')
      })
    }
  }
}
