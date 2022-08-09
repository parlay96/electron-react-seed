/*
 * @Date: 2022-07-28 10:49:36
 * @Description: 账号密码登录
 */
import React, { useRef, useState } from 'react'
import { Button, Form, Input, Checkbox, Col, Row } from 'antd'
import { useAuth } from '@/auth'
import { request } from '@/utils'
import styles from './index.module.scss'

export interface IAppProps {
  next: () => void
}

const Phone = (props: IAppProps) => {
  const auth = useAuth()
  /** 是否自动登录 */
  const isAuto = useRef(true)
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
    auth.signIn(async () => {
      const { data } = await request["POST/auth/pwd-login"](values)
      /** 设置自动登录 */
      return isAuto.current ? {...data, autoLogin: true} : data
    })
  }

  /** 下方选项 */
  const onCheckChange = (key) => {
    isAuto.current = key.indexOf('auto') !== -1
  }

  /** 点击忘记密码 */
  const onForget = () => {
    props.next()
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
          <Input maxLength={11} placeholder="请输入你的手机号" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            type="password"
            placeholder="请输入密码"
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
          <Col span={12} className={styles['login-form-radio']}>
            <Checkbox value="auto">15天内自动登录</Checkbox>
          </Col>
          <Col span={12}>
            <div className={styles.text} onClick={onForget}>忘记密码</div>
          </Col>
        </Row>
      </Checkbox.Group>
    </>
  )
}

export default Phone
