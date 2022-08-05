/*
 * @Date: 2022-07-29 15:39:08
 * @Description: webveiw 通信，获取到webview访客页面传递的信息，并且回复它，承载着整个通信
 */
import { getStore, USERINFO } from '@/utils'
import { complexPicker } from '@/components'

const basePath = 'talk-'

const signalSdk = (webview, event) => {
  // 通信给pc时必须如下格式：
  //  webview.send(params?.eventName, { msgno: params?.msgno, data, eventName: 'onSuccess' }) }
  // data是你的传递数据，eventName表示触发params参数里面的方法。其它东西原封不动的写上。
  const params = event.args[0]

  if (event.channel == basePath + 'choose') {
    // 吊起人员选择
    complexPicker({
      ...params.data,
      onSuccess: (data) => {
        webview.send(params?.eventName, { msgno: params?.msgno, data, eventName: 'onSuccess' }) }
    })
  }
  // 获取登录权限
  if (event.channel == basePath + 'request-auth') {
    console.log('request-auth')
    // 吧用户的信息传递出去给pc上
    webview.send(params?.eventName, { msgno: params?.msgno, data: getStore(USERINFO) })
  }
  // 跳转登录页
  if (event.channel == basePath + 'login') {
    const href = location.origin + '/#/login'
    location.href = href
  }
}

export default signalSdk
