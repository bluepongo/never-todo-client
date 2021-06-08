import {
  app,
  Tray,
  Menu,
  shell
} from 'electron'
// import DB from './db'
import path from 'path'

// import pkg from '../../package.json'

let tray

export function createTray (showWindow) {
  tray = new Tray(path.join(__static, './electron.png'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '开机启动',
      type: 'checkbox',
      checked: getOpenAtLogin(),
      click () {
        const openAtLogin = getOpenAtLogin()
        setOpenAtLogin(!openAtLogin)
      }
    },
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

function setOpenAtLogin (openAtLogin) {
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: openAtLogin
    })
  } else {
    app.setLoginItemSettings({
      openAtLogin: openAtLogin,
      openAsHidden: false,
      path: process.execPath,
      args: [path.resolve(process.argv[1])]
    })
  }
}

function getOpenAtLogin () {
  if (app.isPackaged) {
    const { openAtLogin } = app.getLoginItemSettings()
    return openAtLogin
  } else {
    const { openAtLogin } = app.getLoginItemSettings({
      path: process.execPath,
      args: [path.resolve(process.argv[1])]
    })
    return openAtLogin
  }
}
