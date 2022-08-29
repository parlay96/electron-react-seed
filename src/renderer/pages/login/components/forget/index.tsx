/*
 * @Date: 2022-07-28 10:49:36
 * @Description: 忘记密码
 */
import React, { useState } from 'react'
import { Button, Form, Input, Checkbox, Col, Row } from 'antd'
import { useAuth } from '@/auth'
import { VerificationCode } from '@/components'
import { request } from '@/utils'
import styles from './index.module.scss'

export interface IAppProps {
  next: ({tel: string}) => void
}

const Phone = (props: IAppProps) => {
  const auth = useAuth()
  const [phone, setPhone] = useState('')
  const onFinish = async (values) => {
    console.log('Received values of form: ', values)
    // auth.signIn(async () => {
    //   const { data } = await request["POST/auth/code-login"](values)
    //   return data
    // })
    const params = {...values, code_type: 'forget'}
    console.log('忘记密码', params)
    await request["POST/home/sms-check-code"](params)
    props.next({tel: phone})
  }

  return (
    <>
      <Form
        name="account_login"
        className={styles['login-form']}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="tel"
          rules={[{ required: true, message: '请输入你的手机号' }]}
          className={styles['first-item']}
        >
          <Input maxLength={11} placeholder="请输入你的手机号" onChange={(e) => setPhone(e.target.value)} />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input
            type="code"
            maxLength={4}
            placeholder="请输入验证码"
            suffix={<VerificationCode tel={phone} />}
          />
        </Form.Item>
        <Form.Item className={styles.submit}>
          <Button type="primary" htmlType="submit" block className={styles['login-form-button']}>
            下一步
          </Button>
        </Form.Item>
      </Form>=
    </>
  )
}

export default Phone
