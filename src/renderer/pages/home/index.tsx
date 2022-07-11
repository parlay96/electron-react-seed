/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-11 12:35:16
 * @Description: 控制台页面
 */
import React, { useState, useRef } from "react"
import classNames from 'classnames'
import { Icon, Webview, IWebviewRef} from "@/components"
import styles from './index.module.scss'

// 控制台页面
const Home = () => {
  const webviewRef = useRef<IWebviewRef>()
  // 是否可以返回
  const [isCanGoBack, setCanGoBack] = useState<boolean>(false)
  // 是否可以前进
  const [isCanGoForward, setCanGoForward] = useState<boolean>(false)

  // 当webview页面路径方法变化
  const onNavigateChange = () => {
    setCanGoBack(webviewRef.current?.canGoBack() || false)
    setCanGoForward(webviewRef.current?.canGoForward() || false)
  }

  // 刷新页面
  const onRefresh = () => {
    webviewRef.current?.reload()
  }
  // 回退页面
  const onGoBack = () => {
    if (isCanGoBack) {
      webviewRef.current?.goBack()
    }
  }
  // 前进页面
  const onGoForward = () => {
    if (isCanGoForward) {
      webviewRef.current?.goForward()
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
          <Webview navigateChange={onNavigateChange} ref={webviewRef}/>
        </div>
      </div>
    </>
  )
}

export default Home

