/*
 * @Date: 2022-08-03 09:53:45
 * @Description: 扫码登录
 */
import { request } from '@/utils'
import React, { useLayoutEffect, useRef, useState } from 'react'
import {machineIdSync} from 'node-machine-id'

import styles from './index.module.scss'
import { Button, Spin, Checkbox, Col, Row } from 'antd'
import { useAuth } from '@/auth'

export interface IQrcodeProps {}

export default function Qrcode (props: IQrcodeProps) {
  const auth = useAuth()
  const [loading, setLoading] = useState(true)
  const [qrCodeImg, setQrCodeImg] = useState('')
  const [qrCodeStatus, setQrCodeStatus] = useState('waiting')
  /** 是否自动登录 */
  const isAuto = useRef(true)

  let timer = null

  useLayoutEffect(() => {
    initQrCode()
    return () => {
      timer && clearTimeout(timer)
    }
  }, [])

  const initQrCode = async () => {
    const id = machineIdSync(true)
    const { data } = await request["POST/auth/login-qr-code"]({
      guid: id
    })
    if (data.qrcode_img) {
      setQrCodeImg(data.qrcode_img)
      setLoading(false)
      checkQrCodeLogin()
    }
  }

  /** 检查二维码登录状态 */
  const checkQrCodeLogin = async () => {
    const id = machineIdSync(true)
    const { data } = await request["POST/auth/check-qr-code-login"]({
      guid: id
    }).catch(() => {
      timer = setTimeout(() => {
        checkQrCodeLogin()
      }, 1500)
    })
    if (data.qrcode_img_status == 'waiting') {
      timer = setTimeout(() => {
        checkQrCodeLogin()
      }, 1500)
    } else if (data.qrcode_img_status == 'logged') {
      clearTimeout(timer)
      auth.signIn(async () => {
        /** 设置自动登录 */
        return isAuto.current ? {...data.user_data, autoLogin: true} : data.user_data
      })
    } else if (data.qrcode_img_status == 'failed') {
      clearTimeout(timer)
      setQrCodeStatus('failed')
    }
  }

  /** 按钮刷新 */
  const onRefresh = () => {
    setQrCodeStatus('waiting')
    initQrCode()
  }

  /** 下方选项 */
  const onCheckChange = (key) => {
    isAuto.current = key.indexOf('auto') !== -1
  }

  return (
    <div className={styles.card}>
      {loading ? <Spin className={styles.center} /> : <img className={styles.img} src={qrCodeImg} alt="" />}
      {qrCodeStatus === 'failed' ?
        <>
          <div className={styles['fail-mask']}></div>
          <div className={styles['fail-card']}>
            <p className={styles['err-cont']}>二维码已失效</p>
            <Button type="primary" className={styles['refresh-btn']} onClick={onRefresh}>
              刷新
            </Button>
          </div>
        </> :
        null
      }
      <Checkbox.Group style={{ width: '100%' }} defaultValue={['auto']} onChange={onCheckChange}>
        <Row>
          <Col span={24} className={styles['login-form-radio']}>
            <Checkbox value="auto">15天内自动登录</Checkbox>
          </Col>
          {/* <Col span={24} className={styles['login-form-radio']}>
            <Checkbox value="B">B</Checkbox>
          </Col> */}
        </Row>
      </Checkbox.Group>
    </div>
  )
}
