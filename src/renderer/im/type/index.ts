/*
 * @Date: 2022-09-28 17:13:21
 * @Description: file content
 */
export interface IconvType {
  // 会话发送人id---单聊---群聊
  id: string
  // 头像
  avatar?: string
  // 没有图标头像，文字头像
  portraitName?: string
  // 消息id
  meta_id: string
  // 消息
  msg: string
  // 扩展消息
  payload: {[key: string]: string}
  // 时间
  time: string
  // 时间戳，用来排序
  timeStamp: string | number
  // 会话类型： 个人， 群聊
  type: 'account' | 'group'
  // 未读数
  unread_num: number | string
  // 会话人名称
  userName: string
  // 是否机器人
  robot: boolean,
  // 表示当前属于会话列表，主要用来做getUserProfile->getImUserInfo方法判断的
  convType: string
}

export interface IChatType extends IconvType {
  contentsType: string, // 消息类型
  isGroup: boolean, // 是否群聊
  isSelf: boolean // 是否是自己发送的消息
}


/**
 * 本地存储的IM用户信息
 */
export interface ImUserInfoType {
  timeStamp: number
  account_id: string
  chatFromUserAvatar: string
  chatFromUserNickname: string
}
