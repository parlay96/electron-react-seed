/*
 * @Date: 2022-09-09 16:29:38
 * @Description:
 */
import * as logLevel from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

logLevel.setLevel('error')
prefix.apply(logLevel, { template: '[%t] %l (%n) logger: ' })

export default logLevel
