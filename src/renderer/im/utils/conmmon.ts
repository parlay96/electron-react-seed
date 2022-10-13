/*
 * @Date: 2022-09-28 14:21:56
 * @Description: file content
 */
import { $ipc, request, USERINFODATA, setStore, getStore } from '@/utils'
import { ImUserInfoType } from '../type'
import { message } from '../hooks/sdk'

// 系统消息类型
const megTypeData: {[key:string]: {name: string, icon: string}} = {
  'sys_join': {name: '入企申请', icon: 'xitopngtishi.png'},
  'sys_invite': {name: '团队邀请', icon: 'xitopngtishi.png'},
  'sys_assistant': {name: '小秘书', icon: 'xiaomishu.png'},
  'admin': {name: '系统消息', icon: ''}
}

// 是否机器人，根据ID
export const isRobotFn = (id) => {
  if (!id) return false
  return id == 'admin' || id?.indexOf('sys_') !== -1
}

/**
 * 取出IM用户信息, 主要为了保持头像的一致性！
 * 看getUserProfile方法你就知道本方法是干嘛的了
 */
export const getImUserInfo = (convItem: any) => {
  let order: any = {}
  const info: any = {}
  // 如果是群聊，或者是机器人，就默认去本身的头像。在getUserProfile方法我们设置了。
  if (convItem.type == 'group' || convItem?.robot) {
    return {...convItem}
  }
  // 如果是用户，为了保持头像的一致性。我们需要统一取出最新的头像

  // 获取本地存储用户信息
  const userInfoData: ImUserInfoType[] = getStore(USERINFODATA)
  // 当前用户ID，在缓存中是否存在信息
  const itemInfo = userInfoData?.find(item => item.account_id == convItem.id)
  if (itemInfo) {
    order = itemInfo
  } else {
    // 没有查询到就取 聊天携带的信息，保证头像，名称不空白。虽然可能不是最新的
    order = convItem.payload?.ext
  }

  // 取出头像信息
  const { chatFromUserAvatar, chatFromUserNickname } = order
  // 用户名
  info.userName = chatFromUserNickname
  // 如果存在头像：取出头像
  if (chatFromUserAvatar) {
    info.avatar = chatFromUserAvatar
  } else {
    // 不存在头像：直接截图用户名后2位当头像
    const nameText = chatFromUserNickname?.length > 2 ? chatFromUserNickname?.substring(chatFromUserNickname?.length - 2) : chatFromUserNickname
    info.portraitName = nameText
  }
  return {...convItem, ...info}
}


/**
 * 设置用户头像和姓名，这里我们吧获取到的头像直接，存到本地，页面使用的时候，我们直接根据ID 去查询出来
 * 这里我们主要去存, 主要为了保持头像的一致性！
 */
