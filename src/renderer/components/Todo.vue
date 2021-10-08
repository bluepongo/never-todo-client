<template>
  <div
    class="box"
    :style="theme.box"
    id="Task"
    @click="resetAllState"
    @keyup.page-down="switchToNextSection"
  >
    <div class="body">
      <div class="left-panel">
        <div class="title">
          <span class="text" :style="theme.text" style="font-size: 20px;">
            &nbsp;任务&nbsp;<i title="添加任务" class="el-icon-circle-plus" @click.stop="handleAddTask"></i>
          </span>
        </div>

        <div :class="theme.taskListScroll" :style="theme.taskList">
          <input
            class="text"
            :style="theme.text"
            placeholder="请输入新任务内容"
            ref="taskContent"
            v-if="newTaskVisible"
            v-model= "newTaskInfo.content"
            v-focus
            @input="autoTextarea($event)"
            @keyup.enter="addTask($event)"
            @blur="addTask()">
          <span class="text" :style="theme.text" @click.stop="todoTasksFolded = !todoTasksFolded">
          <i v-if="todoTasksFolded" class="el-icon-arrow-right"></i>
          <i v-else class="el-icon-arrow-down"></i>
          <span :class="theme.text">进行中</span>
          <span class="badge badge-secondary badge-pill">{{todoFullTasks.length}}</span>
          </span>
          <div>
            <div v-if="!todoTasksFolded">
              <div
                class="task-list-item"
                :style="theme.taskListItem"
                style="font-size: 16px;"
                v-for="fullTask in todoFullTasks"
                :key="fullTask.task.id"
                :class="{'select':fullTask.task.selected, 'focus': fullTask.task.focused}"
                @click.stop="selectTask(fullTask.task)"
                @dblclick.stop="completeTask(fullTask.task)"
              >
                <!-- <el-checkbox @change="completeTask(fullTask.task_id)" v-model="fullTask.task.Completed"></el-checkbox> -->
                <div v-if="!fullTask.task.deleted" class="first-row">
                  <div v-if="!fullTask.task.selected">
                    <div style="float: left; width:20px">
                      <div title="完成任务" class="task-dot" :style="theme.taskDot" @click.stop="completeTask(fullTask.task)"></div>
                    </div>
                    <div style="display: flex">
                      <span :class="fullTask.task.important?'important-text':theme.text">  {{ fullTask.task.content }} <span>
                          <div
                            class="tag-dot"
                            v-for="tag in fullTask.tags"
                            :key="tag.id"
                            :style="{'background-color': tag.color}"></div>
                        </span>
                      </span>

                    </div>
                  </div>
                  <div v-else>
                    <input
                      class="text"
                      :style="theme.text"
                      ref="taskContent"
                      v-model= "fullTask.task.content"
                      v-focus
                      @click.stop=""
                      @input="autoTextarea($event)"
                      @keyup.enter="modifyTaskContent(fullTask.task, $event)"
                      @blur="modifyTaskContent(fullTask.task)">
                    <div>
                    <span :class="theme.textSmall">
                     已选择：
                    </span>
                    <span class="text-small" v-for="tag in fullTask.tags" :key="'left'+tag.id" >
                      <span
                        title="取消标签"
                        class="tag-icon"
                        :style="{'border-color': tag.color,}"
                        style="margin-right: 4px;"
                        @click.stop="delTagForTask(fullTask.task.id, tag.id)"
                      >{{ tag.content }}</span>
                    </span>
                    </div>
                    <div>
                    <span :class="theme.textSmall">
                      未选择：
                    </span>
                    <span class="text-small" v-for="tag in tags" :key="'right'+tag.id" >
                      <span
                        title="选择标签"
                        v-if="!tag.deleted && assignedTags.indexOf(tag.id) === -1"
                        class="tag-icon"
                        :style="{'border-color': tag.color,}"
                        style="margin-right: 4px;"
                        @click.stop="addTagForTask(fullTask.task.id, tag.id)"
                      >{{ tag.content }}</span>
                    </span>
                    </div>
                  </div>
                </div>
                <div class="second-row" v-show="fullTask.task.selected">
                  <span class="text">
                      <i
                        title="将任务设为重要"
                        :class="fullTask.task.important?'el-icon-star-on':'el-icon-star-off'"
                        @click.stop="switchImportance(fullTask.task)"
                        @dblclick.stop=""
                      ></i>&nbsp;&nbsp;

                    <i
                      title="删除任务"
                      class="el-icon-delete"
                      @click.stop="deleteTask(fullTask.task)"
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <span class="text" :style="theme.text" @click.stop="doneTasksFolded = !doneTasksFolded">
            <i v-if="doneTasksFolded" class="el-icon-arrow-right"></i>
            <i v-else class="el-icon-arrow-down"></i>
            <span class="text" :style="theme.text">已完成</span>
            <span class="badge badge-secondary badge-pill">{{doneFullTasks.length}}</span>
          </span>
          <div>
            <div v-if="!doneTasksFolded">
              <div
                class="task-list-item"
                :style="theme.taskListItem"
                style="font-size: 16px;"
                v-for="fullTask in doneFullTasks"
                :key="fullTask.task.id"
                :class="{'select':fullTask.task.selected, 'focus': fullTask.task.focused}"
                @click.stop="selectTask(fullTask.task)"
                @dblclick.stop="uncompleteTask(fullTask.task)"
              >
                <div >
                  <div style="float: left; width:20px">
                    <div title="取消完成任务" class="task-dot" :style="theme.taskDot" @click.stop="uncompleteTask(fullTask.task)">
                      <i class="el-icon-check" :style="theme.dotTick"></i>
                    </div>
                  </div>
                  <div style="display: flex">
                    <span :class="fullTask.task.important?'important-text':theme.text" style="opacity: 0.5">
                      <s>{{ fullTask.task.content }}</s>
                      <div
                      class="tag-dot"
                      v-for="tag in fullTask.tags"
                      :key="tag.id"
                      :style="{'background-color': tag.color}"></div>
                    </span>

                  </div>
                  <div class="second-row">
                    <span v-if="fullTask.task.selected">
                      <span class="text">
                        &nbsp;
                        <i title="取消完成任务" class="el-icon-refresh-left" @click.stop="uncompleteTask(fullTask.task)"></i>&nbsp;&nbsp;
                        <i title="删除任务" class="el-icon-delete" @click.stop="deleteTask(fullTask.task)"></i>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <span> {{ filePath }} </span> -->
        </div>
      </div>

      <div class="right-panel">
        <div><span class="text" :style="theme.text" style="font-size: 20px;">标签&nbsp;<i title="添加标签" class="el-icon-circle-plus" @click.stop="handleAddTag"></i></span></div>
        <div :class="theme.tagListScroll" :style="theme.tagList">
          <input
            class="text"
            :style="theme.text"
            placeholder="新标签内容"
            ref="tagContent"
            v-if="newTagVisible"
            v-model= "newTagInfo.content"
            v-focus
            @input="autoTextarea($event)"
            @click.stop=""
            @keyup.enter="addTag($event)"
            @blur="addTag()">
          <div
            class="tag-item"
            :class="{'select': noTagSelect, 'focus': noTagFocus}"
            @mouseover="noTagActive = true"
            @mouseleave="noTagActive = false"
            @click="selectNoTag()"
          >
            <div >
              <span class="tag-flag" :style="theme.allTag"></span>
              <span class="tag-item-text text" :style="theme.tagItemText">全部</span>
            </div>
          </div>
          <div
            class="tag-item"
            v-for="tag in tags"
            :key="tag.id"
            :class="{'select':tag.selected, 'focus': tag.focused}"
            @click.stop="selectTag(tag)"
            @dblclick="$set(tag, 'edited', true)"
          >
            <div v-if="!tag.deleted">
              <!-- <span v-if="tag.assigned" :style="{'background-color': tag.color}"></span> -->
              <!-- <colorPicker v-model="tag.color" /> -->
              <div v-if="!tag.edited">
                <div style="float: left; width:16px">
                  <div  class="tag-flag" :style="{'background-color': tag.color}"></div>
                </div>
                <div style="display: flex;">
                  <span class="tag-item-text text" :style="theme.tagItemText">{{ tag.content }}</span>
                </div>
              </div>

              <input
                class="text"
                :style="theme.text"
                style="font-size: 14px;"
                ref="tagContent"
                v-else
                v-model= "tag.content"
                v-focus
                @click.stop=""
                @input="autoTextarea($event)"
                @keyup.enter="modifyTagContent(tag, $event)"
                @blur="modifyTagContent(tag)">
              <div class="second-row">
                <span v-if="tag.edited"  class="text">
                  <i title="选择标签颜色" class="el-icon-brush" @click.stop="handlePickColor(tag)"></i>&nbsp;&nbsp;
                  <i title="删除标签" class="el-icon-delete" @click.stop="deleteTag(tag)"></i>&nbsp;&nbsp;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <compact-picker
      v-if="colorPickerVisible"
      @input="pickColor"
      :value="currentTagColor"
      :palette="availableTagColors"
    ></compact-picker>

  </div>
