<template>
  <div
    class="container"
    id="Task"
  >
    <div class="py-5 text-center">
      <h2>Never TODO</h2>
    </div>
    <div class="row">
      <!-- 左侧栏 -->
      <div class="col-md-8 order-md-1">
        <!-- 待办列表 -->
        <h4 class="mb-3">待办列表</h4>
        <hr class="mb-4" />
        <!-- 具体待办内容 -->
        <div
          class="custom-checkbox"
          v-for="(fullTask, taskID) in fullTasks"
          :key="taskID + 'todo'">
          <div v-show="!fullTask.task.compeleted">
            <el-checkbox @change="compeleteTask(taskID)" v-model="fullTask.task.compeleted"></el-checkbox>
            <a>{{ fullTask.task.content }}</a>
            <a
              v-for="tagID in fullTask.tagsID"
              :key="tagID"
              :style="{
                'padding':'3px',
                'border-radius':'60px',
                'background-color':tags[tagID].color,
                'font-size':'10px',
                'font-weight':'700',
                'color':'#FFFFFF',
                'text-align':'right'}">
              {{ tags[tagID].content }}
            </a>
            <img
              src="../assets/del.png"
              @click="deleteOldTask(fullTask.task.id)"
              width="15px"
              height="15px"/>
            <img
              src="../assets/update.png"
              @click="handleOpenTaskDialog(fullTask.task.id)"
              width="15px"
              height="15px"/>
          </div>
        </div>

        <hr class="mb-4" />

        <!-- 已完成列表 -->
        <h4 class="mb-3">已完成</h4>
        <hr class="mb-4" />
        <!-- 具体已完成内容 -->
        <div
          class="custom-checkbox"
          v-for="(fullTask, taskID) in fullTasks"
          :key="taskID + 'done'">
          <div v-show="fullTask.task.compeleted">
            <el-checkbox @change="uncompeleteTask(taskID)" v-model="fullTask.task.compeleted"></el-checkbox>
            <a>{{ fullTask.task.content }}</a>
            <a
              v-for="tagID in fullTask.tagsID"
              :key="tagID"
              :style="{
                'padding':'3px',
                'border-radius':'60px',
                'background-color':tags[tagID].color,
                'font-size':'10px',
                'font-weight':'700',
                'color':'#FFFFFF',
                'text-align':'right'}">
              {{ tags[tagID].content }}
            </a>
            <img
              src="../assets/del.png"
              @click="deleteOldTask(fullTask.task.id)"
              width="15px"
              height="15px"/>
            <img
              src="../assets/update.png"
              @click="handleOpenTaskDialog(fullTask.task.id)"
              width="15px"
              height="15px"/>
          </div>
        </div>

        <!-- 修改待办列表内容 -->
        <el-dialog
          title="修改待办任务信息"
          :visible.sync="taskDialogVisible"
          width="30%"
          :show-close="true"
          @close='handleCloseFullTaskDialog'>
          <!-- 修改栏信息 -->
          <label for="el-input">代办内容:</label>
          <el-input v-model="taskDialogFullTaskInfo.content"></el-input>
          <br />
          <label for="el-input">赋予标签:</label>
          <div
            v-for="(tag, tagID) in tags"
            :key="tagID">
            <input
              type="checkbox"
              :checked="tag.flag"/>
            <span class="badge badge-secondary badge-pill">
              {{tag.content}}
            </span>
          </div>
          <span
            slot="footer"
            class="dialog-footer">
            <!-- <el-button @click="handleCloseFullTaskDialog()">取 消</el-button> -->
            <el-button
              type="primary"
              @click="updateOldTask(task.id)">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 添加新的待办事项 -->
        <hr class="mb-4" />
        <h4 class="mb-3">新增</h4>
        <hr class="mb-4" />
        <div class="row">
          <div class="col-md-9 mb-3">
            <input
              type="text"
              class="form-control"
              id="cc-name"
              v-model="taskFormTaskInfo.content"/>
          </div>
          <br />
          <div class="col-md-3 mb-3">
            <button
              class="btn btn-primary btn-sm"
              @click="addNewTask()">
              添加
            </button>
          </div>
          <div
            v-for="(tag, tagID) in tags"
            :key="tagID">
            <input
              type="checkbox"
              :checked="tag.flag"/>
            <a
              :style="{
                'padding':'3px',
                'border-radius':'10px',
                'background-color':tag.color,
                'font-size':'10px',
                'font-weight':'700',
                'color':'#FFFFFF',
                'text-align':'right'}">
                {{tag.content}}
            </a>
          </div>
        </div>
      </div>

      <div class="col-md-4 order-md-2 mb-4">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">标签</span>
          <span class="badge badge-secondary badge-pill">{{
            tags.length
          }}</span>
        </h4>

        <!-- 标签列表 -->
        <ul class="list-group mb-3">
          <!-- 具体的标签 -->
          <li
            class="list-group-item d-flex justify-content-between lh-condensed"
            v-for="(tag, tagID) in tags"
            :key="tagID"
            :style="{'background-color':tag.color}">
            <div>
              <h6 class="my-0">{{ tag.content }}</h6>
              <small class="text-muted">{{ tag.desc }}</small>
              <img
                src="../assets/del.png"
                @click="deleteOldTag(tagID)"
                width="15px"
                height="15px"/>
              <img
                src="../assets/update.png"
                @click="handleOpenTagDialog(tagID)"
                width="15px"
                height="15px"/>
            </div>
          </li>
        </ul>

        <!-- 修改标签内容 -->
        <el-dialog
          title="修改标签信息"
          :visible.sync="tagDialogVisible"
          width="30%"
          :show-close="true"
          @close='handleCloseTagDialog'>
          <!-- 修改栏信息 -->
          <label for="el-input">标签内容：</label>
          <el-input v-model="tagDialogTagInfo.content"></el-input>
          <label for="el-input">标签描述：</label>
          <el-input
            type="textarea"
            v-model="tagDialogTagInfo.desc"
          ></el-input>
          <label for="el-input">标签颜色：</label>
          <el-color-picker v-model="tagDialogTagInfo.color"></el-color-picker>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              type="primary"
              @click="updateTag(id)"
            >确 定</el-button>
          </span>
        </el-dialog>

      </div>

    </div>

    <!-- 底部 -->
    <footer class="my-5 pt-5 text-muted text-center text-small">
      <p class="mb-1">© 2017-2020 Company Name</p>
      <ul class="list-inline">
        <li class="list-inline-item"><a>Privacy</a></li>
        <li class="list-inline-item"><a>Terms</a></li>
        <li class="list-inline-item"><a>Support</a></li>
      </ul>
    </footer>
  </div>
