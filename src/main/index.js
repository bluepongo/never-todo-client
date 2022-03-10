'use strict'

import { app, BrowserWindow, screen, ipcMain, globalShortcut } from 'electron'
import { createTray } from '../renderer/utils/tray'
import { getZoomFactor, setZoomFactor } from '../renderer/utils/zoom'

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
    transparent: true, // 背景透明
    frame: false, // 边框
    resizable: true, // 窗口可变

    minimizable: false, // 最小化
    maximizable: false, // 最大化
    skipTaskbar: true, // 标题栏

    minWidth: 228,
    minHeight: 200,
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

function registerLocalShortcuts () {
  const zoomFactors = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]
  globalShortcut.register('CommandOrControl+-', () => {
    const currentZoomFactor = getZoomFactor()
    if (currentZoomFactor <= zoomFactors[0]) {
      return
    }
    for (let i = 0; i < zoomFactors.length; i++) {
      if (currentZoomFactor < zoomFactors[i]) {
        setZoomFactor(zoomFactors[i])
      }
    }
  })
  globalShortcut.register('CommandOrControl+=', () => {
    const currentZoomFactor = getZoomFactor()
    if (currentZoomFactor >= zoomFactors[-1]) {
      return
    }
    for (let i = zoomFactors.length - 1; i >= 0; i--) {
      if (currentZoomFactor > zoomFactors[i]) {
        setZoomFactor(zoomFactors[i])
      }
    }
  })
}

function unregisterLocalShortcuts () {
  globalShortcut.unregister('CommandOrControl+-')
  globalShortcut.unregister('CommandOrControl+=')
}

function createShorcut () {
  globalShortcut.register('Alt+CommandOrControl+H', function () {
    if (mainWindow.isVisible()) {
      hideWindow()
    } else {
      showWindow()
    }
  })
  registerLocalShortcuts()
  mainWindow.on('focus', registerLocalShortcuts)
  mainWindow.on('blur', unregisterLocalShortcuts)
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

// 自动更新
// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })
