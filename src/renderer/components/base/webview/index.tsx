/*
 * @Date: 2022-07-11 11:55:14
 * @Description: webview组件
 */
import React, { useEffect } from "react"
import { renderToBody, getEleById } from '@/utils'
import signalSdk from './signal'

interface IWebviewProps {
  isMaximize: boolean
  url?: string
  top?: number // webview盒子定位距离顶部
  left?: number // webview盒子定位距离左侧
  navigateChange?: () => void
}

export type IWebviewRef = {
  unmount: () => void
  show: () => void
  hide: () => void
  canGoBack: () => boolean
  canGoForward: () => boolean
  reload: () => void
  goBack: () => void
  goForward: () => void
}

let webview = null
let unmount = null // 卸载
let openDevToolsNum = null
const webviewSrc = 'http://127.0.0.1:3000'

const WebView = (props: Partial<IWebviewProps>) => {
  // preload脚本路径1
  const preloadBasePath = process.env.NODE_ENV !== 'development' ? window.__static : __static
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const preloadPath = `file:${require('path').resolve(preloadBasePath, './preload.js')}`
  useEffect(() => {
    webview = document.querySelector('webview')
    if (webview && !process.env.IS_WEB) {
      // 接受webview页面通信
      webview.addEventListener('ipc-message', (event) => {
        signalSdk(webview, event)
      })
      webview.addEventListener('dom-ready', () => {
        // 打开调试器
        if (!openDevToolsNum && process.env.NODE_ENV == 'development') {
          webview.openDevTools()
        }
        openDevToolsNum = true
      })
    }
  }, [])

  return (
    <>
      <webview
        style={{ width: '100%', height: '100%' }}
        preload={ preloadPath }
        src={webviewSrc + (props?.url || '')}>
      </webview>
    </>
  )
}

/**
 * @name 自定义WebView高阶函数(Hof)
 */
const createWebViewHof = (props: IWebviewProps): IWebviewRef => {
  const {top = 100, left = 70, navigateChange, isMaximize, url} = props
  let webViewBox = null
  // webViewBox盒子的行内样式
  const pNum = isMaximize ? 0 : 6
  const style =
  `position: fixed;
   top: ${top}px;
   left: ${left}px;
   width: calc(100% - ${left + pNum}px);
   height: calc(100% - ${top + pNum}px);
   display: block
  `
  // 显示webView 就动态显示，隐藏webViewBox外层节点
  const showWebView = (bool) => {
    if (!webViewBox) return
    if (bool) {
      webViewBox.setAttribute('style', style)
      // 页面路径变化时,创新新建一个事件，不然onnavigateChange是一个旧值
      webview.addEventListener('did-navigate-in-page', onnavigateChange)
      // 如果url存在，就主动在加载一次，因为可能是外面传递的url
      if (url) {
        webview.loadURL(webviewSrc + url)
      }
      // 每次show主动调用一次，因为我们是使用了display，当切换路由，其实webview并未重新渲染！
      onnavigateChange?.()
    } else {
      webViewBox.style.display = 'none'
      if (navigateChange) {
        // 隐藏是卸载掉事件。防止重复创建事件
        webview?.removeEventListener('did-navigate-in-page', onnavigateChange)
      }
    }
  }

  const onnavigateChange = () => {
    navigateChange?.()
  }

  // 不是web端才执行
  if (!process.env.IS_WEB) {
    // 如果webview不存在，那就去创建， （防止多次创建）
    if (!webview) {
      unmount = renderToBody(<WebView url={url}/>, {id: 'webViewBox', style})
      // 初始化时，延迟添加事件
      setTimeout(()=> webview.addEventListener('did-navigate-in-page', onnavigateChange), 20)
      webViewBox = getEleById('webViewBox')
    // 存在的时候
    } else {
      webViewBox = getEleById('webViewBox')
      // 初始化默认执行显示
      showWebView(true)
    }
  } else {
    console.error('暂时不支持webview')
  }

  return {
    unmount: () => {
      webview = null
      openDevToolsNum = null
      unmount?.()
    },
    show: () => showWebView(true),
    hide: () => showWebView(false),
    canGoBack: () => webview?.canGoBack(),
    canGoForward: () => webview?.canGoForward(),
    reload: () => webview?.reload(),
    goBack: () => webview?.goBack(),
    goForward: () => webview?.goForward()
  }
}

export default createWebViewHof
