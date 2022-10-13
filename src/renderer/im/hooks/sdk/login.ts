/*
 * @Date: 2022-09-13 16:03:25
 * @Description: im登录sdk
 */
import webIm from '../webIm'
/**
 * 登录im。
 * @param {Object} option -
 * @param {Object} option.user -  登录用户id
 * @param {Object} option.accessToken -   登录token
*/
interface LoginOption {
  user: number
  accessToken: string
}
export function login (option: LoginOption) {
  return new Promise<void>((resolve, reject) => {
    const options = {
      user: option.user,
      accessToken: option.accessToken,
      appKey: webIm.config.appkey
    }
    /** 打开im */
    webIm.conn.open(options)
    webIm.conn.listen({
      onOpened: () => {
        resolve()
      },
      onError: (err) => {
        reject(err)
      }
    })
  })
}

/** 退出登录 */
export function logout () {
  return new Promise<void>((resolve) => {
    webIm.conn.close()
    resolve()
  })
}