export const setImUserInfo = async (convItem: any): Promise<any> => {
  // 获取本地存储用户信息
  const oldInfoData: ImUserInfoType[] = getStore(USERINFODATA)
  // 当前用户ID，在缓存中是否存在信息
  const itemInfo = oldInfoData?.find(item => item.account_id == convItem.id)
  // 存在就取缓存，不存在就用接口获取
  if (itemInfo) {
    // 如果查询的历史用户信息头像跟我现在不一致，那么就用新的去替换它
    const { chatFromUserAvatar, chatFromUserNickname, chatFromAccount } = convItem.payload?.ext
    // 如果头像，名称不一样
    const isFlag = itemInfo.chatFromUserAvatar !== chatFromUserAvatar || itemInfo.chatFromUserNickname !== chatFromUserNickname
    // 必须是当前需要更新的用户信息时间，大于存储历史的时间，才做用户信息更新
    const timeFlag = Number(convItem.timeStamp) > Number(itemInfo.timeStamp)
    // 判断当前历史信息的头像是不是自己，因为扩展字段的信息，是你自己发送给别人的消息，此时。不能去改变别人的头像
    const isSelf = convItem.id == chatFromAccount
    // 满足条件才去更改本地存储的用户信息
    if (isFlag && timeFlag && isSelf) {
      const info = {
        chatFromUserAvatar, chatFromUserNickname, account_id: chatFromAccount, timeStamp: Number(convItem.timeStamp)
      }
      const index = oldInfoData?.findIndex(item => item.account_id == itemInfo?.account_id)
      // 吧新的存入进去
      oldInfoData[index] = info
      setStore(USERINFODATA, oldInfoData)
    }
    return
  }

  // 如果是聊天列表没有历史，那就去用扩展字段
  if (convItem.convType == 'chat' && !itemInfo) {
    const { chatFromUserAvatar, chatFromUserNickname, chatFromAccount } = convItem.payload?.ext
    const info = {
      chatFromUserAvatar, chatFromUserNickname, account_id: chatFromAccount, timeStamp: Number(convItem.timeStamp)
    }
    const newData = oldInfoData ? [...oldInfoData, info] : [info]
    setStore(USERINFODATA, newData)
    return
  }

  // 如果是会话列表没有历史，就用接口去查询
  if (convItem.convType == 'conv') {
    // 获取接口查询用户信息
    const data = await request['GET/im/user/profile']({account_id: convItem.id})
    if (data.data) {
      const info = {
        account_id: data.data?.account_id,
        chatFromUserAvatar: data.data?.avatar,
        chatFromUserNickname: data.data?.name,
        timeStamp: convItem.timeStamp
      }
      // 把当前人的信息存储到本地
      const newData = oldInfoData ? [...oldInfoData, info] : [info]
      setStore(USERINFODATA, newData)
    }
    return
  }
}


/**
 * 获取会话中的用户资料
 */
export const getUserProfile = <T>(data: any): Promise<T[]> => {
  const convUserInfoData = data.map(async (item) => {
    // 如果是用户 里面又分为机器人，和真实人
    if (item.type == 'account') {
      // 如果id 是sys_开头，代表是机器人用户，机器人就默认固定头像，固定名称
      const isRobot = isRobotFn(item.id)
      if (isRobot) {
        item.userName = megTypeData[item.id].name
        // 机器人直接取本地图片，这里给一个标识，代表是什么机器人
        item.avatar = megTypeData[item.id].icon
        // 标识当前是属于机器人
        item.robot = true
      // 代表是用户
      } else {
        // 取头像，用户名， 然后保存到本地。主要为了保持头像的一致性！
        await setImUserInfo(item)
        //  如果是 用户，这里我们不做直接赋值。我们页面直接用 getImUserInfo方法获取
        // 用户名
        // item.userName = chatFromUserNickname
        // 如果存在头像：取出头像，不存在头像：直接截图用户名后2位当头像
        // if (chatFromUserAvatar) {
        //   item.avatar = chatFromUserAvatar
        // } else {
        //   const nameText = chatFromUserNickname?.length > 2 ? chatFromUserNickname?.substring(chatFromUserNickname?.length - 2) : chatFromUserNickname
        //   item.portraitName = nameText
        // }
      }
    } else {
      // 如果是群聊===>>>通过环信：获取群的信息
      const data = await message.getGroupInfo(item.id)
      if (data?.data?.length) {
        const { custom, name } = data.data[0]
        // 群的扩展信息
        item.group_ext = JSON.parse(custom)
        // 群名
        item.userName = name
        // 如果存在头像：取出头像，不存在头像：直接截图用户名后2位当头像
        if (item?.group_ext?.avatar) {
          item.avatar = item?.group_ext?.avatar
        } else {
          const nameText = name?.length > 2 ? name?.substring(name?.length - 2) : name
          item.portraitName = nameText
        }
      }
    }
    return item
  })
  return Promise.all(convUserInfoData)
}


/**
 * 获取本地磁盘的历史数据
 */
export const getOldConvData = async (): Promise<any> => {
  return $ipc.invoke('getStoreValue', 'conv-data')
}


/**
 * 设置历史数据到本地磁盘
 */
export const setOldConvData = async (data) => {
  return $ipc.invoke('setStoreValue', {key: 'conv-data', data})
}

/**
 * 获取会话列表全部未读数
 */
export const getUnreadMessageCount = async () => {
  let count = 0
  const data = await getOldConvData()
  data.forEach(item => {
    count = Number(item.unread_num) + count
  })
  return count
}
