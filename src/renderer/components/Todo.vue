<template>
  <div
    class="container"
    id="Task"
  >
    <el-row>
      
      <el-col :span="18">
        <div><span class="text"><h5>任务</h5></span></div>
        <template slot="title">
          进行中 <span class="badge badge-secondary badge-pill">{{todoFullTasks.length}}</span>
        </template>
        <draggable v-model="todoFullTasks">
          <transition-group>
            <div v-for="fullTask in todoFullTasks" :key="fullTask.task.id">
              <div>
                <!-- <el-checkbox @change="compeleteTask(fullTask.task_id)" v-model="fullTask.task.Completed"></el-checkbox> -->
                <span class="task-list-item text"> &middot; {{ fullTask.task.content }}</span>
                <!-- <i class="el-icon-circle-plus"></i> -->
              </div>
            </div>
          </transition-group>
        </draggable>

        <template slot="title">
          已完成 <span class="badge badge-secondary badge-pill">{{doneFullTasks.length}}</span>
        </template>
        <draggable v-model="doneFullTasks" group="todo" @start="drag=true" @end="drag=false">
          <div v-for="fullTask in doneFullTasks" :key="fullTask.task.id">
            <!-- <el-checkbox @change="compeleteTask(fullTask.task_id)" v-model="fullTask.task.Completed"></el-checkbox> -->
            <span class="task-list-item"> &middot; <s :style="{'opacity': 0.2}">{{ fullTask.task.content }}</s></span>
            <!-- <i class="el-icon-circle-plus"></i> -->
          </div>
        </draggable>
      </el-col>
      <el-col :span="6" class="tag-icon">
        <div><span class="text"><h5>标签</h5></span></div>
        <div class="tag-icon-item" :style="{'opacity':1}" :class="{'active':noTagActive}">
          <span :style="{'background-color': '#000000'}"> &nbsp;&nbsp; </span>
          <span class="tag-icon-item-text text"> &nbsp;全部任务&nbsp;</span>
        </div>
        <div 
          class="tag-icon-item" 
          v-for="tag in tags" 
          :key="tag.id" 
          :style="{'opacity':0.3}"
          :class="{'active':tag.active}"
          @mouseover="hoverTag(tag)"
          @mouseleave="leaveTag(tag)"
        >
          <span :style="{'background-color': tag.color}"> &nbsp;&nbsp; </span>
          <span class="tag-icon-item-text text"> &nbsp;{{ tag.content }}&nbsp;</span>
        </div>
      </el-col>
    </el-row>



  </div>
</template>

<script>
import {getAll} from '@/api/todo'
// import {getAllTasks, getTasksByContent, getTasksByTag, addTask, deleteTask， updateTask} from '@/api/todo'
// import {getAllTags, addTag, deleteTag, updateTag} from '@/api/todo'
import axios from 'axios'
const path = require('path')
export default {
  name: 'todo',
  data () {
    return {
      tasks: [],
      taskFormTaskInfo: {content: ''},
      taskDialogVisible: false,
      taskDialogFullTaskInfo: {content: '', desc: '', color: ''},

      tags: [],
      tagFormTagInfo: {},
      tagDialogVisible: false,
      tagDialogTagInfo: {},

      taskTags: [],

      noTagActive: true,

      addTagName: '',
      addTagInfo: ''
    }
  },
  computed: {
    fullTasks () {
      let fts = []
      for (let task of this.tasks) {
        let ft = {'task': task, 'tags': []}
        for (let tag of this.tags) {
          this.$set(tag, 'active', false)
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
    todoFullTasks () {
      let fts = []
      for (let fulltask of this.fullTasks) {
        if (!fulltask.task.completed) {
          fts.push(fulltask)
        }
      }
      return fts
    },
    doneFullTasks () {
      let fts = []
      for (let fulltask of this.fullTasks) {
        if (fulltask.task.completed) {
          fts.push(fulltask)
        }
      }
      return fts
    }
  },
  methods: {
    initData () {
      getAll()
        .then((response) => {
          let data = response.data.result
          // 初始化待办/标签数据
          console.log(data)
          this.tasks = data.tasks
          this.tags = data.tags
          this.taskTags = data.task_tags
        })
        .catch(function (error) {
          console.log('initialize data failed', error)
        })
    },
    hoverTag (tag) {
      this.$set(tag, 'active', true)
    },
    leaveTag (tag) {
      this.$set(tag, 'active', false)
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
        taskCompleted: this.tasks[id].taskCompleted,
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
      this.fullTasks[id].task.Completed = true
      console.log('commplete task:', id)
    },
    uncompeleteTask (id) {
      this.fullTasks[id].task.Completed = false
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

<style>
a:link { 
text-decoration: none; 
} 
a:visited { 
text-decoration: none; 
} 
a:hover { 
text-decoration: none; 
} 

.container {
  padding: 20px;
}

.task-list-item {
  color: #ffffff;
  /* font-weight: bold; */
}

.tag-icon-item {
  padding-left: 6px;
  margin-top: 2px;
  text-align:left;
}

.tag-icon-item-text {
  /* padding: 3px; */
  /* font-size: 14px; */
  /* font-weight: bold; */
  color:#FFFFFF;
  /* background-color: #000000; */
}

.text {
  color:#FFFFFF;
  font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
}

.active{
  background: rgb(206, 206, 206); 
}

</style>
