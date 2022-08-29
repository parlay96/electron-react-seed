/*
 * @Author: pengLei
 * @LastEditors: Please set LastEditors
 * @Date: 2021-12-14 15:34:28
 * @LastEditTime: 2022-08-15 15:06:57
 * @motto: Still water run deep
 * @Description: 订阅器（采集所有需要订阅的实例）
 */
import {Subscribe, Publish} from '.'

/** 示例 （可以链式，多绑定）就是一个人可以绑定A的发布者，也可以绑定B的发布者，还可以绑定A的发布其他信息
 *  LoginSubscribe.listen({
        publisher: APublish, // 绑定发布者是A
        message: '找活', // 绑定发布者是发布的找活
        handler: (self, info) => {
          console.log(self, dispatch)
        }
      }).listen({
        publisher: BPublish,
        message: '招工',
        // 订阅者获取发布者的消息 ，callBack函数是对发布者的发布的信息做一个反馈
        handler: (self, info, callBack) => {
          consol.log(info == '我有一个商品出售')
          console.log(self, dispatch)
          callBack('我不需要，请滚~')
        }
      })
    // 第三个参数可以实现，我发送了消息，然后订阅者接受消息以后，对发布者发送某个消息
    // 假如我发布一个消息给订阅者说，我有一个商品出售，那么第三个参数，订阅者看见消息以后，回馈给发布者说：我不需要，请滚~
    BPublish.publish('招工', '我有一个商品出售', (msg) => {
         console.log(msg) // 打印出：我不需要，请滚~
    })

    如果多个人绑定了B的招工，那么B发布者一旦放送信息，全体订阅者会收到信息
 */

/** 共有的发布者 */
const publicPublish = new Publish('publicPublish')
/** 共有的订阅者 */
const publicSubscribe = new Subscribe('publicSubscribe')

/** 你可以在这里处理更多的发布订阅 */
// ....

export {
  publicPublish,
  publicSubscribe,
}
