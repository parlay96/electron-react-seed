/*
 * @Date: 2022-07-27 16:46:14
 * @Description:
 */
import { deleteStore, setStore, TOKEN, USERINFO, AUTO_LOGIN } from '@/utils'
import * as React from 'react'
import { createContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Modal } from 'antd'

interface AuthContextType {
  user: any;
  signIn: (callback) => void;
  signOut: (callback) => void;
  setAutoLogin: (autoLogin: boolean) => void;
}

const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider ({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<any>()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || "/"

  const signIn = (callback) => {
    callback().then(data => {
      if (!data.user?.cid) {
        Modal.warning({
          title: '提示',
          content: '您尚未创建或加入企业。 请先在移动端创建或加入企业后，方可使用电脑端。',
        })
        return
      }
      setStore(USERINFO, data)
      setStore(TOKEN, data.token)
      setUser(data)
      if (data.autoLogin) {
        setAutoLogin(true)
      }
      navigate(from, { replace: true })
    })
  }

  const signOut = (callback) => {
    callback().then(() => {
      setUser(null)
      deleteStore(USERINFO)
      deleteStore(TOKEN)
    })
  }

  const setAutoLogin = (autoLogin: boolean) => {
    if (autoLogin) {
      setStore(AUTO_LOGIN, dayjs().add(15, 'day'))
    } else {
      deleteStore(AUTO_LOGIN)
    }
  }

  const value = { user, signIn, signOut, setAutoLogin }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
