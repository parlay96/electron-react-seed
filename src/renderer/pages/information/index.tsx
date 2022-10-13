/*
 * @Author: penglei
 * @Date: 2022-09-09 14:54:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-13 16:53:04
 * @Description: 消息聊天页面
 */
import React, { useState, useEffect, useRef } from "react"
import classNames from 'classnames'
import { api, ImUtils } from '@/im'
import type { IconvType } from '@/im/type'
import { publicSubscribe, publicPublish } from '@/dep'
import { Image, Icon } from '@/components'
import { setStore, getStore, CONVID, ACTIVECHAT, deleteStore } from '@/utils'
import { ChatList, IChatListRef } from './components'
import { filterConvData, removeConv, sendTextMsg } from './utils'
import styles from './index.module.scss'

// 消息聊天页面
const Information = () => {
  // 用于操作聊天输入框元素
  const editRef = useRef(null)
  // 聊天列表控制器
  const chatListRef = useRef<IChatListRef>(null)
  // 会话列表数据
  const [data, setData] = useState<IconvType[]>([])
  // 默认选择会话的ID
  const [convId, setConvId] = useState<string>('')
  // 当前会话人|群的信息
  const [convInfo, setConvInfo] = useState<Partial<IconvType>>(null)
  // 输入的信息值
  const [msgValue, setValue] = useState<string>('')

  // 获取会话列表
  const getConvList = async () => {
    const oldConvId = getStore(CONVID)
    // 获取历史会话数据
    const oldData = await ImUtils.getOldConvData()
    if (oldData?.length) {
      const isFlag = oldConvId == '-1'
      // isFlag 代表最开始没有会话。来到消息，突然就接受到了。此时设置第一条为默认对话
      if (isFlag || !oldConvId) {
        // 默认选择的会话，如果不存在就设置第一个为对话id
        setConvId(oldData[0]?.id)
        // 如果不存在就设置第一个为对话id
        setStore('CONVID', oldData[0]?.id)
      } else {
        setConvId(oldConvId)
      }
      // 更新消息数量：
      publicPublish.publish('update-msg-num')
      // 设置数据
      setData(oldData)
      return
    }
    // 历史不存在, 就去获取新会话数据
    const data = await api.message.getSessionList()
    // 过滤会话列表数据
    const convData = await filterConvData(data.data?.channel_infos)
    // 能执行这里的唯一条件就是初次进入这个页面，如登录进来后。
    if (convData.length) {
      // 更新消息数量：
      publicPublish.publish('update-msg-num')
      // 默认选择的会话
      setConvId(convData[0].id)
      // 设置当前选中会话id
      setStore(CONVID, convData[0].id)
      // 设置数据
      setData(convData)
    } else {
      // 默认选择的会话
      setConvId('')
      // 设置数据
      setData([])
      // 如果不存在历史会话。为啥要设置为一个随便值？因为我要保证这个会话列表方法执行过。
      // 在im文件目录中msg-conversion.ts有使用这个CONVID判断
      setStore(CONVID, '-1')
    }
  }

  useEffect(() => {
    // 监听更新会话列表
    publicSubscribe.listen({
      publisher: publicPublish,
      message: "update-conv-list",
      handler: (_, info) => {
        // 更新左侧会话列表
        getConvList()
        // 标识需要更新右侧聊天， isFlag参数需要看im目录下的msg-conversion文件里面的handleMsg方法
        if (info?.isFlag) {
          // 如果更新消息，需要再次获取一次当前聊天人信息，因为他们的名称，头像可能变化
          getConvInfo()
          // 更新右侧聊天记录
          chatListRef.current?.updateChat(info.message)
        }
      }
    })
    // 初始化
    getConvList()
    // 当前消息页面被激活的标识
    setStore(ACTIVECHAT, 1)
    /** 卸載訂閲器 */
    return () => {
      // 清除当前消息页面被激活的标识
      deleteStore(ACTIVECHAT)
      publicPublish.removeListener(publicSubscribe, 'update-conv-list')
    }
  }, [])

  useEffect(() => {
    if (!convId) return
    if (editRef.current) {
      editRef.current.innerHTML = ''
    }
    // 清空
    setValue('')
    getConvInfo()
  }, [convId])

  // 获取当前会话信息
  const getConvInfo = async () => {
    const oldConvId = convId || getStore(CONVID)
    // 获取历史
    const oldData = await ImUtils.getOldConvData()
    // 找出来当前会话选项信息
    const info = oldData?.find(item => item.id == oldConvId)
    // 设置当前会话信息
    setConvInfo(info)
  }

  // 渲染头部
  const headRender = () => {
    if (!convId || !convInfo) {
      return <></>
    }
    // 获取最新头像，保存一致性
    const headInfo = ImUtils.getImUserInfo(convInfo)
    return (
      <div className={styles['content-pannel-head']}>
        {/* 没有头像 */}
        {!headInfo?.avatar &&
        <div className={classNames(styles.logoAvatar, styles.portraitBox, 'unselectable')}>{headInfo?.portraitName}</div>
        }
        {/* 有头像 */}
        {headInfo?.avatar &&
       <Image
         // robot为true代表是机器人，就引入本地图标
         src={headInfo?.robot ? require(`@/assets/imgs/${headInfo?.avatar}`) : headInfo?.avatar}
         className={classNames(styles.logoAvatar, 'unselectable')}
         width={38}
         height={38} />
        }
        <div className={styles['conv-title']}>
          <div className={styles['title']}>
            <div className={styles['name']}>
              {headInfo?.userName}
            </div>
          </div>
          {/* <div className={styles['desc']}>鱼泡工程云内部测试</div> */}
        </div>
        <div className={styles['conv-operations']}>功能区</div>
      </div>
    )
  }

  // 发送消息
  const onMsgSubmit = async () => {
    // 如果输入的内容去除所有空格，还是个空，代表没输入东西
    const reg = /\s+/g
    const isFlags = msgValue.replace(reg,'') == ''
    if(isFlags || !convInfo) return
    // 发送消息
    await sendTextMsg(convInfo, msgValue)
    // 发送完毕后，清空
    setValue('')
    editRef.current.innerHTML = ''
  }

  // 输入框输入事件
  const onChange = () => {
    setValue(editRef.current.innerHTML)
  }

  return (
    <div className={styles.informationBox}>
      {/* 会话列表 */}
      <div className={styles.contactList}>
        <div className={styles.titleBox}>全部</div>
        <div className={classNames(styles.convList, 'unselectable')}>
          {data?.map((items, index) => {
            const item = ImUtils.getImUserInfo(items)
            // 消息数量
            const unread_num = item.unread_num > 99 ? '99+' : item.unread_num
            // 发送者名字
            const { chatFromUserNickname } = item?.payload?.ext
            // 是否群聊
            const isGroup = item.type == 'group'
            return (
              <div
                className={classNames(styles.convItem, convId == item.id ? styles.active: '')}
                onClick={() => {
                  setConvId(item.id)
                  setStore(CONVID, item.id)
                }}
                key={`convItem-${index}`}>
                {/* 没有头像 */}
                {!item?.avatar &&
                <div className={styles.imageBox}>
                  <div className={styles.portraitBox}>{item?.portraitName}</div>
                  {/* 未读数 */}
                  {unread_num !== 0 && <span className={styles.unreadNum}>{ unread_num }</span>}
                </div>
                }
                {/* 有头像 */}
                {item?.avatar &&
                <div className={styles.imageBox}>
                  <Image
                    // robot为true代表是机器人，就引入本地图标
                    src={item.robot ? require(`@/assets/imgs/${item.avatar}`) : item.avatar}
                    className={styles.logoAvatar}
                    width={40}
                    height={40} />
                  {/* 未读数 */}
                  {unread_num !== 0 && <span className={styles.unreadNum}>{ unread_num }</span>}
                </div>
                }
                <div className={styles.content}>
                  <div className={styles.titleWrap}>
                    <div className={styles.nameWrap}>
                      <div className={styles.name}>{item.userName}</div>
                    </div>
                    <span className={classNames(styles.time, 'hide-time')}>{item.time}</span>
                  </div>
                  <div className={styles.latestMsgInfo}>
                    <p dangerouslySetInnerHTML={{__html: isGroup ? `${chatFromUserNickname}: ${item.msg}` : item.msg}} />
                  </div>
                </div>
                {/* 移除会话 */}
                <div
                  className={classNames(styles.removeBtn, 'show-remove')}
                  onClick={(e) => {
                    removeConv(item)
                    e.stopPropagation()
                  }}
                  title='完成'>
                  <Icon type="yp-duigou" size={22}/>
                </div>
              </div>
            )})}
        </div>
      </div>
      {/* 聊天列表 */}
      <div className={styles.messageList}>
        <div className={styles.convDetailPannel}>
          {/* 头部 */}
          { headRender() }
          {/* 消息列表 */}
          <ChatList convId={convId} ref={chatListRef}/>
          {/* 输入消息区 */}
          <div className={styles['send-msg-box-wrapper']}>
            <div className={styles['input-area']}>
              <ul className={styles['tool-bar']}>
                <li className={styles['tool-item']}>
                  <Icon type='yp-diannao' size={16}/>
                </li>
              </ul>
              <div className={styles['edit-box']}>
                <pre className={styles['input-msg-box']}
                  ref={editRef}
                  onKeyUp={onChange}
                  contentEditable>
                </pre>
              </div>
            </div>
            <div className={styles['action-area']} onClick={onMsgSubmit}>
              <a className={styles['send-message-button']}>发送</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Information
