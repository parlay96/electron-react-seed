/*
 * @Author: penglei
 * @Date: 2022-08-17 16:43:25
 * @LastEditors: penglei
 * @LastEditTime: 2022-08-23 14:35:17
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { Checkbox } from 'antd'
import classNames from 'classnames'
import { getStore, USERINFO, AutoStart, $ipc, setStore } from '@/utils'
import { REQUESTURL } from '@/config'
import { Icon, Image } from '@/components'
import styles from './index.module.scss'

// 通用
const Currency = () => {
  const [startingUp, setStartingUp] = useState(false)
  const userInfo = getStore(USERINFO)
  const defaultValue = ['1']

  useEffect(() => {
    const isStart = getStore(AutoStart)
    setStartingUp(isStart || false)
  }, [])

  const onCheckChange = (e) => {
    console.log(e)
  }

  // 开机启动
  const autoStartChange = (e) => {
    if (e.target.checked) {
      $ipc.send('openAutoStart')
    } else {
      $ipc.send('closeAutoStart')
    }
    setStartingUp(e.target.checked)
    setStore(AutoStart, e.target.checked)
  }

  return (
    <div className={classNames(styles.currencyBox, 'unselectable')}>
      <div className={styles.itemInfo}>
        <div className={styles.title}>开机自启</div>
        <p className={styles.ms}>开机自动启动鱼泡工程云</p>
        <p className={styles.cbox}><Checkbox onChange={autoStartChange} checked={ startingUp }>启动</Checkbox></p>
      </div>
      {/* <div className={styles.itemInfo} style={{marginTop: '30px'}}>
        <div className={styles.title}>通知</div>
        <p className={styles.ms}>新消息通知</p>
        <Checkbox.Group defaultValue={defaultValue} onChange={onCheckChange}>
          <p><Checkbox value="1">全部新消息</Checkbox></p>
          <p><Checkbox value="2">加急消息</Checkbox></p>
          <p><Checkbox value="3">单聊消息</Checkbox></p>
        </Checkbox.Group>
      </div> */}
    </div>
  )
}

export default Currency
