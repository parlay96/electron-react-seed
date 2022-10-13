/*
 * @Date: 2022-09-17 13:52:09
 * @Description: file content
 */
import dayjs from 'dayjs'
import { api, ImUtils } from '@/im'
import type { IconvType, IChatType } from '@/im/type'
import { publicPublish } from '@/dep'
import { isEmptyObj, getStore, USERINFO, CONVID, deleteStore } from '@/utils'

/**
  * 取出用户id
  */
export const analysisId = (channel_id: string) => {
  const startNum = channel_id.indexOf('_')
  if (startNum == -1) return ''
  const s = channel_id.slice(startNum + 1, 99999)
  const t = s.split('@')
  return t[0]
}


/**
  * 过滤会话列表数据
  */
export const filterConvData = async (data: any): Promise<IconvType[]> => {
  const convData = []
  data?.forEach(item => {
    // channel_id - 会话id, username@easemob.com表示单聊，groupid@conference.easemob.com表示群聊
    const type = item.channel_id.indexOf('@conference.easemob.com') !== -1 ? 'group' : 'account'
    const payload = JSON.parse(item.meta?.payload)
    // 获取消息
    const msg = ImUtils.convTypeTf(payload?.bodies[0])
    // 组装数据
    const orderObj =  {
      type,
      id: analysisId(item.channel_id),
      unread_num: item.unread_num,
      timeStamp: item.meta?.timestamp,
      time: dayjs(Number(item.meta?.timestamp)).format('MM-DD'),
      meta_id: item.meta.id,
      payload,
      msg: msg,
      convType: 'conv'
    }
    // 单聊会话，有ext扩展消息, 或者是群聊才放进去。排除没有头像 名称的数据
    if (type == 'account' && !isEmptyObj(payload.ext) || type == 'group') {
      convData.push(orderObj)
    }
  })
  // 获取会话中的用户资料
  const newData = await ImUtils.getUserProfile<IconvType>(convData)
  // 加入本地磁盘缓存
  await ImUtils.setOldConvData(newData)
  return newData
}

/**
 * 过滤对话聊天列表数据
 */
export const filterChatData = async (data: any): Promise<IChatType[]> => {
  const userInfo = getStore(USERINFO)
  const copyData = JSON.parse(JSON.stringify(data))
  // console.log(data)
  const chatData = []
  copyData?.forEach(item => {
    const isGroup = item.type == 'groupchat' // 是否群聊
    // 是否自己发送的消息：当from等于自己的登录账户ID代表是自己发现的消息
    const isSelf = item.from == userInfo?.user?.account_id
    // 获取消息
    const msg = ImUtils.chatTypeTf(item)
    // 组装数据
    const orderObj =  {
      contentsType: ImUtils.msgTypeDict[item.contentsType],
      msg: msg,
      meta_id: item.id, // 消息id
      timeStamp: item.time, // 时间戳
      time: dayjs(Number(item.time)).format('MM月DD日 HH:mm'),
      payload: {ext: item.ext},
      isGroup,
      isSelf,
      id: item.from, // 发送者用户ID
      type: 'account', // 主动标识是用户信息下，方便查询getUserProfile方法
      convType: 'chat'
    }
    const isRobot = ImUtils.isRobotFn(item.from)
    // 有ext扩展消息才放进去；排除没有头像 名称的数据;  或者 是机器人
    if (isRobot || !isEmptyObj(item.ext)) {
      chatData.push(orderObj)
    }
  })
  // 获取会话中的用户资料
  const newData = await ImUtils.getUserProfile<IChatType>(chatData)
  return newData
}


/**
 * 处理会话列表消息未读，会话人聊天，判断是否有未读消息。如果有就改变未读消息数量
 */
export const handleConvListUnread = async (info: Partial<IconvType>) => {
  const data = await ImUtils.getOldConvData()
  // 找出会话列表，清除本地会话列表数组的未读数
  const index = data.findIndex(item => item.id == info.id)
  // 代表当前会话存在未读数，先去清空
  if (data[index]?.unread_num) {
    data[index].unread_num = 0
    // 清空环信会话列表的未读数
    const params = info.type == 'group' ? { to: info.id, chatType: 'groupChat'} : {to: info.id }
    api.message.sendConverReaded(params)
    // 保存会话列表
    await ImUtils.setOldConvData(data)
    // 更新对话
    publicPublish.publish('update-conv-list')
  }
}

/**
 * 移除会话的处理
 */
export const removeConv = async (info: IconvType) => {
  const oldConvId = getStore(CONVID)
  // 获取旧的会话列表
  const oldConvData = await ImUtils.getOldConvData()
  // 删除本地磁盘需要移除的会话数据 得到新的会话列表
  const newConvData = oldConvData.filter(item => item.id !== info.id)
  // 加入本地磁盘缓存
  await ImUtils.setOldConvData(newConvData)
  // 如果删除的是当前正在对话的会话，则把CONVID（默认选择会话的id） 清除掉
  if (info.id == oldConvId) {
    deleteStore(CONVID)
  }
  // 删除远端环信的会话
  api.message.deleteSession({
    channel: info.id,
    chatType: info.type == 'account' ? 'singleChat' : 'groupChat',
    deleteRoam: false
  })
  // 更新对话
  publicPublish.publish('update-conv-list')
}
