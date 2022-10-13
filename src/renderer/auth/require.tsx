/*
 * @Date: 2022-07-27 17:05:21
 * @Description: 权限拦截器
 */
import { AUTO_LOGIN, getStore } from "@/utils"
import * as React from "react"
import {
  useLocation,
  Navigate,
} from "react-router-dom"
import dayjs from 'dayjs'
import { useAuth } from "./hook"

export function RequireAuth ({ children }: { children: JSX.Element }) {
  const auth = useAuth()
  const location = useLocation()
  // 获取自动登录的时间
  const autoLogin = getStore(AUTO_LOGIN)
  // 当前时间戳
  const now = dayjs().valueOf()
  // 结束时间戳
  const endTime = dayjs(autoLogin).valueOf()
  /** 自动登录 */
  if (autoLogin) {
    // 如果当前时间戳小于结束时间戳，代表未过期1
    if (now < endTime) {
      // 自动登录时：如果用户user不存在，就调用一次，如果存在就不在调用了。
      // 解决切换页面多次执行autoLoginFunc方法的问题
      if (!auth.user) {
        auth.autoLoginFunc()
        // 遇见IM 自动登录，就先返回空节点。然后autoLoginFunc方法会再次跳转一次。解决：先登录im  再去加载页面。保证IM页面异步不出问题！
        return <></>
      }
    // 过期了
    } else {
      auth.setAutoLogin(false)
    }
  }

  // 未登录 || 自动登录过期 user是没有值的， 都会走下面的逻辑，去登录页面！
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
