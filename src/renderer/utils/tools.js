import {app} from 'electron'

export function getDataPath () {
  console.log(app.getPath('userData'))
  return app.getPath('userData')
}
