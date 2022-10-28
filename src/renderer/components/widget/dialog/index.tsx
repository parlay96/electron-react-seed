/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 17:11:50
 * @Description: Dialog弹窗
 */

import React, { ReactNode } from "react"
import classNames from "classnames"
import { Icon, Visible } from "@/components"
import FooterButton from './footer-button'
import Mask, { IMaskProps } from "./mask"
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
  /** 挂载容器 默认dom */
  getContainer?: GetContainer

  /** 弹框层样式 */
  containerStyle?: React.CSSProperties
  /** 弹框层class */
  containerClassName?: string

  /** wrap样式 */
  style?: React.CSSProperties
  wrapClassName?: string

  /** 内容区样式 */
  bodyStyle?: React.CSSProperties
  /** 内容区class */
  bodyClassName?: string

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

  /** 点击底部按钮 || 点击顶部关闭图标按钮 是否立即卸载弹窗 */
  closeUnmount?: boolean
  // 点击底部按钮 || 点击顶部关闭图标按钮。会触发关闭弹窗，----afterClose是关闭弹窗消失事件
  onClose?: (v?: DialogCloseType) => | Promise<void>
  // 点击取消按钮事件，这个事件在底部按钮节点触发的，----afterClose是关闭弹窗消失事件
  onCancel?: () => void | Promise<void>
  // 点击确认按钮时事件，这个事件在底部按钮节点触发的，----afterClose是关闭弹窗消失事件
  onConfirm?: (v: any) => void | Promise<void>
} & IMaskProps

// Dialog弹窗
const Dialog = (props: DialogProps) => {
  const wrapStyle = { ...props?.style, width: `${props?.width}px` }

  return (
    <Mask
      zIndex={props?.zIndex}
      visible={props?.visible}
      disableMouse={props?.disableMouse}
      getContainer={props?.getContainer}
      appear={props?.appear}
      exit={props?.exit}
      maskClick={() => props?.maskClick?.()}
      afterClose={() => props?.afterClose?.()}
      style={props?.containerStyle}
      className={props?.containerClassName}
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
          <div className={styles[`${classPrefix}-close`]} onClick={() => props.onClose?.()}>
            <Icon className={styles[`${classPrefix}-close-icon`]} type="yp-close" size={24} />
          </div>
        </Visible>
      </div>
    </Mask>
  )
}

Dialog.defaultProps = {
  title: "温馨提示",
  cancelButtonText: "取消",
  confirmButtonText: "确定",
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
