/*
 * @Author: pl
 * @LastEditTime: 2022-08-11 17:40:10
 * @Description: file content
 */
import React, { createRef, FC, forwardRef, RefObject, useEffect, ReactNode, useImperativeHandle, useState, useCallback } from 'react'
import { renderToBody } from '@/utils'
import Dialog, { DialogCloseType, DialogProps } from "../dialog"

export type DialogRefType = {
  close: () => void
  show: () => void,
  setTitle?: (v: string) => void
}

export type WrapperComponentProps = {
  dialogRef?: RefObject<DialogRefType>
}

/**
 * @name 自定义弹框高阶函数
 */
function withDialog<T> (Component: FC<WrapperComponentProps & T>, props?: Partial<DialogProps>) {
  return (options?: DialogProps & T): DialogRefType => {
    const wrapRef = createRef<DialogRefType>()
    const Wrapper = forwardRef<DialogRefType, any>((_, ref) => {
      const [_visible, setVisibleState] = useState<boolean>(false)
      // 动态设置title
      const [ title, setTitle ] = useState<ReactNode>(props.title || options.title)
      const { children } = _

      useEffect(() => {
        setVisibleState(true)
      }, [])

      useImperativeHandle(ref,
        () => ({
          close: onClose,
          show: async () => {
            setVisibleState(true)
          },
          setTitle: async (val) => {
            setTitle(val)
          }
        })
      )
      const onClose = useCallback(async (payload?: DialogCloseType) => {
        console.log('onClose', '关闭')
        await options?.onClose?.(payload)
        setVisibleState(false)
        if(props?.closeUnmount || options?.closeUnmount)  {
          setTimeout(() => unmount?.(), 1000)
        }
      }, [props?.closeUnmount, options?.closeUnmount])

      return (
        <Dialog
          {...props}
          {...options}
          title={title}
          visible={_visible}
          onClose={onClose}
        >
          {children}
        </Dialog>
      )
    })

    const unmount = renderToBody(
      <Wrapper ref={wrapRef}>
        <Component dialogRef={wrapRef} {...options as T}></Component>
      </Wrapper>
    )

    return {
      close: () => {
        wrapRef.current?.close()
      },
      show: () => {
        wrapRef.current?.show()
      }
    }
  }
}

export default withDialog
