/*
 * @Date: 2022-09-16 15:44:39
 * @Description: 对话消息列表
 */
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import * as ReactDOMServer from 'react-dom/server'
import classNames from 'classnames'
import { Image } from '@/components'
import { api, ImUtils } from '@/im'
import type { IconvType, IChatType } from '@/im/type'
import { filterChatData, handleConvListUnread } from '../../utils'
import styles from './index.module.scss'

export interface IChatListRef {
  updateChat: (v?: any) => void
}

const pageSize = 20 // 条数
let pages = 1 // 页码
let timerUnread = null // 定时器
let oldInfo = null // 当前对话人的信息
let isRequesting = false // 是否正在请求中

const fragment = new DocumentFragment() // 文档碎片
let firstChildNode = null // 聊天列表的第一个子节点

// 对话消息列表
const ChatList = forwardRef<IChatListRef, {convId: string}>((props, ref) => {
  const { convId } = props
  // 用于操作聊天列表元素的引用
  const chatListBoxRef = useRef(null)
  // 暂无更多数据
  const isNoMore = useRef<boolean>(false)

  // 切换对话初始化
  useEffect(() => {
    // 清空聊天列表
    if (chatListBoxRef.current) {
      chatListBoxRef.current.innerHTML = ''
    }
    if (!convId) {
      // 置空聊天列表信息
      isRequesting = false
      return
    }
    // 切换聊天时初始化
    pages = 1
    isRequesting = true
    isNoMore.current = false
    // 获取对话消息记录列表
    getConvRecord()

    return () => {
      clearTimeout(timerUnread)
    }
  }, [convId])

  // 暴露更新聊天记录的方法，给父组件调用
  useImperativeHandle(ref,() => ({
    updateChat: async (msg) => {
      // 收到消息，不可以使用oldInfo，需要重新去获取一次，因为可能需要情况未读数，未读数可能发生变化了
      const info = await getConvInfo()
      // 处理数据
      const newChatData = await filterChatData([msg])
      // 渲染数据
      buildFragment(newChatData, true)
      clearTimeout(timerUnread)
      // 延迟清空下，给人感觉到有新消息出现
      timerUnread = setTimeout(() => {
        // 清空未读数
        info && handleConvListUnread(info)
      }, 500)
    }
  }))


  // 获取当前对话用户 || 群的历史消息
  const getHistoryMessages = async (info: Partial<IconvType>) => {
    // 无更多数据
    if (isNoMore.current) return
    // 获取聊天消息列表
    const data = await api.message.fetchHistoryMessages({
      queue: info.id,
      count: pageSize,
      isGroup: info.type == 'group'
    })
    console.time('过滤会话记录渲染耗时')
    // 处理数据
    const chatData = await filterChatData(data)
    console.timeEnd('过滤会话记录渲染耗时')
    // 代表无更多数据
    isNoMore.current = chatData?.length < pageSize
    // 代表无数据，无数据直接结束 加载状态。 有数据必须等渲染数据完毕，才设置为true
    if (pages == 1 && chatData.length == 0) {
      isRequesting = true
      return
    }
    // 渲染数据
    buildFragment(chatData)
  }

  // 根据会话id，获取会话信息
  const getConvInfo = async () => {
    // 获取历史
    const oldData = await ImUtils.getOldConvData()
    // 找出来当前会话选项信息
    return oldData?.find(item => item.id == convId)
  }

  // 获取对话用户 || 群的记录
  const getConvRecord = async () => {
    // 找出来当前会话选项信息
    const info = await getConvInfo()
    if (info) {
      // 备份
      oldInfo = info
      // 初次加载就去情况掉查询条件
      api.message.resetMessages()
      // 获取历史聊天记录
      await getHistoryMessages(info)
      // 清空未读数
      await handleConvListUnread(info)
    }
  }

  // 渲染消息内容
  const magConTentRender = (item: IChatType) => {
    if (item?.contentsType == 'text') {
      return (
        <div className={styles['message-text-box']}>
          <div className={styles['message-text']}><pre dangerouslySetInnerHTML={{__html: item.msg}} /></div>
        </div>
      )
    }
    if (item?.contentsType == 'img') {
      return (
        <div className={styles['message-img-box']}>
          <Image src={item.msg} className={styles['message-img']}/>
        </div>
      )
    }
    return (
      <div className={styles['message-text-box']}>
        <div className={styles['message-text']}><pre dangerouslySetInnerHTML={{__html: item.msg}} /></div>
      </div>
    )
  }

  // 渲染消息块区域
  const messageItemWrapper = (items: IChatType) => {
    // 获取最新头像，保存一致性
    const item = ImUtils.getImUserInfo(items)
    const isSelf = item.isSelf // 是否自己发送的消息
    const isGroup = item.isGroup // 是否群聊
    return (
      <div className={ classNames(styles.msgItemBox, isSelf ? styles['self-msg'] : '')}>
        <div className={styles['message-left']}>
          <div className={styles['message-avatar']}>
            {/* 没有头像 */}
            {!item?.avatar &&
              <div className={classNames(styles['larkc-avatar'], styles.portraitText, 'unselectable')}>{item?.portraitName}</div>
            }
            {/* 有头像 */}
            {item?.avatar &&
            <Image
              // robot为true代表是机器人，就引入本地图标
              src={item.robot ? require(`@/assets/imgs/${item.avatar}`) : item.avatar}
              className={classNames(styles['larkc-avatar'], 'unselectable')}
              width={34}
              height={34} />
            }
          </div>
        </div>
        <div className={styles['message-right']}>
          {/* 单聊 */}
          {!isGroup &&
            <div className={classNames(styles['message-info'], styles['p2pChat'])}>
              <span className={styles['message-timestamp']}>{item.time}</span>
            </div>
          }
          {/* 群聊 */}
          {isGroup &&
            <div className={classNames(styles['message-info'], isSelf ? styles['self-msg-info'] : '')}>
              <span className={styles['message-info-name']}>
                {item?.userName}
              </span>
              <span className={styles['message-timestamp']}>{item.time}</span>
            </div>
          }
          <div className={styles['message-section']}>
            { magConTentRender(item) }
          </div>
        </div>
      </div>
    )
  }

  // 聊天列表滚动，加载下一页
  const handleOnScroll = (e) => {
    const current = chatListBoxRef.current
    if (current) {
      const contentScrollTop = current.scrollTop
      // 必须：oldInfo && Top小于10 && pages不是第一页 && 正在执行请求不可触发 && 还有数据
      if (oldInfo && contentScrollTop < 10 && pages !== 1 && isRequesting && !isNoMore.current) {
        // 标记正在请求
        isRequesting = false
        getHistoryMessages(oldInfo)
      }
    }
  }

  /**
   * @创建节点碎片
   * 1.只有这样渲染才不闪动
   * 2.不使用useState去保存chatData还有好处是，如果chatData数据量大，切换会话，会导致卡顿
   * 3.渲染会话消息速度提升
   * @param {*} chatData 聊天数据
   * @param isUpdateFlag 是否收到消息
   */
  const buildFragment = (chatData: IChatType[], isUpdateFlag?: boolean) => {
    console.time('会话记录渲染耗时')
    // 消息列表的盒子
    const chatListBox = chatListBoxRef.current
    // 消息碎片节点容器
    const container = document.createElement('div')
    // 遍历消息
    chatData.forEach((items: IChatType) => {
      // 返回一个React 元素
      const node = messageItemWrapper(items)
      // 将一个 React 元素渲染成其初始的 HTML。React 将返回一个 HTML 字符串
      const msgHtmlStr = ReactDOMServer.renderToString(node)
      // 把消息字符串dom。转成真实dom
      container.innerHTML = msgHtmlStr
      // 添加第一个子节点，因为这才是我们想要得，没必要多包一次容器
      container?.firstChild && fragment.appendChild(container?.firstChild)
    })

    // 如果是第一页，或者收到消息，插入到尾部，滚动到尾部
    if (pages == 1 || isUpdateFlag) {
      // 插入节点
      chatListBox.insertBefore(fragment, null)
      // 滚动节点
      chatListBox.scrollTop = 1000000
    } else {
      // 插入节点
      chatListBox.insertBefore(fragment, firstChildNode)
      // 滚动节点
      firstChildNode?.scrollIntoView()
    }

    // 把会话列表中的第一个节点存起来
    if (chatListBox?.firstChild) {
      firstChildNode = chatListBox?.firstChild
    }

    // 标记结束
    isRequesting = true
    // 页码加1
    if (!isUpdateFlag) {
      pages = pages + 1
    }
    console.timeEnd('会话记录渲染耗时')
  }

  // 创建 | 删除 加载中的节点
  const createLoadNode = (show: boolean) => {

  }

  return (
    <div
      className={styles['content-pannel-body']}
      ref={chatListBoxRef}
      onScrollCapture={(e) => handleOnScroll(e)}
    />
  )
})

export default ChatList
