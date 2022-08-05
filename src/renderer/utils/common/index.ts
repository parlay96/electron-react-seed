/*
 * @Date: 2022-08-03 15:03:25
 * @Description: 公用的方法
 */
import { request, getStore, USERINFO, setStore, TOKEN } from '..'

/** 切换企业 */
export const switchEnterprise = async (cid: string) => {
  const userInfo = getStore(USERINFO)
  // 表示目前企业跟切换企业是一致的，就不需要切换
  if (userInfo && userInfo.user?.cid == cid) return false
  const { data } = await request['POST/auth/change-corp-login']({ login_cid: cid })
  setStore(USERINFO, data)
  setStore(TOKEN, data.token)
  return true
}
