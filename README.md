<!--
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-26 19:50:45
 * @Description: 
-->

# electron-react-seed

## 项目路径与命名

```
.build  // 打包配置
assets  // exe桌面项目必备的图标（不可删除）
config  // 打包环境配置，主进程控制
dist // 产物
src // 开发目录
  main 主进程代码
  renderer 渲染进程代码（开发者只需要关心这个目录，就像写react代码一样， 一把梭）
static 静态目录
```

##  使用方法

``` bash
npm i or yarn

npm run dev or yarn dev

# build命令在不同系统环境中，需要的的不一样，需要自己根据自身环境进行配置
npm run build