</template>

<script>
// import
// import {getAll} from '@/api/todo'
// import {getAllTasks, getTasksByContent, getTasksByTag, addTask, deleteTask， modifyTask} from '@/api/todo'
// import {getAllTags, addTag, deleteTag, updateTag} from '@/api/todo'
// import { readFile } from 'fs'
import db from '@/utils/db'
// import { filter } from 'vue/types/umd'
export default {
  name: 'todo',
  data () {
    return {
      filePath: '',

      theme: {
        style: 'dark',
        box: '',
        taskList: '',
        taskListItem: '',
        taskDot: '',
        text: '',
        textSmall: '',
        tagList: '',
        tagItemText: '',
        allTag: '',
        dotTick: '',
        taskListScroll: '',
        tagListScroll: 'dark'
      },

      focusTarget: 'todo',
      tasks: [],
      taskAutoIncVal: -1,
      newTaskVisible: false,
      newTaskInfo: { id: 0, content: '', completed: false, deleted: false, important: false },
      doneTasksFolded: true,
      todoTasksFolded: false,

      tags: [],
      tagAutoIncVal: -1,
      newTagVisible: false,
      newTagInfo: { id: 0, content: '', color: '#AAAAAA', deleted: false },
      noTagActive: false,
      noTagSelect: true,
      noTagFocus: false,

      taskTags: [],
      assignedTags: [],

      pickColorTagId: '',
      availableTagColorsName: [
        'crimson', 'red', 'yellow',
        'brown', 'green', 'cyan',
        'sky', 'blue', 'purple',
        'pink', 'grey', 'black'
      ],
      availableTagColors: [
        '#FF0000', '#FF8000', '#FFFF00',
        '#804040', '#00FF80', '#00FFFF',
        '#0080FF', '#0000FF', '#8000FF',
        '#FF00FF', '#AAAAAA', '#404040'
      ],
      currentTagColor: '#000000',

      colorPickerVisible: false
    }
  },
  watch: {
    taskContent () {
      let textArea = this.$refs['taskContent']
      if (textArea.scrollHeight < 100) {
        textArea.style.height = textArea.scrollHeight + 'px'
      } else {
        textArea.style.height = 100 + 'px'
      }
    }
  },
  computed: {
    fullTasks () {
      let fts = []
      for (let task of this.tasks) {
        if (task.deleted) continue
        let ft = {'task': task, 'tags': []}
        for (let tag of this.tags) {
          if (tag.deleted) continue
          for (let taskTag of this.taskTags) {
            if (task.id === taskTag.task_id && tag.id === taskTag.tag_id) {
              ft.tags.push(tag)
            }
          }
        }
        fts.push(ft)
      }
      return fts
    },
    filteredFullTasks () {
      if (this.noTagSelect) {
        return this.fullTasks
      }
      let ffts = []
      let selectedTagId = 0
      for (let tag of this.tags) {
        if (tag.selected) {
          selectedTagId = tag.id
        }
      }
      for (let taskTag of this.taskTags) {
        if (taskTag.tag_id === selectedTagId) {
          for (let fullTask of this.fullTasks) {
            if (fullTask.task.id === taskTag.task_id) {
              ffts.push(fullTask)
            }
          }
        }
      }
      return ffts
    },
    todoFullTasks () {
      let tfts = []
      for (let fullTask of this.filteredFullTasks) {
        if (!fullTask.task.completed) {
          tfts.push(fullTask)
        }
      }
      return tfts
    },
    doneFullTasks () {
      let dfts = []
      for (let fullTask of this.filteredFullTasks) {
        if (fullTask.task.completed) {
          dfts.push(fullTask)
        }
      }
      return dfts
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  mounted () {
    this.initData()
    this.timer()
  },
  destroyed () {
    clearInterval(this.timer) // 退出页面后销毁定时方法
  },
  methods: {
    switchTheme () {
      switch (this.theme.style) {
        case 'dark':
          this.theme.box = 'background-color: #111'
          this.theme.taskList = 'background-color: #111'
          this.theme.taskListItem = 'color: #ddd'
          this.theme.taskDot = 'background-color: rgba(0,0,0,0.8); border-color: #7a797b;'
          this.theme.text = 'color: #ddd'
          this.theme.textSmall = 'text-small'
          this.theme.tagList = 'background-color: #111'
          this.theme.tagItemText = 'color: #ddd'
          this.theme.allTag = 'background-color: #FFFFFF'
          this.theme.dotTick = 'color: #ddd'
          this.theme.taskListScroll = 'task-list'
          this.theme.tagListScroll = 'tag-list'
          break
        case 'light':
          this.theme.box = 'background-color: #ddd'
          this.theme.taskList = 'background-color: #ddd'
          this.theme.taskListItem = 'color: #444'
          this.theme.taskDot = 'background-color: rgba(201, 197, 209, 1.0); border-color: #444;'
          this.theme.text = 'color: #444'
          this.theme.textSmall = 'text-small-light'
          this.theme.tagList = 'background-color: #ddd'
          this.theme.tagItemText = 'color: #444'
          this.theme.allTag = 'background-color: #444'
          this.theme.dotTick = 'color: #444'
          this.theme.taskListScroll = 'task-list-light'
          this.theme.tagListScroll = 'tag-list-light'
          break
        case 'pink':
          this.theme.box = 'background-color: #ffbbf9'
          this.theme.taskList = 'background-color: #ffbbf9'
          this.theme.taskListItem = 'color: #444'
          this.theme.taskDot = 'background-color: rgba(249, 157, 234, 1.0); border-color: #444;'
          this.theme.text = 'color: #444'
          this.theme.textSmall = 'text-small'
          this.theme.tagList = 'background-color: #ffbbf9'
          this.theme.tagItemText = 'color: #444'
          this.theme.allTag = 'background-color: #444'
          this.theme.dotTick = 'color: #444'
          this.theme.taskListScroll = 'task-list-pink'
          this.theme.tagListScroll = 'tag-list-pink'
          break
        case 'green':
          this.theme.box = 'background-color: #40e2c1'
          this.theme.taskList = 'background-color: #40e2c1'
          this.theme.taskListItem = 'color: #444'
          this.theme.taskDot = 'background-color: rgba(129, 244, 189, 1.0); border-color: #444;'
          this.theme.text = 'color: #444'
          this.theme.textSmall = 'text-small'
          this.theme.tagList = 'background-color: #40e2c1'
          this.theme.tagItemText = 'color: #444'
          this.theme.allTag = 'background-color: #444'
          this.theme.dotTick = 'color: #444'
          this.theme.taskListScroll = 'task-list-green'
          this.theme.tagListScroll = 'tag-list-green'
          break
      }
    },

    timer () {
      return setInterval(() => {
        this.checkDataUpdate()
      }, 1000)
    },

    initData () {
      // By Lowdb database
      let data = db.read().get('data').value()
      let theme = db.read().get('theme').value()
      if (!theme) theme = 'dark'
      this.filePath = db.read().get('path').value()
      // 初始化待办/标签数据
      this.tasks = data.tasks
      this.tags = data.tags
      this.taskTags = data.task_tags
      this.taskAutoIncVal = data.taskAutoIncVal
      this.tagAutoIncVal = data.tagAutoIncVal
      this.theme.style = theme
      this.unselectAllTasks()
      this.unselectAllTags()
      this.switchTheme()
    },

    checkDataUpdate () {
      let updateFlag = db.read().get('update').value()
      if (updateFlag) {
        this.initData()
        db.read().set('update', false).write()
      }
    },

    resetAllState () {
      this.resetStateOfTask()
      this.resetStateOfTag()
    },

    resetStateOfTask () {
      this.unselectAllTasks()
      this.unfocusAllTasks()
    },
    resetStateOfTag () {
      this.uneditAllTags()
      this.unfocusAllTags()
      this.cancelPickColor()
    },

    selectTask (task) {
      if (task.selected) {
        task.selected = false
        return
      }
      this.unselectAllTasks()
      task.selected = true
      this.assignedTags = []
      for (let taskTag of this.taskTags) {
        if (taskTag.task_id === task.id) {
          this.assignedTags.push(taskTag.tag_id)
        }
      }
      this.resetStateOfTag()
    },
    unselectAllTasks () {
      for (let task of this.tasks) { this.$set(task, 'selected', false) }
    },
    unfocusAllTasks () {
      for (let task of this.tasks) { this.$set(task, 'focused', false) }
    },

    modifyTaskContent (task, event) {
      if (event) {
        event.target.blur()
      } else {
        this.updateTask()
        // console.log(this.standardizeTask(task))
        this.recordLog({
          target: 'tasks',
          type: 'update',
          data: this.standardizeTask(task),
          flag: ''
        })
      }
    },
    handleAddTask () {
      this.colorPickerVisible = false
      this.newTaskInfo = { id: 0, content: '', completed: false, deleted: false, important: false }
      this.newTaskVisible = true
      this.unselectAllTasks()
      this.cancelAddTag()
    },
    cancelAddTask () {
      this.newTaskVisible = false
    },
    addTask (event) {
      if (event) {
        event.target.blur()
      } else {
        if (this.newTaskInfo.content !== '') {
          this.newTaskInfo.id = this.taskAutoIncVal
          this.taskAutoIncVal--
          this.tasks.push(this.newTaskInfo)
          this.updateTask()
          this.recordLog({
            target: 'tasks',
            type: 'create',
            data: this.newTaskInfo,
            flag: ''
          })
          this.unselectAllTags()
        }
        this.cancelAddTask()
      }
    },
    deleteTask (task) {
      task.deleted = true
      this.updateTask()
      this.recordLog({
        target: 'tasks',
        type: 'delete',
        data: this.standardizeTask(task),
        flag: ''
      })
    },
    completeTask (task) {
      task.completed = true
      this.updateTask()
      this.recordLog({
        target: 'tasks',
        type: 'complete',
        data: this.standardizeTask(task),
        flag: ''
      })
      this.unselectAllTasks()
      this.cancelPickColor()
    },
    uncompleteTask (task) {
      task.completed = false
      this.updateTask()
      this.recordLog({
        target: 'tasks',
        type: 'uncomplete',
        data: this.standardizeTask(task),
        flag: ''
      })
      this.unselectAllTasks()
      this.cancelPickColor()
    },
    switchImportance (task) {
      this.$nextTick(() => {
        task.important = !task.important
      })
      this.updateTask()
      this.recordLog({
        target: 'tasks',
        type: 'important',
        data: this.standardizeTask(task),
        flag: ''
      })
    },
    updateTask () {
      db.read().get('data').set('tasks', []).write()
      for (let task of this.tasks) {
        db.read().get('data').get('tasks').push(this.standardizeTask(task)).write()
      }
      db.read().get('data').set('taskAutoIncVal', this.taskAutoIncVal).write()
    },
    standardizeTask (task) {
      return {
        id: task.id,
        content: task.content,
        completed: task.completed,
        deleted: task.deleted,
        important: task.important
      }
    },

    selectNoTag () {
      if (this.noTagSelect) { return }
      this.resetAllState()
      this.unselectAllTags()
      this.noTagSelect = true
    },
    focusNoTag () {

    },
    unselectAllTags () {
      for (let tag of this.tags) {
        this.$set(tag, 'selected', false)
        this.$set(tag, 'edited', false)
      }
      this.noTagSelect = true
    },
    unfocusAllTags () {
      for (let tag of this.tags) {
        this.$set(tag, 'focused', false)
      }
    },
    uneditAllTags () {
      for (let tag of this.tags) {
        this.$set(tag, 'edited', false)
      }
    },
    selectTag (tag) {
      if (tag.selected) {
        if (tag.edited) {
          this.$set(tag, 'edited', false)
        } else {
          this.$set(tag, 'edited', true)
        }
      } else {
        this.unselectAllTags()
        this.$set(tag, 'selected', true)
        this.noTagSelect = false
      }
      this.unselectAllTasks()
      this.cancelPickColor()
    },
    modifyTagContent (tag, event) {
      if (event) {
        event.target.blur()
      } else {
        this.updateTag()
        this.recordLog({
          target: 'tags',
          type: 'update',
          data: this.standardizeTag(tag),
          flag: ''
        })
      }
    },
    handleAddTag () {
      this.colorPickerVisible = false
      this.newTagInfo = { id: 0, content: '', color: '#AAAAAA', deleted: false }
      this.newTagVisible = true
      this.unselectAllTags()
      this.cancelAddTask()
    },
    cancelAddTag () {
      this.newTagVisible = false
    },
    addTag (event) {
      if (event) {
        event.target.blur()
      } else {
        if (this.newTagInfo.content !== '') {
          this.newTagInfo.id = this.tagAutoIncVal
          this.tagAutoIncVal--
          for (var ac = 0; ac < this.availableTagColors.length; ac++) {
            var flag = 1
            for (var ta = 0; ta < this.tags.length; ta++) {
              if (!this.tags[ta].deleted && this.tags[ta].color === this.availableTagColors[ac]) {
                flag = 0
                break
              }
            }
            if (flag === 1) {
              this.newTagInfo.color = this.availableTagColors[ac]
              break
            }
          }
          this.tags.push(this.newTagInfo)
          var colorCode = this.newTagInfo.color
          for (var i = 0; i < this.availableTagColors.length; i++) {
            if (this.newTagInfo.color === this.availableTagColors[i]) {
              this.newTagInfo.color = this.availableTagColorsName[i]
            }
          }
          this.updateTag()
          this.recordLog({
            target: 'tags',
            type: 'create',
            data: this.newTagInfo,
            flag: ''
          })
          this.newTagInfo.color = colorCode
        }
        this.cancelAddTag()
      }
    },
    deleteTag (tag) {
      tag.deleted = true
      this.updateTag()
      this.recordLog({
        target: 'tags',
        type: 'delete',
        data: this.standardizeTag(tag),
        flag: ''
      })
    },
    updateTag () {
      db.read().get('data').set('tags', []).write()
      for (let tag of this.tags) {
        db.read().get('data').get('tags').push(this.standardizeTag(tag)).write()
      }
      db.read().get('data').set('tagAutoIncVal', this.tagAutoIncVal).write()
    },
    standardizeTag (tag) {
      return { id: tag.id, content: tag.content, color: tag.color, deleted: tag.deleted }
    },

    addTagForTask (taskId, tagId) {
      this.taskTags.push({'task_id': taskId, 'tag_id': tagId})
      this.assignedTags.push(tagId)
      this.updateTaskTag()
      this.recordLog({
        target: 'task_tags',
        type: 'create',
        data: {task_id: taskId, tag_id: tagId},
        flag: ''
      })
    },
    delTagForTask (taskId, tagId) {
      for (var i = 0; i < this.taskTags.length; i++) {
        if (this.taskTags[i].task_id === taskId && this.taskTags[i].tag_id === tagId) {
          this.taskTags.splice(i, 1)
          this.assignedTags.splice(this.assignedTags.indexOf(tagId), 1)
          this.updateTaskTag()
          this.recordLog({
            target: 'task_tags',
            type: 'delete',
            data: {task_id: taskId, tag_id: tagId},
            flag: ''
          })
          break
        }
      }
    },
    updateTaskTag () {
      db.read().get('data').set('task_tags', this.taskTags).write()
    },

    switchToNextSection () {
      switch (this.focusTarget) {
        case 'todo':
          this.focusTarget = 'done'
          this.switchFocusToDoneTask()
          break
        case 'done':
          this.focusTarget = 'tag'
          this.switchFocusToTag()
          break
        case 'tag':
          this.focusTarget = 'todo'
          this.switchFocusToTodoTask()
          break

        default:
          this.focusTarget = 'done'
          this.switchFocusToDoneTask()
          break
      }
    },

    switchFocusToTodoTask () {
      this.doneTasksFolded = true
      this.todoTasksFolded = false
      this.resetStateOfTag()
      this.resetStateOfTask()
    },

    switchFocusToDoneTask () {
      this.todoTasksFolded = true
      this.doneTasksFolded = false
      this.resetStateOfTag()
      this.resetStateOfTask()
    },

    switchFocusToTag () {
      this.doneTasksFolded = true
      this.todoTasksFolded = false
      this.resetStateOfTask()
      this.resetStateOfTag()
      this.focusNoTag()
    },

    recordLog (log) {
      db.read().get('log').push(log).write()
    },

    handlePickColor (tag) {
      this.colorPickerVisible = true
      this.currentTagColor = tag.color
      this.pickColorTagId = tag.id
    },
    cancelPickColor () {
      this.colorPickerVisible = false
      this.currentTagColor = '#000000'
      this.pickColorTagId = ''
    },
    pickColor (val) {
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i].id === this.pickColorTagId) {
          this.tags[i].color = val.hex
          this.tags[i].edited = false
          for (var j = 0; j < this.availableTagColors.length; j++) {
            if (val.hex === this.availableTagColors[j]) {
              this.tags[i].color = this.availableTagColorsName[j]
            }
          }
          this.updateTag()
          this.recordLog({
            target: 'tags',
            type: 'update',
            data: this.standardizeTag(this.tags[i]),
            flag: ''
          })
          this.tags[i].color = val.hex
          break
        }
      }
      this.cancelPickColor()
    },

    autoTextarea (event) {
      event.target.style.rows = '1'
    }
  }
}
</script>

