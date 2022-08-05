/*
 * @Date: 2022-07-05 09:25:02
 * @Description: 全局Dialog弹窗封装
 */

import React, { forwardRef, ReactNode } from "react"
import classNames from "classnames"
import { Icon, Visible } from "@/components"
import FooterButton from './footer-button'
import Mask, { MaskProps } from "./mask"
import { GetContainer } from "@/utils"
import styles from "./index.module.scss"

const classPrefix = `yp-dialog`

export type DialogCloseType = {
  /** 弹框按钮点击关闭状态 */
  status: 'confim' | 'cancel'
}

export type DialogProps = {
  /** 标题 */
  title?: ReactNode
  /** 控制显隐 */
  visible?: boolean
  /** 层级 */
  zIndex?: number
  /** 宽度 */
  width?: string | number
  /** 点击遮罩是否关闭 默认不可关闭 */
  maskClosable?: boolean
  /** 挂载容器 默认dom */
  getContainer?: GetContainer
  /** wrap样式 */
  style?: React.CSSProperties
  wrapClassName?: string
  /** 主容器样式 */
  bodyStyle?: React.CSSProperties
  /** 主容器class */
  bodyClassName?: string
  /** 弹框层样式 */
  containerStyle?: React.CSSProperties
  /** 遮罩层class */
  maskClassName?: string
  /** 取消按钮自定义描述 */
  cancelButtonText?: string
  /** 确认按钮自定义描述 */
  confirmButtonText?: string
  /** 是否隐藏取消按钮 */
  hideCancelButton?: boolean
  /** 是否隐藏确认按钮 */
  hideConfirmButton?: boolean
  /** 点击确认按钮是否关闭弹框 */
  confimButtonClose?: boolean
  /** 点击取消按钮是否关闭弹框 */
  cancelButtonClose?: boolean
  /** 弹框按钮是否可关闭 */
  clickButtonClose?: boolean
  /** 是否显示关闭icon */
  showCloseIcon?: boolean
  /** 是否显示header */
  visibleHeader?: boolean
  /** 是否显示footer */
  visibleFooter?: boolean
  /** footer button 展示方向 */
  footerLayout?: 'left' | 'right'
  /** 自定义内容区 默认为空 */
  children?: ReactNode
  onClose?: (payload?: DialogCloseType) => any
  onCancel?: () => void | Promise<void>
  onConfirm?: (v: any) => void | Promise<void>
  /** 关闭容器是否立即卸载 */
  closeUnmount?: boolean
} & MaskProps

// 全局Dialog弹窗封装
const Dialog = forwardRef((props: DialogProps, ref: any) => {
  const wrapStyle = { ...props?.style, width: `${props?.width}px` }

  const onCloseIcon = async () => {
    try {
      await props.onClose?.()
    } catch {}
  }

  return (
    <div className={styles[classPrefix]} ref={ref}>
      <Mask
        zIndex={props?.zIndex}
        visible={props?.visible}
        disableMouse={props?.disableMouse}
        getContainer={props?.getContainer}
        appear={props?.appear}
        exit={props?.exit}
        onMaskClick={props?.maskClosable ? props.onClose : undefined}
        style={props?.containerStyle}
        className={props?.maskClassName}
      >
        <div className={classNames(styles[`${classPrefix}-wrap`], props.wrapClassName)} style={wrapStyle}>
          {/** 顶部 */}
          <Visible visible={props.visibleHeader}>
            <div className={styles[`${classPrefix}-header`]}>
              <div className={styles[`${classPrefix}-header-title`]}>{ props.title }</div>
            </div>
          </Visible>
          {/** 内容区 */}
          <Visible visible={props.children}>
            <div className={classNames(styles[`${classPrefix}-body`], props.bodyClassName)} style={props.bodyStyle}>
              {props.children}
            </div>
          </Visible>
          {/** 底部按钮 */}
          <Visible visible={props.visibleFooter}>
            <FooterButton {...props}/>
          </Visible>
          {/** close icon */}
          <Visible visible={props.showCloseIcon}>
            <div className={styles[`${classPrefix}-close`]} onClick={onCloseIcon}>
              <Icon className={styles[`${classPrefix}-close-icon`]} type="yp-close" size={24} />
            </div>
          </Visible>
        </div>
      </Mask>
    </div>
  )
})

Dialog.defaultProps = {
  title: "温馨提示",
  cancelButtonText: "取消",
  confirmButtonText: "确定",
  maskClosable: false,
  clickButtonClose: true,
  cancelButtonClose: true,
  confimButtonClose: true,
  showCloseIcon: true,
  visibleHeader: true,
  visibleFooter: true,
  width: 560,
  footerLayout: 'right',
}

export default Dialog
