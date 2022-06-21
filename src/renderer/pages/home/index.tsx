/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-20 17:40:06
 * @Description:
 */
import React, { useEffect } from "react"
import stylesCss from './index.module.scss'
// const RemotePcHome = React.lazy(() => import("pc/home"))
// const RemoteApp = React.lazy(() => import("pc/remoteApp"))
import {store, connect, Provider} from '@/store'

interface HomeProps {
  data?: any[]
}

const Home = (props: HomeProps) => {

  useEffect(() => {
    console.log(12223)
  }, [])

  return (
    <>
      <div className={stylesCss.bos}>
        <React.Suspense fallback="Loading Slides">
          {/* <RemoteApp store={store} /> */}
        </React.Suspense>
        <webview style={{ width: '100%', height: '100%' }} src="http://192.168.110.82:3000"></webview>
      </div>
      {/* <div>
        <button onClick={() => console.log('sss', store.getState().example)}>打印</button>
      </div> */}
    </>
  )
}

export default Home