<style>

*{
 -webkit-touch-callout:none; /*系统默认菜单被禁用*/
 -webkit-user-select:none; /*webkit浏览器*/
 user-select:none;
}

i { cursor: pointer; }
span {  word-wrap : break-word}
input {
  background-color: rgba(255,255,255, 0.2);
  width: 100%;
  border: none;
  outline: none;
  color: #bbbbbb;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}
input::-webkit-input-placeholder {
  color: #bbbbbb;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}

/* .el-icon-brush:hover{color:lightseagreen;}
.el-icon-check:hover{color:chartreuse;}
.el-icon-edit:hover {color: gold;}
.el-icon-alarm-clock:hover {color:cyan;}
.el-icon-price-tag:hover {color:coral;}
.el-icon-delete:hover {color: crimson;}
.el-icon-refresh-left:hover {color: chartreuse;} */

.el-icon-brush{color:lightseagreen;}
.el-icon-s-claim{color:chartreuse;}
.el-icon-edit {color: cyan;}
.el-icon-star-on {color:gold;}
.el-icon-star-off {color:gold;}
.el-icon-price-tag {color:coral;}
.el-icon-delete {color: crimson;}
.el-icon-refresh-left {color: chartreuse;}

.box {
  /* height: 100%; */
  padding: 0px 20px;
  position: absolute;
  top: 40px;
  bottom: 15px;
  width: 100%;
  background-color: #111
}

.body {
  height:100%;
  width: 100%;
}

.left-panel {
  position: absolute;
  height:100%;
  left: 20px;
  right: 125px;
}

.title {
  height: 30px;
}

.task-list {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.task-list::-webkit-scrollbar-track-piece{
    background-color:#111;
    border-radius:0;
}
.task-list::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.task-list::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#222;
    border-radius:4px;
    outline:2px solid #222;
    outline-offset:-2px;
}

.task-list-light {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.task-list-light::-webkit-scrollbar-track-piece{
    background-color:#ddd;
    border-radius:0;
}
.task-list-light::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.task-list-light::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#eee;
    border-radius:4px;
    outline:2px solid #eee;
    outline-offset:-2px;
}

.task-list-pink {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.task-list-pink::-webkit-scrollbar-track-piece{
    background-color:#ffbbf9;
    border-radius:0;
}
.task-list-pink::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.task-list-pink::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#f490ed;
    border-radius:4px;
    outline:2px solid #f490ed;
    outline-offset:-2px;
}

.task-list-green {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.task-list-green::-webkit-scrollbar-track-piece{
    background-color:#40e2c1;
    border-radius:0;
}
.task-list-green::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.task-list-green::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#84f7b4;
    border-radius:4px;
    outline:2px solid #84f7b4;
    outline-offset:-2px;
}

.task-list-item {
  margin: 4px 2px;
  color: #ddd;
  /* font-weight: bold; */
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  cursor: default;
  padding: 0px 4px;
  line-height: 17px;
  word-break: break-all;
  word-wrap: break-word;
}

.task-dot {
  background-color: rgba(0,0,0,0.8);
  border-color: #7a797b;
  width: 15px;
  height: 15px;
  display: inline-flex;
  border: 2px solid;
  border-radius: 4px;
  padding: 1px;
  margin: 1px;
  font-size: 10px;
  align-content: center;
  vertical-align: middle;
}

.right-panel {
  position: absolute;
  right: 20px;
  height:100%;
  width: 100px;
}


.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin: 1px;
}

/* .task-list-item:hover { background: rgba(100,100,100,0.8); } */

.tag-icon {
  background-color: rgba(0,0,0,0.8);;
  min-width: 10px;
  height: 18px;
  display: inline-flexbox;
  border: 2px solid;
  border-radius: 4px;
  padding: 1px;
  margin: 1px;
  align-content: center;
  vertical-align: middle;
}

.tag-list {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.tag-list::-webkit-scrollbar-track-piece{
    background-color:#111;
    border-radius:0;
}
.tag-list::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.tag-list::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#222;
    border-radius:4px;
    outline:2px solid #222;
    outline-offset:-2px;
}

.tag-list-light {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.tag-list-light::-webkit-scrollbar-track-piece{
    background-color:#ddd;
    border-radius:0;
}
.tag-list-light::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.tag-list-light::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#eee;
    border-radius:4px;
    outline:2px solid #eee;
    outline-offset:-2px;
}

.tag-list-pink {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.tag-list-pink::-webkit-scrollbar-track-piece{
    background-color:#ffbbf9;
    border-radius:0;
}
.tag-list-pink::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.tag-list-pink::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#f490ed;
    border-radius:4px;
    outline:2px solid #f490ed;
    outline-offset:-2px;
}

.tag-list-green {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
  overflow-y:auto;
  overflow-x:hidden;
  background-color: #111
}

.tag-list-green::-webkit-scrollbar-track-piece{
    background-color:#40e2c1;
    border-radius:0;
}
.tag-list-green::-webkit-scrollbar{
    width:8px;
    height:8px;
}
.tag-list-green::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#84f7b4;
    border-radius:4px;
    outline:2px solid #84f7b4;
    outline-offset:-2px;
}

.tag-item {
  opacity: 1;
  padding-left: 2px;
  /* margin-top: 2px; */
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  text-align:left;
  cursor: default;
}

.tag-flag {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 9px 5px 0px 1px;
  float:left;
}

/* .tag-item:hover { background: rgba(100,100,100,0.8); } */

.tag-item-text {
  color:#ddd;
  font-size: 14px;
  /* background-color: #000000; */
}

.text {
  color:#ddd;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  cursor: default;
}

.important-text {
  color: rgb(252, 124, 57);
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  cursor: default;
}

.text-small {
  color: #ddd;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  font-size: 10px;
  cursor: default;
}

.text-small-light {
  color: #444;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  font-size: 10px;
  cursor: default;
}

.active{
  background: rgba(100,100,100,0.8);
}

.select{
  /* opacity: 1; */
  font-weight: bolder;
  background: rgba(100,100,100,0.6);
}

.focus{
  background: rgba(0,100,100,0.6);
}

.second-row {
  text-align: right;
}

compact-picker {
  position: absolute;
  bottom: 0px;
}
</style>
