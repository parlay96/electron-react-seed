import WebIM from "./webIm"
import { handleMsg } from '../utils'

// 接收消息
export default () => {
  // 接收消息
  WebIM.conn.listen({
    //连接成功回调
    onOpened: function (message) {
      // console.log("%c [opened] 连接已成功建立", "color: green")
    },
    //连接关闭回调
    onClosed: function (message) {
      // console.log("退出登陆")
    },
    // 连接成功回调。
    onConnected: function ( message ) {
      // console.log("%c [onConnected] 连接成功回调: ", message)
    },
    // 连接关闭回调。
    onDisconnected: function ( message ) {
      console.log("%c [onDisconnected] 连接关闭回调: ", message)
    },
    // 收到文本消息。
    onTextMessage: function ( message ) {
      handleMsg(message)
    },
    // 收到图片消息。
    onPictureMessage: function ( message ) {
      handleMsg(message)
    },
    // 收到音频消息。
    onAudioMessage: function ( message ) {
      handleMsg(message)
    },
    // 收到自定义消息。
    onCustomMessage: function ( message ) {
      handleMsg(message)
    },
    // 收到视频消息。
    onVideoMessage: function (message) {
      handleMsg(message)
    },
    // 收到文件消息。
    onFileMessage: function ( message ) {
      handleMsg(message)
    },
    // 收到命令消息。
    onCmdMessage: function ( message ) {
      // console.log("%c [onCmdMessage] 收到命令消息: ", message)
    },
    // 收到位置消息。
    onLocationMessage: function ( message ) {
      // console.log("%c [onLocationMessage] 收到位置消息: ", message)
    },
    // 收到消息撤回回执。
    onRecallMessage: function ( message ){
      // console.log("%c [onRecallMessage] 收到消息撤回回执: ", message)
    },
    // 收到消息送达服务器回执。
    onReceivedMessage: function (message){
      //  console.log("%c [onReceivedMessage] 收到消息送达服务器回执: ", message)
    },
    // 收到消息送达客户端回执。
    onDeliveredMessage: function (message){
      //  console.log("%c [onDeliveredMessage] 收到消息送达客户端回执: ", message)
    },
    // 收到消息已读回执。
    onReadMessage: function (message){
      //  console.log("%c [onReadMessage] 收到消息已读回执: ", message)
    },
    // 如果用户在 A 群组被禁言，在 A 群发消息会触发该回调且消息不传递给该群的其它成员。
    onMutedMessage: function (message){
      //  console.log("%c [onMutedMessage] 如果用户在 A 群组被禁言，在 A 群发消息会触发该回调且消息不传递给该群的其它成员: ", message)
    },
    // 收到会话已读回执，对方发送 `channel ack` 时会触发该回调。
    onChannelMessage: function (message){
      //  console.log("%c [onChannelMessage] 收到会话已读回执，对方发送 `channel ack` 时会触发该回调: ", message)
    },
    // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢或解散等消息.
    onPresence: function ( message ) {
      // console.log("%c [onPresence] 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢或解散等消息: ", message)
    },
    // 处理好友申请。
    onRoster: function ( message ) {
      //  console.log("%c [onRoster] 处理好友申请: ", message)
    },
    // 处理群组邀请。
    onInviteMessage: function ( message ) {
      //  console.log("%c [onInviteMessage] 处理群组邀请: ", message)
    },
    // 本机网络连接成功。
    onOnline: function () {
      //  console.log("%c [onOnline] 本机网络连接成功 ")
    },
    // 本机网络掉线。
    onOffline: function () {
      //  console.log("%c [onOffline] 本机网络掉线 ")
    },
    // 失败回调。
    onError: function ( message ) {
      // console.log("%c [onError] 失败回调: ", message)
    },
    // 黑名单变动。
    onBlacklistUpdate: function (list) {
      // 查询黑名单、将好友拉黑以及将好友移出黑名单均会触发该回调，`list` 列明黑名单上的现有好友。
      //  console.log("%c [onBlacklistUpdate] 黑名单变动: ", list)
    },
  })
}
