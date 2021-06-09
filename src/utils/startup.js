import {app} from 'electron'
import path from 'path'

export function setOpenAtLogin (openAtLogin) {
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

export function getOpenAtLogin () {
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
