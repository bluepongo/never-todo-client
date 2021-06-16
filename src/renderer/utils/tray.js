import {
  remote,
  app,
  Tray,
  Menu,
  shell
} from 'electron'
import fs from 'fs-extra'
// import DB from './db'

import path from 'path'

// import {setOpenAtLogin, getOpenAtLogin} from './tools'
// import pkg from '../../package.json'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const filePath = path.join(STORE_PATH, '/data.json')

let tray

export function createTray (showWindow) {
  tray = new Tray(path.join(__static, './logo-16.png'))

  const contextMenu = Menu.buildFromTemplate([
    // {
    //   label: '开机启动',
    //   type: 'checkbox',
    //   checked: getOpenAtLogin(),
    //   click () {
    //     const openAtLogin = getOpenAtLogin()
    //     setOpenAtLogin(!openAtLogin)
    //   }
    // },
    {
      label: '项目地址',
      click: () => {
        shell.openExternal('https://github.com/bluepongo/never-todo-frontend')
      }
    },
    {
      label: '问题反馈',
      click: () => {
        shell.openExternal(
          'https://github.com/bluepongo/never-todo-frontend/issues'
        )
      }
    },
    {
      label: '数据文件',
      click: () => {
        shell.openExternal(
          filePath
        )
      }
    },
    {
      label: '退出',
      role: 'quit'
    }
  ])
  tray.setContextMenu(contextMenu)

  // tray.setToolTip(pkg.name)

  tray.on('click', (event, bounds, position) => {
    showWindow()
  })
}
