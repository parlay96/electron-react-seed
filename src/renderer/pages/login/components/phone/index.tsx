/*
 * @Date: 2022-07-28 10:49:36
 * @Description: 手机号码登录
 */
import React, { useRef, useState } from 'react'
import { Button, Form, Input, Checkbox, Col, Row } from 'antd'
import { useAuth } from '@/auth'
import { VerificationCode } from '@/components'
import { request } from '@/utils'
import styles from './index.module.scss'

export interface IAppProps {}

const Phone = (props: IAppProps) => {
  const auth = useAuth()
  const [phone, setPhone] = useState('')
  /** 是否自动登录 */
  const isAuto = useRef(true)
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
    auth.signIn(async () => {
      const { data } = await request["POST/auth/code-login"](values)
      /** 设置自动登录 */
      return isAuto.current ? {...data, autoLogin: true} : data
    })
  }

  /** 下方选项 */
  const onCheckChange = (key) => {
    isAuto.current = key.indexOf('auto') !== -1
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
          <Input placeholder="请输入你的手机号" onChange={(e) => setPhone(e.target.value)} />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input
            type="code"
            maxLength={6}
            placeholder="请输入验证码"
            suffix={<VerificationCode tel={phone} />}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block className={styles['login-form-button']}>
          登录
          </Button>
        </Form.Item>
      </Form>
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
    </>
  )
}

export default Phone
