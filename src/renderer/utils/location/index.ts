/*
 * @Date: 2022-08-05 19:05:44
 * @Description: file content
 */
import { api } from '@/im'
import { deleteStore, TOKEN, USERINFO, AUTO_LOGIN, CONVID, $ipc } from '..'

/**
 * 路由跳转，通常使用在让主进程更换路由，非react组件使用，项目内部使用react-router推荐方式
 * @path路径
 * @params路由参数
 */
export const routerNavigat = async (path, params?: {[key: string]: any}) => {
  const order = {
    path: path,
  } as any

  if (params) {
    order.params = params
  }

  $ipc.send('router-navigat', order)
}

/**
 *@清除缓存退出登录
 */
export const logOut = async () => {
  /** 清除用户信息, 和一些系统变量 */
  [TOKEN, USERINFO, AUTO_LOGIN, CONVID].map(item => {
    deleteStore(item)
  })
  try {
    /**im: 删除会话列表缓存数据 */
    await $ipc.invoke('deleteStoreKey', 'conv-data')
    /** 断开im */
    await api.login.logout()
    /** 去登录页面 */
    await routerNavigat('/login')
  } catch (err) {
  }
}
