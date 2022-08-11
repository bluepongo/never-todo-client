export function validateData (obj) {
  if ('data' in obj) {
    if ('tags' in obj.data && 'tasks' in obj.data && 'task_tags' in obj.data) { return true }
  }
  return false
}

export function judgeOldData (obj) {
  if (!('log' in obj) && 'log' in obj.data) {
    return true
  }
  return false
}
