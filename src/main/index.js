'use strict'

import { app, BrowserWindow, screen, ipcMain } from 'electron'
import { createTray } from '../utils/tray'
// import { autoUpdater } from 'electron-updater'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    mainWindow.show()
  }
})

if (isSecondInstance) {
  app.quit()
}

// 创建 myWindow, 加载应用的其余部分, etc...
app.on('ready', () => {
  init()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    init()
  }
})

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

function init () {
  createWindow()
  createTray(showWindow)
}

function createWindow () {
  mainWindow = new BrowserWindow({
    // dev
    // transparent: false,
    // frame: true,
    // resizable: true,

    // pro
    transparent: true,
    frame: false,
    resizable: false,
    height: 300,
    width: 350,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,

    useContentSize: true,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true
    }
  })

  setDefaultPos()

  mainWindow.loadURL(winURL)
  // mainWindow.setIgnoreMouseEvents(true)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function setDefaultPos () {
  const scrSize = screen.getPrimaryDisplay().workAreaSize
  const winSize = mainWindow.getSize()
  mainWindow.setPosition(scrSize.width - winSize[0] - 30, 30)
}

function showWindow () {
  if (!mainWindow.isVisible()) mainWindow.show()
}

// ipcMain.on('setIgnoreMouseEvents', (event, ignore) => {
//   if (ignore) mainWindow.setIgnoreMouseEvents(true, { forward: true })
//   else mainWindow.setIgnoreMouseEvents(false)
// })

ipcMain.on('hideWindow', event => {
  mainWindow.hide()
})
