'use strict'

import { app, BrowserWindow, screen } from 'electron'
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
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

function createWindow () {
  mainWindow = new BrowserWindow({
    useContentSize: true,
    // height: 300,
    // width: 400,
    // minHeight: 300,
    // minWidth: 400,
    transparent: true,
    frame: false,
    resizable: true,

    // minimizable: false,
    // maximizable: false,
    // skipTaskbar: true,
    // alwaysOnTop: true,
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
