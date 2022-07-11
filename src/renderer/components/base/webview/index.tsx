/*
 * @Date: 2022-07-11 11:55:14
 * @Description: webview组件
 */
import React, { forwardRef, memo, useEffect, useImperativeHandle } from "react"

interface IWebviewProps {
  navigateChange?: () => void
}

export type IWebviewRef = {
  canGoBack: () => boolean
  canGoForward: () => boolean
  reload: () => void
  goBack: () => void
  goForward: () => void
}

let webview = null
let openDevToolsNum = null
const webviewSrc = 'http://0.0.0.0:3000'

const WebViewBox = forwardRef<IWebviewRef, IWebviewProps>((props, ref) => {
  const { navigateChange } = props
  // preload脚本路径
  const preloadBasePath = process.env.NODE_ENV !== 'development' ? window.__static : __static

  useImperativeHandle(ref,
    () => ({
      canGoBack: () => webview?.canGoBack(),
      canGoForward: () => webview?.canGoForward(),
      reload: () => webview?.reload(),
      goBack: () => webview?.goBack(),
      goForward: () => webview?.goForward(),
    })
  )

  useEffect(() => {
    webview = document.querySelector('webview')
    if (webview && !process.env.IS_WEB) {
      // 页面路径变化时
      webview.addEventListener('did-navigate-in-page', () => {
        navigateChange?.()
      })
      // 接受webview页面通信
      webview.addEventListener('ipc-message', (event) => {
        console.log(event)
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
      {!process.env.IS_WEB &&
        <webview
          style={{ width: '100%', height: '100%' }}
          preload={preloadBasePath + '/preload.js'}
          src={webviewSrc}>
        </webview>}
      {process.env.IS_WEB && <div>不支持webview</div>}
    </>
  )
})

export default memo(WebViewBox)
