/*
 * @Date: 2022-07-27 15:51:31
 * @Description:
 */
import React, { useRef, useState } from "react"
import { Tabs } from "antd"
import classNames from "classnames"
import {DragBox} from '@/components'
import Phone from "./components/Phone"
import Account from "./components/account"
import QrCode from "./components/qrcode"
import ModifyPassword from "./components/modify-password"
import Forget from "./components/forget"
import styles from "./index.module.scss"
import qrCodeIcon from "@/assets/imgs/qrcode.png"
import accountIcon from "@/assets/imgs/account.png"

const { TabPane } = Tabs
export interface ILoginProps {}

const Login = (props: ILoginProps) => {
  const cardType = useRef(1)
  const [step, setStep] = useState(0)
  const [img, setImg] = useState(qrCodeIcon)
  const [forgetTel, setForgetTel] = useState("")
  const [tab, setTab] = useState('1')
  /** 切换tab */
  const onChange = (key: string) => {
    setTab(key)
  }

  /** 点击右上角切换图片 */
  const onChangeImg = () => {
    cardType.current = cardType.current === 1 ? 2 : 1
    setImg(cardType.current === 1 ? qrCodeIcon : accountIcon)
    setStep(0)
  }

  /** 点击忘记密码 */
  const onForget = () => {
    setStep(1)
  }

  /** 跳转到忘记密码 */
  const onModify = ({tel}) => {
    setStep(2)
    setForgetTel(tel)
  }

  /** 返回 */
  const onBack = () => {
    const _step = step - 1
    setStep(_step)
  }

  const normalLogin = () =>
    cardType.current === 1 ? <>
      <div className={classNames(styles.title, styles.marginTop100)}>欢迎使用工程云</div>
      <Tabs defaultActiveKey={tab} onChange={onChange}>
        <TabPane tab="手机号" key="1">
          <Phone />
        </TabPane>
        <TabPane tab="账号密码" key="2">
          <Account next={onForget} />
        </TabPane>
      </Tabs>
    </> : <>
      <div className={classNames(styles.title, styles.center, styles.marginTop100)}>
        欢迎使用工程云
      </div>
      <div className={classNames(styles.text, styles.center)}>
        请使用鱼泡工程云移动端扫描二维码
      </div>
      <QrCode />
    </>


  const forgetLogin = () =>
    step == 1 ? <>
      <div className={styles.back} onClick={onBack}>
        <img className={styles['back-img']} src={require("@/assets/imgs/back-icon.png")} alt="" />
        <span className={styles['back-text']}>
          返回
        </span>
      </div>
      <div className={classNames(styles.title, styles.center, styles['space-forget'])}>
        忘记密码
      </div>
      <Forget next={onModify} />
    </> : <>
      <div className={styles.back} onClick={onBack}>
        <img className={styles['back-img']} src={require("@/assets/imgs/back-icon.png")} alt="" />
        <span className={styles['back-text']}>
          返回
        </span>
      </div>
      <div className={classNames(styles.title, styles.center, styles.marginTop40)}>
        重置密码
      </div>
      <div className={classNames(styles['text-modify'], styles.center, styles['space-modify'])}>
        至少8个字符，不能全是字母和数字
      </div>
      <ModifyPassword tel={forgetTel} />
    </>

  return (
    <div className={styles.loginBox}>
      <DragBox className={styles.logindrag} btnStyle={{color: '#606066'}}/>
      <div className={styles["login-panel"]}>
        <div className={styles["login-card"]}>
          <div className={styles.image} onClick={onChangeImg}>
            <img className={styles.icon} src={img} />
          </div>
          {step === 0 ? normalLogin() : forgetLogin()}
        </div>
      </div>
    </div>
  )
}

export default Login
