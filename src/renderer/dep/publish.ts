/*
 * @Author: pengLei
 * @LastEditors: penglei
 * @Date: 2021-12-14 14:08:01
 * @LastEditTime: 2022-08-19 14:30:25
 * @motto: Still water run deep
 * @Description: 发布者
 */
// ! 重要方法，不容删除

/** 发布者 */
class Publish {
  name: string
  id: number
  messageMap: { [key: string]: {id: number; name: string; [x: string]: any}[] }
  /** name等同于给当前发布者一个名称 */
  constructor (name: string) {
    /** 消息事件订阅者集合对象 */
    this.messageMap = {}
    /** 随机id模拟唯一 */
    this.id = Date.now() + Math.ceil(Math.random() * 10000)
    this.name = name
  }

  /** 添加消息订阅者（subscriber等于订阅者） */
  addListener (subscriber: any, message: string) {
    if (!subscriber || !message) return false
    /** 如果消息列表不存在，就新建 */
    if (!this.messageMap[message]) {
      this.messageMap[message] = []
    }
    /** 比对ID查询！！！ */
    const existIndex = this.messageMap[message].findIndex(exitSubscriber => exitSubscriber.id === subscriber.id)
    /** 不存在这个订阅者时添加 */
    if (existIndex === -1) {
      /** 吧订阅者装进去 */
      this.messageMap[message].push(subscriber)
    } else {
      /** 存在的时候呢 直接替换 */
      this.messageMap[message][existIndex] = subscriber
    }
  }

  /** 删除消息订阅者 */
  removeListener (subscriber: any, message?: string) {
    if (!subscriber) return false
    /** 如果传了message只删除此message下的订阅关系，否则删除此订阅者的所有订阅关系 */
    const messages = message ? [message] : Object.keys(this.messageMap)
    /** 遍历Key */
    messages.forEach(_message => {
      const subscribers = this.messageMap[_message]
      if (!subscribers) return false

      let i = subscribers.length
      while (i--) {
        if (subscribers[i].id === subscriber.id) {
          subscribers.splice(i, 1)
        }
      }
      /** 数组元素如果没有了。直接吧订阅器删除 */
      if (!subscribers.length) delete this.messageMap[_message]
    })
  }

  /** 发布通知 */
  publish (message: string, info?: any, callBack?: (...params: any[]) => void) {
    const subscribers = this.messageMap[message] || []
    const handlerKey = message + "_" + this.id + "_handler"
    /** 找出当前索引订阅者，依次发送通知 */
    subscribers.forEach(subscriber => {
      subscriber[handlerKey]?.(subscriber, info, callBack)
    })
    return this
  }
}

export default Publish
