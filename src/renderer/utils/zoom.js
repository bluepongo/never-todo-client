import { webFrame } from 'electron'

export function getZoomFactor () {
  return webFrame.getZoomFactor()
}

export function setZoomFactor (zoomFactor) {
  return webFrame.setZoomFactor(zoomFactor)
}
