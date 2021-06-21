import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const filePath = path.join(STORE_PATH, '/data.json')
console.log(filePath)

const adapter = new FileSync(filePath)

const db = Datastore(adapter)
db._.mixin(LodashId)

db.set('path', filePath).write()

if (!db.has('initRun').value()) {
  db.set('data', {
    'tags': [
      {
        'id': -1,
        'content': '同左',
        'color': '#FF0000',
        'deleted': false,
        'selected': true,
        'edited': false
      },
      {
        'id': -2,
        'content': '待办',
        'color': '#00FF80',
        'deleted': false,
        'selected': false,
        'edited': false
      }
    ],
    'task_tags': [
      {
        'task_id': -1,
        'tag_id': -1
      },
      {
        'task_id': -2,
        'tag_id': -1
      },
      {
        'task_id': -3,
        'tag_id': -1
      },
      {
        'task_id': -1,
        'tag_id': -2
      },
      {
        'task_id': -2,
        'tag_id': -2
      },
      {
        'task_id': -4,
        'tag_id': -2
      },
      {
        'task_id': -5,
        'tag_id': -2
      }
    ],
    'tasks': [
      {
        'id': -1,
        'content': '单击查看任务详情',
        'completed': false,
        'deleted': false,
        'selected': false,
        'important': false
      },
      {
        'id': -2,
        'content': '双击快捷完成任务',
        'completed': false,
        'deleted': false,
        'selected': false,
        'important': false
      },
      {
        'id': -3,
        'content': '点击加号新增对应项目',
        'completed': false,
        'deleted': false,
        'selected': false,
        'important': false
      },
      {
        'id': -4,
        'content': '可以随意调整待办对应标签',
        'completed': false,
        'deleted': false,
        'selected': false,
        'important': false
      },
      {
        'id': -5,
        'content': '同样，双击已完成会撤销',
        'completed': true,
        'deleted': false,
        'selected': true,
        'important': false
      }
    ],
    'taskAutoIncVal': -6,
    'tagAutoIncVal': -3
  }).write()
  db.set('log', []).write()
  db.set('update', false).write()
  db.set('initRun', true).write()
}

export default db
