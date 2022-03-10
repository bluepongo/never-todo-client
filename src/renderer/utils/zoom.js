import db from './db'

export function getZoomFactor () {
  return db.read().get('zoom').value()
}

export function setZoomFactor (zoom) {
  db.read().set('zoom', zoom.toString()).write()
  db.read().set('updateApp', true).write()
}
