/*
 * @Date: 2022-05-30 10:55:45
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Modal, Progress, message } from 'antd'
import { Head, Menu } from '@/components'
import { $ipc } from '@/utils'

import styles from './index.module.scss'

const { confirm } = Modal

const Layout= () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [percentage, setPercentage] = useState<number>(0)
  useEffect(() => {
    // 自动检测更新
    $ipc.invoke("check-update")
    // 监听更新
    $ipc.on('update-msg', (event, arg) => {
      switch (arg.state) {
      case -1:
        message.error(arg.msg, 3000)
        setModalVisible(false)
        break
      case 1:
        confirm({
          title: '提示',
          content: '检查到有新版本，是否更新?',
          centered: true,
          cancelText: '取消',
          okText: '确认',
          onOk () {
            setModalVisible(true)
            $ipc.invoke("confirm-downloadUpdate")
          },
          onCancel () {
            // 点击取消就记住选择，下次不在自动检查更新
            console.log('Cancel')
          },
        })
        break
      case 3:
        setPercentage(arg.msg.percent.toFixed(1))
        break
      case 4:
        setTimeout(() => {
          setModalVisible(false)
          confirm({
            title: '提示',
            content: '下载完成，是否安装',
            cancelText: '取消',
            okText: '确认',
            centered: true,
            onOk () {
              $ipc.invoke("confirm-update")
            },
            onCancel () {
              console.log('Cancel')
            },
          })
        }, 500)
        break
      default:
        break
      }
    })
  }, [])
  return (
    <div className={styles.ypContainer}>
      {/* 头部 */}
      { !process.env.IS_WEB && <Head /> }
      <div className={styles.ypMain}>
        {/* 左侧菜单 */}
        <Menu />
        {/* 页面内容部分， 是比较关注的部分 */}
        <div className={styles.pannelBox}>
          <Outlet />
        </div>
      </div>
      {/* 更新应用弹窗 */}
      <Modal
        title="下载进度"
        visible={isModalVisible}
        centered
        closable={false}
        footer={null}>
        <Progress percent={percentage} status="active" />
      </Modal>
    </div>
  )
}

export default Layout
