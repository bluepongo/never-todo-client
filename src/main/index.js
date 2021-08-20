'use strict'

import { app, BrowserWindow, screen, ipcMain, globalShortcut } from 'electron'
import { createTray } from '../renderer/utils/tray'

import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null
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
} else {
  // create mainWindow
  app.on('ready', () => {
    init()
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      init()
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

function init () {
  createWindow()
  setDefaultPos()
  setIPCEvent()
  createShorcut()
  createTray(showWindow)
}

function createWindow () {
  mainWindow = new BrowserWindow({
  // dev
  // transparent: false,
  // frame: true,
  // resizable: true,
  // alwaysOnTop: true,

  // pro
  // 背景透明
    transparent: true,
    // 边框
    frame: false,
    // 窗口可变
    resizable: true,

    // 最小化
    minimizable: false,
    // 最大化
    maximizable: false,
    // 标题栏
    skipTaskbar: true,
    // 窗口置顶
    alwaysOnTop: true,

    minWidth: 320,
    minHeight: 280,
    height: 300,
    width: 380,

    useContentSize: true,
    webPreferences: {
    // devTools: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function setDefaultPos () {
  const scrSize = screen.getPrimaryDisplay().workAreaSize
  const winSize = mainWindow.getSize()
  mainWindow.setPosition(scrSize.width - winSize[0] - 30, 30)
}

function setIPCEvent () {
  ipcMain.on('setIgnoreMouseEvents', (event, ...args) => {
    BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(...args)
  })

  ipcMain.on('hideWindow', event => {
    hideWindow()
  })

  ipcMain.on('switchFlash', event => {
    hideWindow()
  })

  ipcMain.on('windowOnTop', event => {
    windowOnTop()
  })
}

function createShorcut () {
  globalShortcut.register('Alt+CommandOrControl+H', function () {
    if (mainWindow.isVisible()) {
      hideWindow()
    } else {
      showWindow()
    }
  })
}

function showWindow () {
  if (!mainWindow.isVisible()) mainWindow.show()
  if (!mainWindow.isAlwaysOnTop()) mainWindow.focus()
}

function hideWindow () {
  if (mainWindow.isVisible()) mainWindow.hide()
}

function windowOnTop () {
  if (mainWindow.isAlwaysOnTop()) {
    mainWindow.setAlwaysOnTop(false)
  } else {
    mainWindow.setAlwaysOnTop(true)
  }
}

// const gotTheLock = app.requestSingleInstanceLock()

// if (!gotTheLock) {
//   app.quit()
// } else {
//   app.on('second-instance', (event, commandLine, workingDirectory) => {
//     // focus to first
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore()
//       mainWindow.focus()
//     }
//   })
// }

// 自动更新
// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })
