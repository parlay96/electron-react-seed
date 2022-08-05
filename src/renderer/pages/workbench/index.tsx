/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-05 09:57:35
 * @Description: 工作台页面
 */
import React, { useState, useEffect } from "react"
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { Icon, createWebViewHof, IWebviewRef, Image } from "@/components"
import { connect } from "@/store"
import { getStore, USERINFO, request, switchEnterprise } from '@/utils'
import styles from './index.module.scss'

const { confirm } = Modal

let webviewRef: IWebviewRef = null

export interface IWorkbenchProps {
  isMaximize?: boolean
}

// 工作台页面
const Workbench = (props: IWorkbenchProps) => {
  const params = useLocation() as any
  // 是否可以返回
  const [isCanGoBack, setCanGoBack] = useState<boolean>(false)
  // 是否可以前进
  const [isCanGoForward, setCanGoForward] = useState<boolean>(false)
  // 企业信息列表
  const [contactsList, setContactsList] = useState<{name:string, cid: string, avatar: string}[]>([])
  const [contacyInfo, setContacyInfo] = useState<any>({})
  const [showContacts, setShowContacts] = useState<boolean>(false)
  // 当webview页面路径方法变化1
  const onNavigateChange = () => {
    setCanGoBack(webviewRef?.canGoBack() || false)
    setCanGoForward(webviewRef.canGoForward() || false)
  }

  // 获取企业列表
  useEffect(() => {
    getContactsList()
    // 点击隐藏，弹窗
    document.addEventListener('click',function (){
      setShowContacts(false)
    })
  }, [])

  const getContactsList = async () => {
    const { user } = getStore(USERINFO)
    const { data } = await request['POST/corp/contacts/address-book']()
    setContactsList(data?.list?.map(item => {
      return {
        name: item.title,
        cid: item.cid,
        avatar: item.avatar
      }
    }))
    setContacyInfo(user)
  }
  const createWebView = (ifFlag?: boolean) => {
    // 创建一个webview窗口
    webviewRef = createWebViewHof({
      navigateChange: onNavigateChange,
      isMaximize: props?.isMaximize,
      url: ifFlag ? '' : params?.state?.url
    })
  }
  useEffect(() => {
    createWebView()
    return () => {
      webviewRef?.hide()
    }
  }, [props?.isMaximize])

  // 刷新页面
  const onRefresh = () => {
    webviewRef?.reload()
  }
  // 回退页面
  const onGoBack = () => {
    if (isCanGoBack) {
      webviewRef?.goBack()
    }
  }
  // 前进页面
  const onGoForward = () => {
    if (isCanGoForward) {
      webviewRef?.goForward()
    }
  }

  // 按钮样式
  const leftBtnStyle = classNames(styles.navBtn, {[styles['activation']]: isCanGoBack})
  const rightBtnStyle = classNames(styles.navBtn, {[styles['activation']]: isCanGoForward})

  return (
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
        <div className={classNames(styles.companyBox, 'unselectable')}
          onClick={(event) => {
            event.stopPropagation()//阻止冒泡
            setShowContacts(true)
          }}>
          <div className={styles.depaImgBox}>
            <Icon type="yp-zuzhijiagou" size={15} color="#fff"/>
          </div>
          <p>{contacyInfo?.corp_name}</p>
          <Icon type="yp-xialasanjiao" className={styles.botIcon} size={10}/>
        </div>
      </div>
      <div className={styles.contactsList} id="contactsList" style={{display: showContacts ? 'block' : 'none'}}>
        {contactsList?.map(item =>
          <div className={classNames(styles.contactItem, 'unselectable')}
            onClick={(event) => {
              event.stopPropagation()//阻止冒泡
              confirm({
                title: '确定切换企业并刷新',
                mask:false,
                icon: <ExclamationCircleOutlined />,
                content: '请确保你的工作台应用已经被妥善保存。刷新后，已打开的页面不在保留',
                cancelText: '取消',
                okText: '刷新',
                onOk () {
                  switchEnterprise(item.cid).then(data => {
                    if (data) {
                      const {user} = getStore(USERINFO)
                      // 卸载之前的
                      webviewRef?.unmount()
                      setContacyInfo(user)
                      // 重新创建
                      createWebView(true)
                    }
                  })
                }
              })
            }}
            key={item.cid}>
            <div className={styles.depaImgBox}>
              {item.avatar ?
                <Image src={item.avatar} width={24} height={24}/>
                :
                <Icon type="yp-zuzhijiagou" size={15} color="#fff"/>
              }
            </div>
            <p>{item.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default connect((state) => {
  return {isMaximize: state.config.isMaximize}
})(Workbench)

