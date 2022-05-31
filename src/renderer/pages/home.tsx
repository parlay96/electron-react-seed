/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-30 09:29:25
 * @Description:
 */
import React, { useEffect } from "react"
import stylesCss from './index.module.scss'
const RemotePcHome = React.lazy(() => import("pc/home"))
const RemoteApp = React.lazy(() => import("pc/remoteApp"))
import {store, connect, Provider} from '@/store'

interface ExampleDemoProps {
  data?: any[]
}

const Home = (props: ExampleDemoProps) => {

  useEffect(() => {
    console.log(12223)
  }, [])


  return (
    <>
      <div>
        Welcome to Host App
      </div>
      <div className={stylesCss.bos}>
        <React.Suspense fallback="Loading Slides">
          <RemoteApp store={store} />
        </React.Suspense>
        {/* <webview style={{ width: '100%', height: '100%' }} src="https://www.yupao.com"></webview> */}
      </div>
      <div>
        <button onClick={() => console.log('sss', store.getState().example)}>打印</button>
      </div>
    </>
  )
}

export default Home
