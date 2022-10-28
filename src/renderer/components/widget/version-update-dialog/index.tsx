/*
 * @Date: 2022-10-27 14:41:59
 * @Description: 版本更新弹窗
*/

import React, { useEffect, useState, memo } from 'react'
import { Button, Progress, message } from 'antd'
import { $ipc } from '@/utils'
import { Mask } from '@/components'
import styles from './index.module.scss'


/** 版本更新弹窗 */
const VersionUpdateDialog = memo(() => {
  const [visible, setVisible] = useState<boolean>(false)
  // 进度条
  const [percentage, setPercentage] = useState<number>(0)
  // 当前状态，代表下载完成
  const [state, setNum] = useState<number>(0)

  // 发现新版本，获取版本信息
  const getVersionInfo = (version) => {
    setVisible(true)
    console.log(version, 1)
  }

  useEffect(() => {
    // 自动检测更新
    $ipc.invoke("check-update")
    // 监听更新
    $ipc.on('update-msg', (event, arg) => {
      switch (arg.state) {
      case -1:
        message.error(arg.msg, 3000)
        setVisible(false)
        break
      case 1:
        getVersionInfo(arg.msg.version)
        break
      case 3:
        setPercentage(arg.msg.percent.toFixed(1))
        break
      case 4:
        setNum(1)
        // 如果进度条没有值，就直接走到了这里，代表我可能已经下载了文件，就不会触发3，只是没有安装，我们就直接设置为百分百
        if (percentage == 0) {
          setPercentage(100)
        }
        break
      default:
        break
      }
    })
  }, [])

  return (
    <>
      <Mask
        visible={visible}
        style={{top: '45%'}}
        zIndex={1001}>
        <div className={styles['update-box']}>
          <div className={styles['head-box']}>
           发布新版本哦~
          </div>
          <div className={styles['content-box']}>
            <p>升级的新版本号：4.2.1</p>
            <p>1、新版本更新文案</p>
            <p>2、优化其他体验和性能问题升级的新版本号：4.2.1</p>
          </div>
          <div className={styles['footer-box']}>
            {percentage > 0 &&
            <div className={styles['bar-box']}>
              <Progress percent={percentage} status="active" />
            </div>
            }
            <div className={styles['btn-box']}>
              <Button onClick={() => setVisible(false)}>关闭</Button>
              {state == 1 && <Button type="primary" onClick={() => $ipc.invoke("confirm-update")}>安装</Button>}
              {state == 0 && <Button type="primary" onClick={() => $ipc.invoke("confirm-downloadUpdate")}>确认更新</Button>}
            </div>
          </div>
        </div>
      </Mask>
    </>
  )
})

export default VersionUpdateDialog
