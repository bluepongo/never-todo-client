import {
  remote,
  app,
  Tray,
  Menu,
  shell
} from 'electron'
import { readFile } from 'fs'
import fs from 'fs-extra'
import path from 'path'

import { judgeOldData, validateData } from './validation'
import db from './db'

const dialog = require('electron').dialog

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const filePath = path.join(STORE_PATH, '/data.json')

let tray

function getThemeSubMenus () {
  let themeSubMenus = []
  const themes = [
    {name: '暗黑深色', theme: 'dark'},
    {name: '明亮浅色', theme: 'light'},
    {name: '樱花粉色', theme: 'pink'},
    {name: '夏日翠色', theme: 'green'},
    {name: '护眼绿色', theme: 'eyes'},
    {name: '长裙黄色', theme: 'yellow'}
  ]
  themes.forEach(theme => {
    themeSubMenus.push(
      {
        label: theme.name,
        type: 'radio',
        checked: db.read().get('theme').value() === theme.theme,
        click: () => {
          readFile(filePath, 'utf-8', function (err, jsonStr) {
            if (err) {
              dialog.showErrorBox('修改主题失败', '当前无法修改主题，请稍后再试')
            } else {
              // 设置需要进行数据更新
              db.read().set('theme', theme.theme).write()
              db.read().set('update', true).write()
              db.read().set('updateApp', true).write()
            }
          })
        }
      }
    )
  })
  return themeSubMenus
}

function getOpacitySubMenus () {
  let opacitySubMenus = []
  const opacitys = [
    {name: '100%', value: '100'},
    {name: '80%', value: '80'},
    {name: '60%', value: '60'},
    {name: '40%', value: '40'}
  ]
  opacitys.forEach(opacity => {
    opacitySubMenus.push(
      {
        label: opacity.name,
        type: 'radio',
        checked: db.read().get('opacity').value() === opacity.value,
        click: () => {
          readFile(filePath, 'utf-8', function (err, jsonStr) {
            if (err) {
              dialog.showErrorBox('修改透明度失败', '当前无法修改透明度，请稍后再试')
            } else {
              // 设置需要进行数据更新
              db.read().set('opacity', opacity.value).write()
              db.read().set('updateApp', true).write()
            }
          })
        }
      }
    )
  })
  return opacitySubMenus
}

function getZoomSubMenus () {
  let zoomSubMenus = []
  const zooms = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2]
  zooms.forEach(zoom => {
    zoomSubMenus.push(
      {
        label: Math.floor(zoom * 100) + '%',
        type: 'radio',
        checked: db.read().get('zoom').value() === zoom.toString(),
        click: () => {
          readFile(filePath, 'utf-8', function (err, jsonStr) {
            if (err) {
              dialog.showErrorBox('修改缩放比例失败', '当前无法修改缩放比例，请稍后再试')
            } else {
              // 设置需要进行数据更新
              db.read().set('zoom', zoom.toString()).write()
              db.read().set('update', true).write()
              db.read().set('updateApp', true).write()
            }
          })
        }
      }
    )
  })
  return zoomSubMenus
}

export function createTray (showWindow) {
  tray = new Tray(path.join(__static, './logo-16.png'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示界面',
      click () {
        showWindow()
      }
    },

    {
      label: '开机启动',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click () {
        if (!app.isPackaged) {
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin,
            path: process.execPath
          })
        } else {
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin
          })
        }
      }
    },

    {
      label: '数据文件',
      submenu: [
        {
          label: '查看文件',
          click: () => {
            shell.openItem(
              filePath
            )
          }
        },
        {
          label: '导出数据',
          click: () => {
            dialog.showSaveDialog({
              filters: [
                {
                  name: '数据文件',
                  extensions: ['json'] // 文件后缀名类型， 如md
                }
              ],
              defaultPath: path.join(STORE_PATH, '/export.json'),
              title: '导出数据'
            }, result => {
              if (!result) {
                return
              }
              // 将db中的data导出至文件中
              let str = JSON.stringify({
                data: db.read().get('data').value(),
                log: db.read().get('log').value()
              })
              fs.writeFileSync(result, str, 'utf8')
            })
          }
        },
        {
          label: '导入数据',
          click: () => {
            dialog.showOpenDialog({
              properties: ['openFile'],
              title: '导入数据',
              filters: [
                {
                  name: '数据文件',
                  extensions: ['json']
                }
              ]}, result => {
              if (!result) {
                return
              }
              readFile(result[0], 'utf-8', function (err, jsonStr) {
                if (err) {
                  dialog.showErrorBox('导入数据失败', '无法打开所选文件')
                } else {
                  let data = JSON.parse(jsonStr)
                  if (validateData(data)) {
                    if (judgeOldData(data)) {
                      data.data.log = data.log
                    }
                    // 仅将对象中的data和log属性导入
                    db.read().set('data', data.data).write()
                    db.read().set('log', data.log).write()
                    // 设置需要进行数据更新
                    db.read().set('initRun', true).write()
                    db.read().set('update', true).write()
                  } else {
                    dialog.showErrorBox('导入数据失败', '所选文件包含无效数据')
                  }
                }
              })
            })
          }
        }
      ]
    },
    {
      label: '页面缩放',
      submenu: getZoomSubMenus()
    },
    {
      label: '主题换肤',
      submenu: getThemeSubMenus()
    },
    {
      label: '不透明度',
      submenu: getOpacitySubMenus()
    },
    {
      label: '项目地址',
      click: () => {
        shell.openExternal('https://github.com/bluepongo/never-todo-client')
      }
    },
    {
      label: '问题反馈',
      click: () => {
        shell.openExternal(
          'https://github.com/bluepongo/never-todo-client/issues'
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
