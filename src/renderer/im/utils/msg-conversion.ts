/*
 * @Date: 2022-09-27 17:33:56
 * @Description: 处理接受的消息
 */
import dayjs from 'dayjs'
import { isEmptyObj, getStore, CONVID, ACTIVECHAT } from '@/utils'
import { publicPublish } from '@/dep'
import { convTypeTf, getUserProfile, getOldConvData, setOldConvData, msgTypeDict } from '.'
import { IconvType } from '../type'

/**
 * 组装会话列表的数据
 * 接受消息，发送消息的时候，都需要组织会话列表数据
 * @isSelf 是否自己发送信息，因为这个方法还用在自己发送消息，需要更新会话列表。
 * @message 消息体
 */
export const makeConvInfo = async (message, isSelf?: boolean) => {
  // 聊天类型，单聊 或者 群聊
  const type = message.type == 'chat' ? 'account' : 'group'
  // 获取消息
  const msg = convTypeTf({type: msgTypeDict[message.contentsType], msg: message.data})
  // 组装数据
  const orderObj =  {
    type,
    // 如果是单聊就取，谁给我发的用户：id， 如果是群聊就取发给谁的 id
    // 如果是自己发的消息，id去接受人 to
    id: isSelf || message.type !== 'chat' ? message.to : message.from,
    timeStamp: message?.time,
    time: dayjs(Number(message?.time)).format('MM-DD'),
    meta_id: message.id,
    payload: {ext: message.ext},
    unread_num: 1, // 默认未读数
    msg: msg,
    convType: 'conv'
  }
  // 获取用户信息
  const newData = await getUserProfile<IconvType>([orderObj])
  // 获取旧的会话列表
  const oldConvData = await getOldConvData()
  // 存在会话列表，因为有可能会话列表没有数据是个undefined。那么新接受消息就导致数组push报错
  if (!oldConvData) {
    await setOldConvData(newData)
    // 更新对话
    publicPublish.publish('update-conv-list')
    return false
  } else {
    // 收到的消息是否在会话列表中
    const index = oldConvData.findIndex(item => item.id == newData[0]?.id)
    if (index >= 0) {
      // 在未读消息数量的基础上+1
      const oldNum = Number(oldConvData[index].unread_num)
      // 改变会话列表中的数据
      oldConvData[index] = {
        ...newData[0],
        unread_num: isSelf ? 0 : (oldNum || 0) + 1 // 自己发送的消息不加1
      }
    } else {
      // 没有在会话中
      oldConvData.push(newData[0])
    }
    // 设置会话列表数据
    await setOldConvData(oldConvData)

    return newData
  }
}

/**
 * 处理接受的消息
 */
export const handleMsg = async (message: any) => {
  // 必须存在值，必须进入过消息页面。才能接受新消息。防止在登录页面就有人给我发消息。
  const convid = getStore(CONVID)
  // 必须要有ext的扩展字段，这里面包含了头像，用户名、不然会会导致界面没头像
  if (!isEmptyObj(message.ext) && convid) {
    // 组装会话列表数据
    const newData = await makeConvInfo(message)
    // 如果newData返回false, 代表不需要执行下面的
    if (!newData) return

    /**
     * 上面是在做收到消息处理会话列表的逻辑。 我们还有可能收到消息的时候，正在进行对聊-》》跟某个人 或者群对聊时。
     * 这个时候我们就需要吧收到的消息通信给会话页面了（也就是消息页面的右侧内容）
     * 注意: 当update-conv-list 传递了第二个参数，代表着需要更新右边信息列表。我会在消息页面去判断，去更新右边信息列表
     */
    // 消息页面是否被激活
    const activeChat = getStore(ACTIVECHAT)
    // 如果这个存在，代表正处于消息页面。 且存在会话中, convid == -1 代表没有会话列表要排查掉。
    // 并且当前的会话ID 必须 和接受到消息的ID 一致
    const isFlag = activeChat && (convid && convid !== '-1') && convid == newData[0]?.id
    // 消息页面没激活，但是收到消息，也要去更新菜单位置的消息数量
    if (!activeChat) {
      // 更新消息数量：
      publicPublish.publish('update-msg-num')
    }
    // 更新对话
    publicPublish.publish('update-conv-list', {
      message, // 吧当前的新消息传递出去
      isFlag // 非常重要，外面需要使用
    })
  }
}
