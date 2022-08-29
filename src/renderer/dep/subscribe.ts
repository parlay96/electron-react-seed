/*
 * @Author: pengLei
 * @LastEditors: Please set LastEditors
 * @Date: 2021-12-14 14:03:52
 * @LastEditTime: 2022-08-15 14:58:53
 * @motto: Still water run deep
 * @Description: 订阅者
 */
// ! 重要方法，不容删除

type listenType = {
  publisher: any,
  message: string,
  handler: (subscribe: {[x: string]: any}, info: any, callBack?: (...params: any[]) => void) => void
}

/** 订阅者 */
class Subscribe {
  id: number;
  name: string;
  [x: string]: any
  /** name等同于给当前订阅者一个名称 */
  constructor (name = 'subscriber') {
    this.name = name
    /** 随机id模拟唯一 */
    this.id = Date.now() + Math.ceil(Math.random() * 10000)
  }
  /**
   *  订阅器
   *  @publisher 订阅的是哪个发布者(比如你订阅的是鱼泡发布者)
   *  @message 订阅的消息，(非常重要的字段)（比如你订阅的是鱼泡发的招工信息key。绑定关系）
   *  @handler 收到消息后的处理方法
   */
  listen ({publisher, message, handler}: listenType) {
    /** 订阅消息的回调函数 */
    if (publisher) {
      /** 一个订阅者可以同时订阅多个发布者，所以回调函数要拼接上对应发布者的id */
      this[message + '_' + publisher.id + "_handler"] = handler
      publisher.addListener(this, message)
    }
    /** 链式 */
    return this
  }
  /** 取消订阅 */
  unlisten (publisher: any, message: string) {
    if (publisher) {
      publisher.removeListener(this, message)
    }
    /** 链式 */
    return this
  }
}

export default Subscribe