</template>

<script>
// import {getAllTasks, getTasksByContent, getTasksByTag, addTask, deleteTask， updateTask} from '@/api/todo'
// import {getAllTags, addTag, deleteTag, updateTag} from '@/api/todo'
import axios from 'axios'
const path = require('path')
export default {
  name: 'Todo',
  data () {
    return {
      fullTasks: {},
      taskFormTaskInfo: {content: ''},
      taskDialogVisible: false,
      taskDialogFullTaskInfo: {content: '', desc: '', color: ''},

      tags: {},
      tagFormTagInfo: {},
      tagDialogVisible: false,
      tagDialogTagInfo: {}
    }
  },
  methods: {
    initData () {
      axios.get('http://localhost:7986/api/v1/todo/all')
        .then((response) => {
          let data = response.data.result
          this.fullTasks = {}
          this.tags = {}
          // 初始化待办/标签数据
          for (const fullTask of data.fullTasks) {
            this.$set(this.fullTasks, fullTask.task.id, fullTask)
          }
          for (const tag of data.tags) {
            tag.flag = false
            this.$set(this.tags, tag.id, tag)
          }
        })
        .catch(function (error) {
          console.log('initialize data failed', error)
        })
    },
    addNewTask () {
      if (this.addContent !== '') {
        let tagsID = []
        for (let tag of this.tags) {
          if (tag.flag) {
            tagsID.push(tag.ID)
          }
        }
        axios.post('http://localhost:7986/api/v1/todo/task', {
          TaskContent: this.addContent,
          TagsID: tagsID
        })
          .then(response => {
            if (response.data.status === 0) {
              // TODO: modify local
              this.initData()
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.addContent = ''
      }
    },
    deleteOldTask (id) {
      axios.delete(path.join('http://localhost:7986/api/v1/todo/task', id))
        .then(response => {
          if (response.data.status === 0) {
            // TODO: modify local
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateOldTask (id) {
      let tagsID = []
      for (const tag of this.tags) {
        if (tag.Flag) {
          tagsID.push(tag.ID)
        }
      }
      axios.put(path.join('http://localhost:7986/api/v1/todo/task/', id), {
        taskContent: this.updateContent,
        taskCompeleted: this.tasks[id].taskCompeleted,
        tagsID: tagsID
      })
        .then(response => {
          if (response.data.status === 0) {
            // TODO: modify local
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.updateTaskVisible = false
    },
    compeleteTask (id) {
      this.fullTasks[id].task.compeleted = true
      console.log('commplete task:', id)
    },
    uncompeleteTask (id) {
      this.fullTasks[id].task.compeleted = false
      console.log('uncommplete task:', id)
    },
    addNewtag () {
      if (this.tagFormTagInfo !== null) {
        axios.post('http://localhost:7986/api/v1/todo/tag/', {
          TagContent: this.addTagName,
          TagDesc: this.addTagInfo
        })
          .then(response => {
            if (response.data.status === 0) {
              // TODO: modify local
              this.initData()
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.tagFormTagInfo = null
      }
    },
    deleteOldTag (id) {
      axios.delete(path.join('http://localhost:7986/api/v1/todo/tag/', id))
        .then(response => {
          if (response.data.status === 0) {
            // TODO: modify local
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateOldTag (id) {
      axios.delete(path.join('http://localhost:7986/api/v1/todo/tag/', id), {
        content: this.tagDialogTagInfo.content,
        desc: this.tagDialogTagInfo.desc,
        color: this.tagDialogTagInfo.color
      })
        .then(response => {
          if (response.data.status === 0) {
            // TODO: modify local
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.updateTagVisible = false
    },
    handleOpenTaskDialog (taskID) {
      this.taskDialogVisible = true
      this.taskDialogFullTaskInfo = this.fullTasks[taskID].task
      for (var tagID in this.tags) {
        this.tags[tagID].flag = false
      }
      for (const tagID of this.fullTasks[taskID].tagsID) {
        this.tags[tagID].flag = true
      }
    },
    handleCloseFullTaskDialog () {
      for (var tagID in this.tags) {
        this.tags[tagID].flag = false
      }
    },
    handleOpenTagDialog (tagID) {
      this.tagDialogVisible = true
      this.tagDialogTagInfo = this.tags[tagID]
    },
    handleCloseTagDialog () {
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.initData()
    //   console.log(this.fullTasks, this.tags)
    // })
    this.initData()
    // console.log('new', this.fullTasks)
  }
}
</script>
