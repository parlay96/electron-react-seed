/*
 * @Date: 2022-07-29 15:33:21
 * @Description: 获取验证码
 */
import React, {useEffect, useState} from 'react'
import { message } from 'antd'
import { isPhone, request } from '@/utils'
import styles from './index.module.scss'
import classNames from "classnames"

export interface ICodeProps {
  tel: string;
}

export default function Code (props: ICodeProps) {
  const { tel } = props
  const [text] = useState('获取验证码')
  const [time, setTime] = useState(0)
  let timer = null

  useEffect(() => {
    // 倒计时
    return clearInterval(timer)
  }, [])

  const countdown = (time) => {
    timer = setTimeout(() => {
      setTime(time)
      if (time > 0) {
        countdown(time - 1)
      }
    }, 1000)
  }

  const onClick = async () => {
    if (!isPhone(tel)) {
      message.warn('请输入正确的手机号')
      return
    }

    const {data} = await request["POST/home/tel-code"]({
      tel,
      code_type: 'login'
    })
    setTime(data.time)
    countdown(data.time - 1)
  }
  return (
    <>
      {
        time ?
          <div className={classNames(styles.disable, styles.font)}>{time}s后重新获取</div> :
          <a onClick={onClick}>
            <span className={styles.font}>{text}</span>
          </a>
      }
    </>
  )
}
