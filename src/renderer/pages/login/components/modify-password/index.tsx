/*
 * @Date: 2022-07-28 10:49:36
 * @Description: 修改密码
 */
import React, { useRef, useState } from 'react'
import { Button, Form, Input, Checkbox, Col, Row } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useAuth } from '@/auth'
import { request } from '@/utils'
import styles from './index.module.scss'

export interface IAppProps {
  tel: string
}

const Phone = (props: IAppProps) => {
  const auth = useAuth()
  /** 是否自动登录 */
  const isAuto = useRef(true)
  const onFinish = (values) => {
    const params = {...values, tel: props.tel}
    auth.signIn(async () => {
      const { data } = await request["POST/auth/change-pwd-login"](params)
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
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            {
              validator: (_, value) =>
                !value ||  /^(?![\d\W]+$)(?![a-zA-Z]+$)\S{8,}$/.test(value) ? Promise.resolve() : Promise.reject(new Error('密码至少8个字符，不能全是字母或数字')),
            },
          ]}
          className={styles['first-item']}
        >
          <Input.Password
            placeholder="请输入密码"
            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="repeat_password"
          rules={[
            { required: true, message: '请再次输入密码' },
            ({ getFieldValue }) => ({
              validator (_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致!'))
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="请再次输入密码"
            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          />
        </Form.Item>
        <Form.Item className={styles.submit}>
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
        </Row>
      </Checkbox.Group>
    </>
  )
}

export default Phone
