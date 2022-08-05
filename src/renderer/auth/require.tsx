/*
 * @Date: 2022-07-27 17:05:21
 * @Description:
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
  const autoLogin = getStore(AUTO_LOGIN)
  const now = dayjs().valueOf()
  const endTime = dayjs(autoLogin).valueOf()
  /** 自动登录 */
  if (autoLogin) {
    if (now < endTime) {
      return children
    } else {
      auth.setAutoLogin(false)
    }
  }

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
