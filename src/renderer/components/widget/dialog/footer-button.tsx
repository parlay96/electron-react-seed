/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 17:11:46
 * @Description: file content
 */
import React from "react"
import classNames from "classnames"
import { Visible } from "@/components"
import styles from "./index.module.scss"

const classPrefix = `yp-dialog`

// 创建底部按钮
const FooterButton = (props) => {
  const onCancel = async () => {
    try {
      await props.onCancel?.()
      props.clickButtonClose && props.cancelButtonClose && props.onClose?.({ status: 'cancel' })
    } catch {}
  }

  const onConfirm = async () => {
    try {
      await props.onConfirm?.()
      props.clickButtonClose && props.confimButtonClose && props.onClose?.({ status: 'confim' })
    } catch {}
  }
  return (
    <div className={styles[`${classPrefix}-footer`]} style={{ textAlign: props?.footerLayout }}>
      <Visible visible={!props.hideCancelButton}>
        <button
          type="button"
          className={classNames(styles[`${classPrefix}-btn`], styles[`${classPrefix}-footer-cancel`], styles.mr)}
          onClick={onCancel}
        >
          {props.cancelButtonText}
        </button>
      </Visible>
      <Visible visible={!props.hideConfirmButton}>
        <button
          type="button"
          className={classNames(styles[`${classPrefix}-btn`], styles[`${classPrefix}-footer-confim`])}
          onClick={onConfirm}
        >
          {props.confirmButtonText}
        </button>
      </Visible>
    </div>
  )
}

export default FooterButton
