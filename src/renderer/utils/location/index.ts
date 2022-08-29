/*
 * @Date: 2022-08-05 19:05:44
 * @Description: file content
 */
import { deleteStore, TOKEN, USERINFO, AUTO_LOGIN, $ipc } from '..'

/**
 * 路由跳转，通常使用在让主进程更换路由，非react组件使用，项目内部使用react-router推荐方式
 * @path路径
 * @params路由参数
 */
export const routerNavigat = (path, params?: {[key: string]: any}) => {
  const order = {
    path: path,
  } as any

  if (params) {
    order.params = params
  }

  $ipc.send('router-navigat', order)
}

// 清除缓存 退出登录
export const logOut = () => {
  [TOKEN, USERINFO, AUTO_LOGIN].map(item => {
    deleteStore(item)
  })
  routerNavigat('/login')
}
