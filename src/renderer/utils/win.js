import db from './db'

export function getZoomFactor () {
  return db.read().get('zoom').value()
}

export function setZoomFactor (zoom) {
  db.read().set('zoom', zoom.toString()).write()
  db.read().set('updateApp', true).write()
}

export function getWinSize () {
  let winW = db.read().get('winW').value()
  if (!winW) winW = 380
  let winH = db.read().get('winH').value()
  if (!winH) winH = 300
  return [winW, winH]
}

export function setWinSize (w, h) {
  db.read().set('winW', w).write()
  db.read().set('winH', h).write()
}

export function getWinPos (scrSize) {
  const winSize = getWinSize()
  let winX = db.read().get('winX').value()
  if (!winX) winX = scrSize.width - winSize[0] - 30
  let winY = db.read().get('winY').value()
  if (!winY) winY = 30
  return [winX, winY]
}

export function setWinPos (x, y) {
  db.read().set('winX', x).write()
  db.read().set('winY', y).write()
}

export function isAlwaysOnTop () {
  let alwaysTop = db.read().get('alwaysTop').value()
  if (!alwaysTop) alwaysTop = false
  return alwaysTop
}
