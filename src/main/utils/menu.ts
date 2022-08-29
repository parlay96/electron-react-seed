import {
  app,
  Menu,
  shell,
  BrowserWindow,
} from 'electron'

export class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor (mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  buildMenu (): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment()
    }

    const template = this.buildTemplate() as any

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
  }

  setupDevelopmentEnvironment (): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y)
          },
        },
      ]).popup({ window: this.mainWindow })
    })
  }

  buildTemplate () {
    const isMac = process.platform === 'darwin'
    return [
      // { role: 'appMenu' }
      ...isMac ? [{
        label: '鱼泡工程云',
        submenu: [
          { role: 'about', label: '关于鱼泡工程云' },
          { type: 'separator' },
          { role: 'services', label: '服务' },
          { type: 'separator' },
          { role: 'quit', label: '退出鱼泡工程云' }
        ]
      }] : [],
      // { role: 'editMenu' }
      {
        label: '编辑',
        submenu: [
          { role: 'undo', label: '撤销' },
          { role: 'redo', label: '重做' },
          { type: 'separator' },
          { role: 'cut', label: '剪切' },
          { role: 'copy', label: '复制' },
          { role: 'paste', label: '粘贴' },
          ...isMac ? [
            { role: 'pasteAndMatchStyle', label: '粘贴与样式' },
            { role: 'delete', label: '删除' },
            { role: 'selectAll', label: '全选' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ] : [
            { role: 'delete', label: '删除' },
            { type: 'separator' },
            { role: 'selectAll', label: '全选' }
          ]
        ]
      },
      {
        label: '视图',
        submenu: [
          { role: 'reload', label: '刷新' },
          { role: 'forceReload', label: '强制刷新' },
          { role: 'toggleDevTools', label: '开发者工具' },
        ]
      },
      // { role: 'windowMenu' }
      {
        label: '窗口',
        submenu: [
          { role: 'minimize', label: '最小化', accelerator: 'Command+M', },
          { role: 'zoom', label: '缩放' },
          ...isMac ? [
            { type: 'separator' },
            { role: 'hide', label: '隐藏', accelerator: 'Command+H' },
            { role: 'hideOthers', label: '隐藏其他应用', accelerator: 'Option+Command+H' },
            {
              label: '切换全屏',
              accelerator: 'Ctrl+Command+F',
              click: () => {
                this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
              },
            },
          ] : [
            { role: 'close', label: '关闭' }
          ]
        ]
      },
      {
        role: 'help',
        label: '帮助',
        submenu: [
          {
            label: '帮助与客服',
            click: async () => {
              console.log('帮助与客服')
              // const { shell } = require('electron')
              // await shell.openExternal('https://electronjs.org')
            }
          }
        ]
      }
    ]
  }
}
