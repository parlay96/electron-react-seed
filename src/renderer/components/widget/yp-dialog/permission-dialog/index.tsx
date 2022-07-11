/*
 * @Date: 2022-07-05 13:50:22
 * @Description: 权限配置弹窗
 */
import React from 'react'
import { DialogProps } from '../../Dialog'
import withDialog, { WrapperComponentProps } from '../withDialogProps'
import FooterButton from '../../dialog/footer-button'
import styles from './index.module.scss'

export type IPermissionPopupProps = {
  // onClose?: () => void
} & WrapperComponentProps & DialogProps

/** 权限配置弹窗 */
const PermissionPopup = (props: IPermissionPopupProps) => {
  const onCancel = async () => {
    try {
      console.log(1234)
    } catch {}
  }

  const onConfirm = async () => {
    try {
      console.log(321)
    } catch {}
  }
  return (
    <>
      <div className={styles.permissionPopup}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </div>
      {/* 底部 */}
      <FooterButton
        cancelButtonText={'取消'}
        confirmButtonText={'确定'}
        onCancel={onCancel}
        onConfirm={onConfirm}/>
    </>
  )
}

export default withDialog(PermissionPopup, { width: 770, visibleFooter: false })
