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
          v-for="task in tasks"
          :key="task.ID"
        >
          <div v-show="!task.Status">
            <el-checkbox v-model="task.Status"></el-checkbox>
            <a>{{ task.Content }}</a>
            <a
              v-for="tag in task.Tags"
              :key="tag.ID"
              :style="{
                'padding':'3px',
                'border-radius':'60px',
                'background-color':tag.Color,
                'font-size':'10px',
                'font-weight':'700',
                'color':'#FFFFFF',
                'text-align':'right'}">
              {{ tag.Content }}
            </a>
            <img
              src="../assets/del.png"
              @click="task_del(task.ID)"
              width="15px"
              height="15px"
            />
            <img
              src="../assets/update.png"
              @click="displayTask(task.Content, task.ID)"
              width="15px"
              height="15px"
            />
          </div>
        </div>

        <hr class="mb-4" />

        <!-- 已完成列表 -->
        <h4 class="mb-3">已完成</h4>
        <hr class="mb-4" />
        <!-- 具体已完成内容 -->
        <div
          class="custom-checkbox"
          v-for="task in tasks"
          :key="task.ID"
        >
          <div v-show="task.Status">
            <el-checkbox v-model="task.Status"></el-checkbox>
            <a>{{ task.Content }}</a>
            <span
              class="badge badge-secondary badge-pill"
              v-for="tag in task.Tags"
              :key="tag.ID"
            >{{ tag.Content }}</span>
            <img
              src="../assets/del.png"
              @click="task_del(task.ID)"
              width="15px"
              height="15px"
            />
            <img
              src="../assets/update.png"
              @click="displayTask(task.Content, task.ID)"
              width="15px"
              height="15px"
            />
          </div>
        </div>

        <!-- 修改待办列表内容 -->
        <el-dialog
          title="修改待办任务信息"
          :visible.sync="updateTaskVisible"
          width="30%"
          :show-close="false"
        >
          <!-- 修改栏信息 -->
          <el-input v-model="updateContent"></el-input>
          <div
            v-for="tag in tags"
            :key="tag.ID"
          >
            <input
              type="checkbox"
              v-model="tag.Flag"
            />
            <span class="badge badge-secondary badge-pill">{{
              tag.Content
            }}</span>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="unDisplayTask()">取 消</el-button>
            <el-button
              type="primary"
              @click="task_upd(updateTagID)"
            >确 定</el-button>
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
              v-model="addContent"
            />
          </div>
          <br />
          <div class="col-md-3 mb-3">
            <button
              class="btn btn-primary btn-sm"
              @click="task_add()"
            >
              添加
            </button>
          </div>
          <div
            v-for="tag in tags"
            :key="tag.ID"
          >
            <input
              type="checkbox"
              v-model="tag.Flag"
            />
             <a
              :style="{
                'padding':'3px',
                'border-radius':'10px',
                'background-color':tag.Color,
                'font-size':'10px',
                'font-weight':'700',
                'color':'#FFFFFF',
                'text-align':'right'}">{{
              tag.Content
            }}</a>
          </div>
        </div>
      </div>

      <!-- 右侧栏 -->
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
            v-for="tag in tags"
            :key="tag"
          >
            <div>
              <h6 class="my-0">{{ tag.Content }}</h6>
              <small class="text-muted">{{ tag.Desc }}</small>
              <img
                src="../assets/del.png"
                @click="tag_del(tag.ID)"
                width="15px"
                height="15px"
              />
              <img
                src="../assets/update.png"
                @click="displayTag(tag.Content, tag.Desc, tag.ID)"
                width="15px"
                height="15px"
              />
            </div>
            <!-- <span class="text-muted">{{ tag.Tasks.length }}</span> -->
          </li>
        </ul>

        <!-- 修改标签内容 -->
        <el-dialog
          title="修改标签信息"
          :visible.sync="updateTagVisible"
          width="30%"
          :show-close="false"
        >
          <!-- 修改栏信息 -->
          <el-input v-model="updateTagName"></el-input>
          <el-input
            type="textarea"
            v-model="updateTagInfo"
          ></el-input>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="unDisplayTag()">取 消</el-button>
            <el-button
              type="primary"
              @click="tag_upd(updateTagID)"
            >确 定</el-button>
          </span>
        </el-dialog>

        <!-- 增加标签 -->
        <div class="card p-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="填写标签名字..."
              v-model="addTagName"
            />
            <div class="input-group-append">
              <button
                type="submit"
                class="btn btn-secondary"
                @click="tag_add"
              >
                添加
              </button>
            </div>
          </div>
          <textarea
            class="form-control form-info"
            placeholder="标签的详细信息..."
            v-model="addTagInfo"
          ></textarea>
        </div>

        <!-- 搜索栏 -->
        <div class="card p-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="搜索..."
            />
            <div class="input-group-append">
              <button
                type="submit"
                class="btn btn-secondary"
              >搜索</button>
            </div>
          </div>
        </div>
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
import {
  getAllTasks, addTask, deleteTask, updateTask,
  getAllTags, addTag, deleteTag, updateTag} from '@/api/todo'
