/*
 * @Date: 2022-09-16 15:44:39
 * @Description: 聊天列表
 */
import React, { useState, useEffect, Fragment, useRef, forwardRef, useImperativeHandle } from "react"
import classNames from 'classnames'
import { Image } from '@/components'
import { api, ImUtils } from '@/im'
import type { IconvType, IChatType } from '@/im/type'
import { filterChatData, handleConvListUnread } from '../../utils'
import styles from './index.module.scss'

interface IChatList {
  // 会话ID
  convId: string
}
export interface IChatListRef {
  updateChat: (v?: any) => void
}

let pages = 1 // 页码
const pageSize = 20 // 条数
let timer = null // 定时器
let isUpdateFlag = false // 是否收到消息
let lastHeight = 0 // 当前聊天内容的高度，用来做加载下页，需要滚动到的位置

// 聊天列表
const ChatList = forwardRef<IChatListRef, IChatList>((props, ref) => {
  const { convId } = props
  // 用于操作聊天列表元素的引用
  const chatListBoxRef = useRef(null)
  // 当前会话历史数据
  const [chatListData, setChatList] = useState<Partial<IChatType[]>>([])
  // 暂无更多数据
  const [isNoMore, setNoMore] = useState<boolean>(false)
  // 加载状态：避免闪动，必须等到滚动完毕，才设置为true（特别的关键）
  const [isLoad, setLoad] = useState<boolean>(false)

  // 获取当前对话用户 || 群的历史消息
  const getHistoryMessages = async (info: Partial<IconvType>) => {
    // 无更多数据
    if (isNoMore && pages !== 1) return
    // 获取聊天消息列表
    const data = await api.message.fetchHistoryMessages({
      queue: info.id,
      count: pageSize,
      isGroup: info.type == 'group'
    })
    // 处理数据
    const chatData = await filterChatData(data)
    // 代表无数据，无数据直接结束 加载状态。 有数据必须等到滚动完毕，才设置为true
    if (pages == 1 && chatData.length == 0) {
      setLoad(true)
    }
    // 代表无更多数据
    setNoMore(chatData?.length < pageSize)
    // 设置数据
    setChatList(pages == 1 ? [...chatData] : [...chatData, ...chatListData])
  }
  // React的 render phase, commit phase 都是同步执行，因为这一帧包含了太多的任务了
  // ，所以给我们做一些和渲染无关的任务 useEffect 就放到了渲染帧执行结束后再执行。
  // 这的情况就让我们少写了个 setTimeout了，因为此时我们节点已经存在了。
  useEffect(() => {
    const current = chatListBoxRef.current!
    if (current && chatListData.length) {
      // 当前滚动内容的高度
      const scrollHeight = current.scrollHeight - current.clientHeight
      // 当前为第一也时：随便给个最大高度。否侧： 当前位置高度 - 上次的内容高值，做到很好的链接性
      current.scrollTop = pages == 1 || isUpdateFlag ? 1000000 : scrollHeight - lastHeight
      // 页面叠加
      pages = pages + 1
      // 记录这次的值
      lastHeight = scrollHeight
      // 更改收到消息标识状态
      isUpdateFlag = false
      // 等待滚动完毕
      setLoad(true)
    }
  }, [chatListData])

  // 获取当前会话信息
  const getConvInfo = async () => {
    // 获取历史
    const oldData = await ImUtils.getOldConvData()
    // 找出来当前会话选项信息
    const info = oldData?.find(item => item.id == convId)
    return info
  }

  // 获取对话用户 || 群的记录
  const getConvRecord = async () => {
    const info = await getConvInfo()
    if (info) {
      // 初次加载就去情况掉查询条件
      api.message.resetMessages()
      // 获取历史聊天记录
      await getHistoryMessages(info)
      // 清空未读数
      await handleConvListUnread(info)
    }
  }

  // 暴露更新聊天记录的方法，给父组件调用
  useImperativeHandle(ref,
    () => ({
      updateChat: async (msg) => {
        const info = await getConvInfo()
        // 处理数据
        const newChatData = await filterChatData([msg])
        // 设置数据
        setChatList([ ...chatListData, ...newChatData ])
        // 标记下收到了信息
        isUpdateFlag = true
        clearTimeout(timer)
        // 延迟清空下，给人感觉到有新消息出现
        timer = setTimeout(() => {
          // 清空未读数
          info && handleConvListUnread(info)
        }, 500)
      }
    })
  )

  useEffect(() => {
    if (!convId) return
    // 切换聊天时初始化
    pages = 1
    lastHeight = 0
    setLoad(false)
    setNoMore(false)
    // 置空聊天信息
    setChatList([])

    getConvRecord()
    return () => {
      clearTimeout(timer)
    }
  }, [convId])

  // 渲染消息内容
  const magConTentRender = (item: IChatType) => {
    if (item?.contentsType == 'text') {
      return (
        <div className={styles['message-text-box']}>
          <div className={styles['message-text']} dangerouslySetInnerHTML={{__html: item.msg}} />
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
        <div className={styles['message-text']} dangerouslySetInnerHTML={{__html: item.msg}} />
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

  // 聊天列表滚动事件
  const handleOnScroll = async () => {
    const current = chatListBoxRef.current
    if (current) {
      const contentScrollTop = current.scrollTop
      // 必须：小于 10 && pages不是第一页 && 正在执行不可以再触发 && 还有数据
      if (contentScrollTop < 10 && pages !== 1 && isLoad && !isNoMore) {
        const info = await getConvInfo()
        // 主动触发正在加载动画，避免闪动
        setLoad(false)
        info && getHistoryMessages(info)
      }
    }
  }

  return (
    <>
      {/* 消息列表 */}
      <div
        className={styles['content-pannel-body']}
        ref={chatListBoxRef}
        onScrollCapture={(e) => handleOnScroll(e)}
        style={{
          // 如果在加载就隐藏掉，为啥不是display？ visibility有利于滚动条回滚时，页面处于看不见状态。也就是节点存在。
          // 如果我正在加载，那么我就让节点隐藏掉，这样有利于我们在滚动到对应位置是，让用户无感知。
          // 等到结束滚动那一刻，我们在让这个消息列表显示出来
          visibility: isLoad ? 'visible' : 'hidden',
          // 加上视觉效果
          opacity: isLoad ? 1 :  0
        }}>
        { chatListData.length == 0 && <div>无数据</div> }
        { chatListData?.map(item =>
          <Fragment key={item.meta_id + item.timeStamp}>
            {messageItemWrapper(item)}
          </Fragment>
        )}
      </div>
    </>
  )
})

export default ChatList
