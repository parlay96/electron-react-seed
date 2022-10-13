/*
 * @Date: 2022-09-09 15:23:48
 * @Description: 初始化im
 */
import websdk from 'easemob-websdk'

import config from '../config/webIMConfig'
import loglevel from '../utils/loglevel'

const rtc = {
  // 用来放置本地客户端。
  client: null,
  // 用来放置本地音视频频轨道对象。
  localAudioTrack: null,
  localVideoTrack: null,
}

// init DOMParser / document for strophe and sdk
const webIM = window.WebIM = {} as any
webIM.config = config
webIM.loglevel = loglevel
webIM.message = websdk.message
webIM.statusCode = websdk.statusCode
webIM.utils = websdk.utils
webIM.logger = websdk.logger
const options = {
  isReport: true,
  isMultiLoginSessions: webIM.config.isMultiLoginSessions,
  isDebug: webIM.config.isDebug,
  https: webIM.config.https,
  isAutoLogin: false,
  heartBeatWait: webIM.config.heartBeatWait,
  autoReconnectNumMax: webIM.config.autoReconnectNumMax,
  delivery: webIM.config.delivery,
  appKey: webIM.config.appkey,
  useOwnUploadFun: webIM.config.useOwnUploadFun,
  deviceId: webIM.config.deviceId,
  //公有云 isHttpDNS 默认配置为true
  isHttpDNS: webIM.config.isHttpDNS,
  onOffline: () => {console.log('onOffline')},
  onOnline: () => {console.log('onOnline')}
}

webIM.logger.setConfig({
  useCache: true,
  maxCache: 3 * 1024 * 1024
})
webIM.conn = new websdk.connection(options)

webIM.rtc = rtc
export default webIM