import axios from 'axios'
export default {
  name: 'Todo',
  data () {
    return {
      tags: null,
      tasks: null,
      relate: null,
      addContent: '',
      addTagName: '',
      addTagInfo: '',
      updateTaskVisible: false,
      updateTagVisible: false,
      updateContent: '',
      updateTaskID: -1,
      updateTagName: '',
      updateTagInfo: '',
      updateTagID: -1
    }
  },
  methods: {
    initData () {
      const url = 'http://localhost:8080/todo/all'
      axios
        .get(url)
        .then(response => {
          let data = response.data.Result
          this.tags = data.tags
          this.tasks = data.tasks
          this.relate = data.task_tag_pair
          // 将标签添加进任务中
          for (let task of this.tasks) {
            task.Tags = []
            for (let tag of this.tags) {
              for (let r of this.relate) {
                if (task.ID === r.TaskID && tag.ID === r.TagID) {
                  task.Tags.push(tag)
                }
              }
            }
          }
          // 将任务添加至标签中
          for (let tag of this.tags) {
            // 添加选取标志
            tag.Flag = false
            tag.Tasks = []
            for (let task of this.tasks) {
              for (let r of this.relate) {
                if (tag.ID === r.TagID && task.ID === r.TaskID) {
                  tag.Tasks.push(task)
                }
              }
            }
          }
          console.log('success')
        })
        .catch(function (error) {
          // 请求失败处理
          console.log('fail', error)
        })
      getAllTasks()
      getAllTags()
    },
    task_add () {
      if (this.addContent !== '') {
        let TaskContent = this.addContent
        let TagsID = []
        for (let tag of this.tags) {
          if (tag.Flag) {
            TagsID.push(tag.ID)
          }
        }

        addTask({
          TaskContent: TaskContent,
          TagsID: TagsID
        })
          .then(response => {
            console.log(response)
            if (response.data.status === 0) {
              this.initData()
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.addContent = ''
      }
    },
    task_del (TaskID) {
      deleteTask({
        TaskID: TaskID
      })
        .then(response => {
          console.log(response)
          if (response.data.status === 0) {
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    task_upd (TaskID) {
      let TagsID = []
      for (let tag of this.tags) {
        if (tag.Flag) {
          TagsID.push(tag.ID)
        }
      }
      updateTask(TaskID, {
        TaskID: this.updateTaskID,
        TaskContent: this.updateContent,
        TagsID: TagsID
      })
        .then(response => {
          console.log(response)
          if (response.data.status === 0) {
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.updateTaskVisible = false
    },
    tag_add () {
      if (this.addTagName !== '') {
        let TagContent = this.addTagName
        let TagDesc = this.addTagInfo

        addTag({
          TagContent: TagContent,
          TagDesc: TagDesc
        })
          .then(response => {
            console.log(response)
            if (response.data.status === 0) {
              this.initData()
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.addTagName = ''
        this.addTagInfo = ''
      }
    },
    tag_del (TagID) {
      console.log(TagID)
      deleteTag(TagID)
        .then(response => {
          console.log(response)
          if (response.data.status === 0) {
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    tag_upd (TagID) {
      updateTag(TagID, {
        TagID: TagID,
        TagContent: this.updateTagName,
        TagDesc: this.updateTagInfo
      })
        .then(response => {
          console.log(response)
          if (response.data.status === 0) {
            this.initData()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.updateTagVisible = false
    },
    displayTask (TaskContent, TaskID) {
      this.updateTaskVisible = true
      this.updateContent = TaskContent
      this.updateTaskID = TaskID
    },
    unDisplayTask () {
      this.updateTaskVisible = false
    },
    displayTag (TagName, TagInfo, TagID) {
      this.updateTagVisible = true
      this.updateTagName = TagName
      this.updateTagInfo = TagInfo
      this.updateTagID = TagID
    },
    unDisplayTag () {
      this.updateTagVisible = false
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
