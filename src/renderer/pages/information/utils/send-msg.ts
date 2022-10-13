/*
 * @Date: 2022-09-23 15:15:58
 * @Description: 发送消息的处理
 */
import type { IconvType } from '@/im/type'
import { publicPublish } from '@/dep'
import { getStore, USERINFO } from '@/utils'
import { api, ImUtils } from '@/im'

/** 发送文本消息 */
export const sendTextMsg = async (convInfo: Partial<IconvType>, val: string) => {
  const { user } = getStore(USERINFO)
  try {
    const data = await api.message.sendPrivateText({
      to: convInfo.id,
      msg: val,
      ext: {
        chatFromAccount: user.account_id,
        chatFromUserNickname: user.name,
        chatFromUserAvatar: user.avatar
      },
      chatType: convInfo.type == 'account' ? 'singleChat' : 'groupChat'
    })
    // 发送成功就需要吧消息同步到页面上, 发消息等于接受消息，和im里面handleMsg 方法类似
    // 组装数据
    const msgObj = {
      contentsType: 'TEXT',
      data: data.msg,
      ext: data.ext,
      from: user.account_id, // 发送人
      id: data.serverMsgId, // 消息ID
      time: data.time,
      to: data.to, // 接受人
      type: data.chatType == 'singleChat' ? 'chat' : 'groupchat',
    }
    // 组装会话列表数据
    const newData = await ImUtils.makeConvInfo(msgObj, true)
    // 如果newData返回false, 代表不需要执行下面的
    if (!newData) return
    // 更新对话
    publicPublish.publish('update-conv-list', {
      message: msgObj, // 吧当前的新消息传递出去
      isFlag: true // 非常重要，外面需要使用
    })
  } catch (err) {

  }
}
