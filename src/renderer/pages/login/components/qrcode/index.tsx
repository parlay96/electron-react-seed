/*
 * @Date: 2022-08-03 09:53:45
 * @Description: 扫码登录
 */
import { getGuid, request } from '@/utils'
import React, { useLayoutEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

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
  /** 是否在请求轮训 */
  const isRotation = useRef(true)
  /** 获取guid */
  const id = useRef(getGuid())

  let timer = null

  useLayoutEffect(() => {
    initQrCode()
    return () => {
      isRotation.current = false
      timer && clearTimeout(timer)
      timer = null
    }
  }, [])

  /** 初始化二维码 */
  const initQrCode = async () => {
    /** 对比缓存时间 */
    const qrcodeImg = sessionStorage.getItem('qrcode_img')
    if (qrcodeImg) {
      if (!JSON.parse(qrcodeImg).time) {
        sessionStorage.removeItem('qrcode_img')
      } else {
        const now = dayjs().valueOf()
        const endTime = JSON.parse(qrcodeImg).time
        if (now >= endTime) {
          sessionStorage.removeItem('qrcode_img')
        }
      }
    }
    /** 重新获取缓存 */
    const _qrcodeImg = sessionStorage.getItem('qrcode_img')
    /** 有图片缓存则取缓存内容，没有则请求接口 */
    const { data } = _qrcodeImg ? JSON.parse(qrcodeImg) : await request["POST/auth/login-qr-code"]({
      guid: id.current
    })
    if (data.qrcode_img) {
      setQrCodeImg(data.qrcode_img)
      if (!_qrcodeImg) {
        sessionStorage.setItem('qrcode_img', JSON.stringify({
          data: {
            qrcode_img: data.qrcode_img,
          },
          time: dayjs().add(data.invalid_time, 'seconds').valueOf()
        }))
      }
      setLoading(false)
      isRotation.current = true
      checkQrCodeLogin()
    }
  }

  /** 检查二维码登录状态 */
  const checkQrCodeLogin = async () => {
    if (!isRotation.current) return
    const { data } = await request["POST/auth/check-qr-code-login"]({
      guid: id.current
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
      auth.signIn(async () => {
        /** 设置自动登录 */
        return isAuto.current ? {...data.user_data, autoLogin: true} : data.user_data
      }, () => {
        setQrCodeStatus('waiting')
        initQrCode()
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
