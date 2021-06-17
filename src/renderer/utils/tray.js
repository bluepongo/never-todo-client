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

import { validateData } from './validation'
import db from './db'

const dialog = require('electron').dialog

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
          readFile(result[0], 'utf-8', function (err, jsonStr) {
            if (err) {
              dialog.showErrorBox('导入数据失败', '无法打开所选文件')
            } else {
              let data = JSON.parse(jsonStr)
              if (validateData(data)) {
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
