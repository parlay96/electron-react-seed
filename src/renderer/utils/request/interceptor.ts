/*
 * @Date: 2022-06-09 14:27:45
 * @Description: 请求拦截器
 */

import Qs from "qs"
import axios from 'axios'
import { message } from 'antd'
import { TOKEN, USERINFO, getStore, setStore, request, logOut } from '@/utils'
import { REQUESTURL } from "@/config"

/** 获取请求header信息 */
export const getRequestHeader = (): Record<string, string> => {
  const system_time = `${Math.floor(new Date().getTime() / 1000)}`
  return {
    // requestType: "form",
    // /** 系统时间 */
    // system_time,
    // /** 终端 */
    // system_type: "computer",
    // /** 来源端 1-鱼泡网 */
    // business: "1",
    // /** 版本号 */
    // version: "2.8.5",
  }
}

/* 基础配置 */
axios.defaults.baseURL = process.env.NODE_ENV !== 'development' ? REQUESTURL : '/api' // 不使用代理就直接用这个变量 REQUESTURL
axios.defaults.timeout = 5000
axios.defaults.headers = { ...axios.defaults.headers, ...getRequestHeader() }

/** 请求拦截 */
axios.interceptors.request.use(async (config: any) => {
  /** 序列化请求参数 */
  config.paramsSerializer = (params: any) => {
    return Qs.stringify(params, { arrayFormat: "indices" })
  }

  /** 如果是客户端直接取，如果是服务端需要token，那么自己在参数里面传递进来 */
  config.headers['Authorization'] = await getStore(TOKEN)
  config.headers['system_type'] = 'computer'
  return config
}, error => {
  return Promise.reject(error)
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

/** 响应拦截 */
axios.interceptors.response.use(response => {
  const { code } = response?.data
  /** ！head解决那种cdn获取的json数据请求，他们没有head参数 */
  if (response.status === 200) {
    if (code === 0) {
      return Promise.resolve(response)
    } else if (code === 402) {
      // 刷新令牌执行方法
      return refreshTokenHandler(response)
    } else {
      errorHandler(response?.data)
      return Promise.reject(response.data)
    }
  } else {
    errorHandler(response?.data)
    return Promise.reject(response.data)
  }
}, error => {
  errorHandler(error)
  return Promise.reject(error)
})

/** request 服务器请求状态值 */
const codeMessage: Record<number, string> = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
}

const refreshToken = async () => {
  const { data } = await request["POST/auth/refresh"]()
  if (data.token) {
    setStore(TOKEN, data.token)
    const userInfo = await getStore(USERINFO)
    setStore(USERINFO, {...userInfo, token: data.token})
  }
  return data
}

/** 刷新token执行方法 */
const refreshTokenHandler = (response: any) => {
  const config = response.config
  if (!isRefreshing) {
    isRefreshing = true
    return refreshToken().then(res => {
      const { token } = res
      config.headers['Authorization'] = token
      // 已经刷新了token，将所有队列中的请求进行重试
      requests.forEach(cb => cb(token))
      requests = []
      return axios(config)
    }).finally(() => {
      isRefreshing = false
    })
  } else {
    // 正在刷新token，将返回一个未执行resolve的promise
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push((token) => {
        config.baseURL = ''
        config.headers['Authorization'] = token
        resolve(axios(config))
      })
    })
  }
}

/** 网络请求 统一的异常处理 */
const errorHandler = (error: any) => {
  const { response, code } = error
  if (code === 401) {
    // 清楚存储用户信息
    logOut()
  } else if (code && code !== 402) {
    message.error(error.msg)
  }
  /** 获取状态码信息 定位错误原因 */
  if (response && response.status) {
    const { status, statusText } = response
    const errMsg: string = codeMessage[status] || statusText
    message.error(`状态码:${status}${errMsg}`)
  }
  /** 抛出错位 */
  throw error
}
