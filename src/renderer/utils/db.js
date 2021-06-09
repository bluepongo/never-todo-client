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

if (!db.has('initRun').value()) {
  db.set('data', {
    tags: [
      {
        id: 1,
        content: '吃饭',
        color: '#FF0000',
        deleted: false
      },
      {
        id: 2,
        content: '健身',
        color: '#00FF00',
        deleted: false
      },
      {
        id: 3,
        content: '小日子',
        color: '#0000FF',
        deleted: false
      },
      {
        id: 4,
        content: '不该出现的标签',
        color: '#FFFF00',
        deleted: true
      }
    ],
    task_tags: [
      {
        task_id: 1,
        tag_id: 1
      },
      {
        task_id: 1,
        tag_id: 3
      },
      {
        task_id: 2,
        tag_id: 2
      },
      {
        task_id: 3,
        tag_id: 1
      },
      {
        task_id: 3,
        tag_id: 2
      },
      {
        task_id: 3,
        tag_id: 3
      },
      {
        task_id: 3,
        tag_id: 4
      },
      {
        task_id: 4,
        tag_id: 1
      }
    ],
    tasks: [
      {
        id: 1,
        content: '记得吃早饭',
        completed: false,
        deleted: false
      },
      {
        id: 2,
        content: '记得做早操',
        completed: false,
        deleted: false
      },
      {
        id: 3,
        content: '记得要边吃早饭边做早操，然后捡到六个核桃，只好穿越回上世纪90年代吃饭做早操',
        completed: false,
        deleted: false
      },
      {
        id: 4,
        content: '明天记得吃晚饭',
        completed: true,
        deleted: false
      },
      {
        id: 4,
        content: '不该出现的待办任务',
        completed: false,
        deleted: true
      }
    ]
  }).write()
  db.set('initRun', true).write()
}

export default db
