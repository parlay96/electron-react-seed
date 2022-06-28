/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-27 17:16:10
 * @Description: 控制台页面
 */
import React, { useEffect, useState } from "react"
import classNames from 'classnames'
import { Icon } from "@/components"
import styles from './index.module.scss'

let webview = null
const Home = () => {
  const [isCanGoBack, setCanGoBack] = useState<boolean>(false)
  const [isCanGoForward, setCanGoForward] = useState<boolean>(false)

  useEffect(() => {
    webview = document.querySelector('webview')
    if (webview && !process.env.IS_WEB) {
      // 页面路径变化时1
      webview.addEventListener('did-navigate-in-page', onNavigateChange)
    }
  }, [])

  // 当webview页面路径方法变化
  const onNavigateChange = () => {
    setCanGoBack(webview?.canGoBack() || false)
    setCanGoForward(webview?.canGoForward() || false)
  }

  // 刷新页面
  const onRefresh = () => {
    webview?.reload()
  }
  // 回退页面
  const onGoBack = () => {
    if (isCanGoBack) {
      webview?.goBack()
    }
  }
  // 前进页面
  const onGoForward = () => {
    if (isCanGoForward) {
      webview?.goForward()
    }
  }

  // 按钮样式
  const leftBtnStyle = classNames(styles.navBtn, {[styles['activation']]: isCanGoBack})
  const rightBtnStyle = classNames(styles.navBtn, {[styles['activation']]: isCanGoForward})

  return (
    <>
      <div className={styles.workBench}>
        <div className={styles.ribbonBox}>
          <div className={classNames(styles.btnGroup, 'unselectable')}>
            <div className={leftBtnStyle} onClick={onGoBack}>
              <Icon type="yp-zuojiantou" className={styles.leftBtn} size={16}/>
            </div>
            <div className={rightBtnStyle} onClick={onGoForward}>
              <Icon type="yp-zuojiantou" rotate={180} size={16}/>
            </div>
            <div className={classNames(styles.refresh, styles.activation)} onClick={onRefresh}>
              <Icon type="yp-shuaxin" size={16}/>
            </div>
          </div>
          <div className={styles.companyBox}>
            <p>成都华商建筑公司</p>
            <Icon type="yp-xialasanjiao" size={10}/>
          </div>
        </div>
        <div className={styles.webviewBox}>
          {!process.env.IS_WEB && <webview style={{ width: '100%', height: '100%' }} src="http://192.168.0.17:3000"></webview>}
        </div>
      </div>
    </>
  )
}

export default Home
