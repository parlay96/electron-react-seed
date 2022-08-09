/*
 * @Date: 2022-08-05 19:05:44
 * @Description: file content
 */
import { deleteStore, TOKEN, USERINFO, AUTO_LOGIN } from '..'

// 清除缓存 退出登录
export const logOut = () => {
  [TOKEN, USERINFO, AUTO_LOGIN].map(item => {
    deleteStore(item)
  })
}
