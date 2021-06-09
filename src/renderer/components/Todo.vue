<template>
  <div
    class="container"
    id="Task"
  >
    <el-row>
      <el-col :span="18">
        <div>
          <span class="text">
            <h5>任务&nbsp;<i class="el-icon-circle-plus" @click.stop="handleAddTask()"></i></h5> 
            
          </span>
        </div>

        <div class="task-list">
          <input
            class="text"
            placeholder="请输入新任务内容"
            ref="taskContent"
            v-if="newTaskVisible"
            v-model= "newTaskInfo.content" 
            v-focus
            @input="autoTextarea($event)"
            @click.stop=""
            @keyup.enter="addTask($event)"
            @blur="addTask()">
          <span class="text" @click.stop="todoTasksFolded = !todoTasksFolded">
          <i v-if="todoTasksFolded" class="el-icon-arrow-right"></i>
          <i v-else class="el-icon-arrow-down"></i>          
          <span class="text">进行中 </span>
          <span class="badge badge-secondary badge-pill">{{todoFullTasks.length}}</span>
          </span>
          <draggable v-model="todoFullTasks">
            <transition-group v-if="!todoTasksFolded">
              <div 
                class="task-list-item"
                v-for="fullTask in todoFullTasks" 
                :key="fullTask.task.id"
                :class="{'select':fullTask.task.selected}"
                @click="selectTask(fullTask.task)"
                @dblclick="completeTask(fullTask.task)"
              >
                <!-- <el-checkbox @change="completeTask(fullTask.task_id)" v-model="fullTask.task.Completed"></el-checkbox> -->
                <div v-if="!fullTask.task.deleted" class="first-row">
                  <div v-if="!fullTask.task.selected" class="task-dot"></div>
                  <span v-if="!fullTask.task.selected" class="text"> {{ fullTask.task.content }}</span>
                  <input
                    class="text"
                    ref="taskContent"
                    v-else 
                    v-model= "fullTask.task.content" 
                    v-focus
                    @input="autoTextarea($event)"
                    @click.stop=""
                    @keyup.enter="modifyTaskContent($event)"
                    @blur="modifyTaskContent()">
                  <span v-if="!fullTask.task.selected">
                  <div
                    class="tag-dot"
                    v-for="tag in fullTask.tags"
                    :key="tag.id" 
                    :style="{'background-color': tag.color}"></div>
                  </span>
                  
                  <div v-else>
                    <span class="text-small" v-for="tag in fullTask.tags" :key="'left'+tag.id" >
                      <span 
                        class="tag-icon"
                        :style="{'border-color': tag.color,}"
                        @click.stop="delTagForTask(fullTask.task.id, tag.id)"
                      >{{ tag.content.charAt(0) }}</span>
                    </span>
                    <span class="text-small"> &nbsp;&lt;=&gt;&nbsp; </span>
                    <span class="text-small" v-for="tag in tags" :key="'right'+tag.id" >
                      <span 
                        v-if="!tag.deleted && assignedTags.indexOf(tag.id) === -1"
                        class="tag-icon"
                        :style="{'border-color': tag.color,}"
                        @click.stop="addTagForTask(fullTask.task.id, tag.id)"
                      >{{ tag.content.charAt(0) }}</span>
                    </span>
                  </div>
                </div>
                
                <div class="second-row" v-show="fullTask.task.selected">
                  <span class="text">
                    <!-- <i class="el-icon-copy-document" @click.stop="copyTaskContent()"></i>&nbsp;&nbsp; -->
                    <i class="el-icon-alarm-clock" @click.stop="setTaskAlarm(fullTask.task)"></i>&nbsp;&nbsp;
                    <i class="el-icon-delete" @click.stop="deleteTask(fullTask.task)"></i>&nbsp;&nbsp;
                    <i class="el-icon-check" @click.stop="completeTask(fullTask.task)"></i>
                  </span>
                </div>
              </div>
            </transition-group>
          </draggable>

          <span class="text" @click.stop="doneTasksFolded = !doneTasksFolded">
            <i v-if="doneTasksFolded" class="el-icon-arrow-right"></i>
            <i v-else class="el-icon-arrow-down"></i>          
            <span class="text">已完成 </span>
            <span class="badge badge-secondary badge-pill">{{doneFullTasks.length}}</span>
          </span>
          <draggable v-model="doneFullTasks" group="todo" @start="drag=true" @end="drag=false">
            <transition-group v-if="!doneTasksFolded">
              <div 
                class="task-list-item"
                v-for="fullTask in doneFullTasks" 
                :key="fullTask.task.id" 
                :style="{'opacity': 0.5}"
                :class="{'select':fullTask.task.selected}"
                @click="selectTask(fullTask.task)"
                @dblclick="uncompleteTask(fullTask.task)"
              >
                <div v-if="!fullTask.task.selected" class="task-dot"></div>
                <span class="text"> <s>{{ fullTask.task.content }}</s></span>
                <!-- <span v-if="!fullTask.task.selected"> -->
                <span>
                  <div
                    class="tag-dot"
                    v-for="tag in fullTask.tags"
                    :key="tag.id" 
                    :style="{'background-color': tag.color}"></div>
                  <span v-if="fullTask.task.selected" class="text">
                    &nbsp;
                    <i class="el-icon-delete" @click.stop="deleteTask(fullTask.task)"></i>&nbsp;&nbsp;
                    <i class="el-icon-refresh-left" @click.stop="uncompleteTask(fullTask.task)"></i>
                  </span>
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>

      </el-col>
      <el-col :span="6" class="tag-list">
        <div><span class="text"><h5>标签&nbsp;<i class="el-icon-circle-plus" @click.stop="handleAddTag"></i></h5></span></div>
        <input
          class="text"
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
          :class="{'select': noTagSelect }"
          @mouseover="noTagActive = true"
          @mouseleave="noTagActive = false"
          @click="selectNoTag()"  
        >
          <span :style="{'background-color': '#FFFFFF'}">&nbsp;&nbsp;</span>
          <span class="tag-item-text text">全部</span>
        </div>
        <div 
          class="tag-item" 
          v-for="tag in tags" 
          :key="tag.id" 
          :class="{'select':tag.selected}"
          @click="selectTag(tag)"
          @dblclick="$set(tag, 'edited', true)"
        >
          <div v-if="!tag.deleted">
            <span v-if="tag.assigned" :style="{'background-color': tag.color}"></span>
            <!-- <colorPicker v-model="tag.color" /> -->
            <span v-if="!tag.edited" :style="{'background-color': tag.color}">&nbsp;&nbsp;</span>
            <span v-if="!tag.edited" class="tag-item-text text">{{ tag.content }}</span>
            <input
              class="text"
              ref="tagContent"
              v-else 
              v-model= "tag.content" 
              v-focus
              @input="autoTextarea($event)"
              @click.stop=""
              @keyup.enter="modifyTaskContent($event)"
              @blur="modifyTaskContent()">
            <div>
              <span v-if="tag.edited"  class="text">
                <i class="el-icon-brush" @click.stop="handlePickColor(tag)"></i>&nbsp;&nbsp;
                <i class="el-icon-delete" @click.stop="deleteTag(tag)"></i>&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

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
// import {getAllTasks, getTasksByContent, getTasksByTag, addTask, deleteTask， updateTask} from '@/api/todo'
// import {getAllTags, addTag, deleteTag, updateTag} from '@/api/todo'
import { readFile } from 'fs'
// import { filter } from 'vue/types/umd'
export default {
  name: 'todo',
  data () {
    return {
      tasks: [],
      taskAutoIncVal: -1,
      newTaskVisible: false,
      newTaskInfo: { id: 0, content: '', completed: false, deleted: false },
      doneTasksFolded: true,
      todoTasksFolded: false,

      tags: [],
      tagAutoIncVal: -1,
      newTagVisible: false,
      newTagInfo: { id: 0, content: '', color: '', deleted: false },
      noTagActive: false,
      noTagSelect: true,

      taskTags: [],
      assignedTags: [],

      pickColorTagId: '',
      availableTagColors: [
        '#FF0000', '#FF8000', '#FFFF00',
        '#804040', '#00FF80', '#404040',
        '#00FFFF', '#0080FF', '#0000FF',
        '#8000FF', '#FF00FF', '#AAAAAA'
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
      // console.log(ffts)
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
  methods: {
    initData () {
      // By Network
      // getAll()
      //   .then((response) => {
      //     let data = response.data.result
      //     // 初始化待办/标签数据
      //     console.log(data)
      //     this.tasks = data.tasks
      //     this.tags = data.tags
      //     this.taskTags = data.task_tags
      //   })
      //   .catch(function (error) {
      //     console.log('initialize data failed', error)
      //   })

      // By Local File
      // var fs = require('fs')
      let file = 'data.json' // 文件路径
      readFile(file, 'utf-8', function (err, data) {
        if (err) {
          console.log(err)// eslint-disable-line
        } else {
          let result = JSON.parse(data).result
          this.tasks = result.tasks
          this.tags = result.tags
          this.taskTags = result.task_tags
        }
      }.bind(this))
    },

    resetStateOfTask () {},
    resetStateOfTag () {},

    selectTask (task) {
      if (task.selected) {
        this.$set(task, 'selected', false)
        return
      }
      this.unselectAllTasks()
      this.$set(task, 'selected', true)
      this.assignedTags = []
      for (let taskTag of this.taskTags) {
        if (taskTag.task_id === task.id) {
          this.assignedTags.push(taskTag.tag_id)
        }
      }
      this.cancelPickColor()
    },
    unselectAllTasks () {
      for (let task of this.tasks) { this.$set(task, 'selected', false) }
    },
    modifyTaskContent (event) {
      if (event) {
        event.target.blur()
      } else {

      }
    },
    handleAddTask () {
      this.newTaskInfo = { id: 0, content: '', completed: false, deleted: false }
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
          this.tasks.push(this.newTaskInfo)
        }
        this.cancelAddTask()
      }
    },
    deleteTask (task) {
      task.deleted = true
    },
    updateTask (id) {
    },
    completeTask (task) {
      task.completed = true
    },
    uncompleteTask (task) {
      task.completed = false
    },

    selectNoTag () {
      if (this.noTagSelect) { return }
      this.unselectAllTasks()
      this.unselectAllTags()
      this.noTagSelect = true
      this.cancelPickColor()
    },
    unselectAllTags () {
      for (let tag of this.tags) {
        this.$set(tag, 'selected', false)
        this.$set(tag, 'edited', false)
      }
      this.noTagSelect = true
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
    handleAddTag () {
      this.newTagInfo = { id: 0, content: '', color: '', deleted: false }
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
          this.tags.push(this.newTagInfo)
        }
        this.cancelAddTag()
      }
    },
    deleteTag (tag) {
      tag.deleted = true
    },
    updateOldTag (id) {},

    addTagForTask (taskId, tagId) {
      this.taskTags.push({'task_id': taskId, 'tag_id': tagId})
      this.assignedTags.push(tagId)
    },
    delTagForTask (taskId, tagId) {
      for (var i = 0; i < this.taskTags.length; i++) {
        if (this.taskTags[i].task_id === taskId && this.taskTags[i].tag_id === tagId) {
          this.taskTags.splice(i, 1)
          this.assignedTags.splice(this.assignedTags.indexOf(tagId), 1)
          break
        }
      }
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
      console.log(val)
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i].id === this.pickColorTagId) {
          this.tags[i].color = val.hex
          this.tags[i].edited = false
          break
        }
      }
      this.cancelPickColor()
    },

    autoTextarea (event) {
      event.target.style.rows = '1'
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

<style>
::-webkit-scrollbar-track-piece{
    background-color:#000000;
    border-radius:0;
}
::-webkit-scrollbar{
    width:8px;
    height:8px;
}
::-webkit-scrollbar-thumb{
    height:50px;
    background-color:#222;
    border-radius:4px;
    outline:2px solid #fff;
    outline-offset:-2px;
    /* border: 2px solid #fff; */
}
/* ::-webkit-scrollbar-thumb:hover{
    height:50px;
    background-color:#444;
    border-radius:4px;
} */

i { cursor: pointer; }
span {  word-wrap : break-word}
input {
  background-color: rgba(255,255,255, 0.2);
  width: 100%;
  border: none;
  outline: none;
  color: #FFFFFF;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}
input::-webkit-input-placeholder {
  color: #FFFFFF;
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
.el-icon-check{color:chartreuse;}
.el-icon-edit {color: gold;}
.el-icon-alarm-clock {color:cyan;}
.el-icon-price-tag {color:coral;}
.el-icon-delete {color: crimson;}
.el-icon-refresh-left {color: chartreuse;}

.container {
  padding: 0px 20px;
  position: absolute;
  top: 20px;
  height: 10px;
}

.task-list { 
  height: 220px;
  overflow:auto;
  overflow-x:hidden;
}

.task-list-item {
  margin: 4px 2px;
  color: #ffffff;
  /* font-weight: bold; */
  cursor: default; 
  padding: 0px 4px;
  line-height: 17px;
}

.task-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  margin: 1px;
  background-color: #FFFFFF;
}

.tag-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin: 1px;
}

/* .task-list-item:hover { background: rgba(100,100,100,0.8); } */

.tag-icon {
  background-color: rgba(0,0,0,0.8);;
  border: 2px solid;
  border-radius: 4px;
  padding: 1px;
  margin: 1px;
  align-content: center;
  vertical-align:middle;
}

.tag-item {
  opacity: 1;
  margin: 1px;
  padding-left: 2px;
  margin-top: 2px;
  text-align:left;
  cursor: default; 
}

/* .tag-item:hover { background: rgba(100,100,100,0.8); } */

.tag-item-text {
  color:#FFFFFF;
  /* background-color: #000000; */
}

.text {
  color:#FFFFFF;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  cursor: default;
}

.text-small {
  color: #FFFFFF;
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

compact-picker {
  position: absolute;
  bottom: 0px;
}

</style>
