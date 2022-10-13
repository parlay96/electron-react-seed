/*
 * @Date: 2022-07-27 16:46:14
 * @Description:
 */
import { deleteStore, setStore, TOKEN, USERINFO, AUTO_LOGIN, getStore } from '@/utils'
import * as React from 'react'
import { createContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Modal } from 'antd'
import { request } from '@/utils'
import { initApi, api } from '@/im'


interface AuthContextType {
  user: any;
  signIn: (callback, fail?) => void
  setAutoLogin: (autoLogin: boolean) => void
  loginIm: (params) => void
  autoLoginFunc: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider ({ children }: {children: React.ReactNode}) {
  const navigate = useNavigate()
  // 当前路由信息
  const location = useLocation() as any
  // 用户信息
  const [user, setUser] = useState<any>()
  const from = location.state?.from?.pathname || "/"

  // 登录桌面端
  const signIn = (callback, fail?) => {
    callback().then(data => {
      if (!data.user?.cid) {
        Modal.warning({
          title: '提示',
          content: '您尚未创建或加入企业。 请先在移动端创建或加入企业后，方可使用电脑端。',
          onOk: () => {
            fail && fail()
          }
        })
        return
      }
      setStore(USERINFO, data)
      setStore(TOKEN, data.token)
      if (data.autoLogin) {
        setAutoLogin(true)
      }
      // 登录IM
      loginIm(data.user).then(() => {
        setUser(data)
        // 再次触发一次页面加载。然后又会走require.ts权限拦截逻辑
        navigate(from, { replace: true })
      })
    })
  }

  /** 登录im */
  const loginIm = async (params) => {
    const { data } = await request["GET/im/user/token"]()
    // console.log('data', data, user)
    /** 登录im */
    await api.login.login({
      user: params.account_id,
      accessToken: data.token,
    })
    /** 监听im */
    initApi()
  }

  /** 设置自动登录 */
  const setAutoLogin = (autoLogin: boolean) => {
    if (autoLogin) {
      setStore(AUTO_LOGIN, dayjs().add(15, 'day'))
    } else {
      deleteStore(AUTO_LOGIN)
    }
  }

  /** 自动登录时，登录IM */
  const autoLoginFunc = () => {
    const userInfo = getStore(USERINFO)
    if (userInfo) {
      // 设置用户信息
      loginIm(userInfo?.user).then(() => {
        setUser(userInfo)
        // 再次触发一次页面加载。然后又会走require.ts权限拦截逻辑
        navigate(from, { replace: true })
      })
    }
  }

  const value = { user, signIn, loginIm, setAutoLogin, autoLoginFunc }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
