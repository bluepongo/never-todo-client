import axios from 'axios'

const path = require('path')

const baseUrl = 'http://localhost:8080/todo/'
const tasksUrl = '/task'
const getTasksByContentUrl = '/content'
const getTasksByTagUrl = '/tag'
const tagsUrl = '/tag'

export default{
  components: {
    axios
  }
}

// Tasks
export function getAllTasks () {
  return axios.get(
    path.join(baseUrl, tasksUrl))
}

export function getTasksByContent (content) {
  return axios.get(
    path.join(baseUrl, tasksUrl, getTasksByContentUrl, content))
}
export function getTasksByTag (tagID) {
  return axios.get(
    path.join(baseUrl, tasksUrl, getTasksByTagUrl, tagID))
}
export function addTask (data) {
  return axios.post(
    path.join(baseUrl, tasksUrl), data)
}
export function deleteTask (taskID) {
  return axios.delete(
    path.join(baseUrl, tasksUrl, taskID))
}
export function updateTask (data) {
  return axios.put(
    path.join(baseUrl, tasksUrl), data)
}

// Tags
export function getAllTags () {
  return axios.get(
    path.join(baseUrl, tagsUrl))
}
export function addTag (data) {
  return axios.post(
    path.join(baseUrl, tagsUrl), data)
}
export function deleteTag (TagID) {
  return axios.delete(
    path.join(baseUrl, tagsUrl, TagID))
}
export function updateTag (data) {
  return axios.put(
    path.join(baseUrl, tagsUrl), data)
}
