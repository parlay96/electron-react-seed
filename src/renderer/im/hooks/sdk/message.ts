/*
 * @Date: 2022-09-13 16:03:25
 * @Description: im发送消息sdk
 */

import webIm from '../webIm'

type IExtType = {
  chatFromAccount: string // 发送者的账户ID
  chatFromUserNickname: string // 发送者的名称
  chatFromUserAvatar: string // 发送者的头像
}

/**
 * 发送消息。
 * @param {Object} option -
 * @param {Object} option.chatType -  用于设置当前聊天模式 群聊（groupChat）、聊天室（chatRoom），不设置默认为单聊
 * @param {Object} option.to -  目标用户、群组、聊天室id
 * @param {Object} option.msg - 发送的消息
*/
export function sendPrivateText (option: {
  // 接收人|群 ID
  to: string
  msg: string
  // 必须携带ext扩展字段！
  ext: IExtType,
  // 单聊 | 群聊 | 聊天室
  chatType: 'singleChat' | 'groupChat' | 'chatRoom'
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const _option = {chatType: 'singleChat', ...option}
    const id = webIm.conn.getUniqueId()
    const message = new webIm.message('txt', id)
    message.set({
      ..._option,
      success: function (id, serverMsgId) {
        resolve({... message.body, serverMsgId})
      },
      fail: function (err) {
        // e.type === '603' 被拉黑
        // e.type === '605' 群组不存在
        // e.type === '602' 不在群组或聊天室中
        // e.type === '504' 撤回消息时超出撤回时间
        // e.type === '505' 未开通消息撤回
        // e.type === '506' 没有在群组或聊天室白名单
        // e.type === '501' 消息包含敏感词
        // e.type === '502' 被设置的自定义拦截捕获
        // e.type === '503' 未知错误
        reject(err)
      }
    })
    webIm.conn.send(message.body)
  })
}

/**
 * @param {Object} option -
 * @param {Object} option.mid -   回撤消息id
 * @param {Object} option.to -   消息的接收方
 * @param {Object} option.type -  chat(单聊) groupchat(群组) chatroom(聊天室)
 * @param {Object} option.success - 撤回成功的回调
 * @param {Object} option.fail- 撤回失败的回调（超过两分钟）
 */
export const recallMessage = (option: {mid: string, to: string, type?: string}) => {
  return new Promise((resolve, reject) => {
    webIm.conn.recallMessage({
      type: 'chat', // 默认单聊
      ...option,
      success: function (data) {
        resolve(data)
      },
      fail: function () {
        reject('超过两分钟')
      },
    })
  })
}

/**
 * 获取会话列表
 */
export const getSessionList = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    webIm.conn.getSessionList().then((res) => {
      resolve(res)
      /**
      返回参数说明
      channel_infos - 所有会话
      channel_id - 会话id, username@easemob.com表示单聊，groupid@conference.easemob.com表示群聊
      meta - 最后一条消息
      unread_num - 当前会话的未读消息数

      data{
          channel_infos:[
              {
                  channel_id: 'easemob-demo#chatdemoui_username@easemob.com',
                  meta: {},
                  unread_num: 0
              },
              {
                  channel_id: 'easemob-demo#chatdemoui_93734273351681@conference.easemob.com',
                  meta: {
                      from: "easemob-demo#chatdemoui_zdtest@easemob.com/webim_1610159114836",
                      id: "827197124377577640",
                      payload: "{"bodies":[{"msg":"1","type":"txt"}],"ext":{},"from":"zdtest","to":"93734273351681"}",
                      timestamp: 1610161638919,
                      to: "easemob-demo#chatdemoui_93734273351681@conference.easemob.com"
                  },
                  unread_num: 0
              }
          ]
      }
      */
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 获取群信息
 */
export const getGroupInfo = (groupId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    webIm.conn.getGroupInfo({groupId}).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 获取对话历史消息 支持Promise返回
 * @param {Object} options
 * @param {String} options.queue   - 对方用户id（如果用户id内含有大写字母请改成小写字母）/群组id/聊天室id
 * @param {String} options.count   - 每次拉取条数
 * @param {Boolean} options.isGroup - 是否是群聊，默认为false
 * @param {String} options.start - （非必需）起始位置的消息id，默认从最新的一条开始
 */

export const fetchHistoryMessages = (
  options:{ queue: string, count: number,isGroup: boolean, start?: string })
  : Promise<any> => {
  return new Promise((resolve, reject) => {
    webIm.conn.fetchHistoryMessages(options).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 重置拉取历史消息接口的游标
 */
export const resetMessages = () => {
  webIm.conn.mr_cache = []
}

/**
 * 发送整个会话已读回执
 */
export const sendConverReaded = (params: { to: string, chatType?: string }) => {
  const msg = new webIm.message('channel', webIm.conn.getUniqueId())
  if (params?.chatType) {
    // 如果是群聊
    msg.set({ to: params.to, chatType: params.chatType })
  } else {
    msg.set({ to: params.to })
  }
  webIm.conn.send(msg.body)
}

/**
 * 删除会话
 * {
    channel: 'userID', // 会话 ID（对方的 userID 或群组 ID）。
    chatType: 'singleChat', // 会话类型 singleChat（单聊） groupChat（群聊）。
    deleteRoam: true, // 是否同时删除服务端漫游消息。
  }
 */
export const deleteSession = (params: { channel: string, chatType: string, deleteRoam: boolean }) => {
  webIm.conn.deleteSession(params)
}
