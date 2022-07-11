/*
 * @Date: 2022-07-05 14:34:55
 * @Description: file content
 */
import type { ReactElement } from "react"
import { createPortal } from "react-dom"
import { createRoot } from 'react-dom/client'

/** @description 根据id获取dom节点 */
export const getEleById = (id: string) => {
  return document?.getElementById(id)
}

/** @description 判断是否在服务端 */
export const checkServer = () => typeof window === "undefined"


/** @name 判断是否是IE浏览器 */
export const isIEBrowser = (): boolean => {
  if (checkServer()) return false
  return navigator.userAgent.toLowerCase().indexOf("trident") > -1 ? true : false
}

export type GetContainer = HTMLElement | (() => HTMLElement) | null

export function resolveContainer (getContainer: HTMLElement | (() => HTMLElement) | undefined) {
  const container = typeof getContainer === "function" ? getContainer() : getContainer
  return container || (!checkServer ? window.document.body : undefined)
}

export function renderToContainer (getContainer: GetContainer, node: ReactElement) {
  if (getContainer) {
    const container = resolveContainer(getContainer)
    return createPortal(node, container!)
  }
  return node
}

export function renderToBody (element: ReactElement) {
  if (checkServer()) return
  const container = document.createElement("div")
  const root = createRoot(container)
  document.body.appendChild(container)
  function unmount () {
    root.unmount()
  }
  root.render(element)
  return unmount
}

