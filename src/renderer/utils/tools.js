import {app} from 'electron'
import path from 'path'

const appFolder = path.dirname(process.execPath)
const updateExe = path.resolve(appFolder, '..', 'Update.exe')
const exeName = path.basename(process.execPath)

export function getDataPath () {
  console.log(app.getPath('userData'))
  return app.getPath('userData')
}

export function setOpenAtLogin (openAtLogin) {
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: openAtLogin
    })
  } else {
    app.setLoginItemSettings({
      openAtLogin: openAtLogin,
      openAsHidden: false,
      path: updateExe,
      args: [
        '--processStart', `"${exeName}"`,
        '--process-start-args', `"--hidden"`
      ]
    })
  }
}

export function getOpenAtLogin () {
  if (app.isPackaged) {
    const { openAtLogin } = app.getLoginItemSettings()
    return openAtLogin
  } else {
    const { openAtLogin } = app.getLoginItemSettings({
      path: updateExe,
      args: [
        '--processStart', `"${exeName}"`,
        '--process-start-args', `"--hidden"`
      ]
    })
    return openAtLogin
  }
}
