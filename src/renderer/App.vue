<template>
  <div id="app" :class="{ unfocused: ignoreMouse }">
    <div class="header">
      <b>{{ appName }}</b>
      <i>Powered by Zhy/Yc</i>
    </div>   
    <div class="tools">
      <i class="el-icon-upload" key="export" @click="exportData"></i>
      <i class="el-icon-view" key="hide" @click="hideWindow"></i>
      <i
        :class="ignoreMouse ? 'el-icon-lock' : 'el-icon-unlock'"
        key="lock"
        @mouseenter="setIgnoreMouseEvents(false)"
        @mouseleave="setIgnoreMouseEvents(ignoreMouse)"
        @click="ignoreMouse = !ignoreMouse"
      ></i>
    </div>
    <router-view></router-view>
  </div>
</template>



<script>
import { ipcRenderer } from 'electron'

export default {
  data () {
    return {
      appName: 'Never Todo',
      ignoreMouse: false
    }
  },
  methods: {
    setIgnoreMouseEvents (ignore) {
      ipcRenderer.invoke('setIgnoreMouseEvents', ignore)
    }
    // exportData () {
    //   ipcRenderer.invoke('exportData')
    // },
    // hideWindow () {
    //   ipcRenderer.invoke('hideWindow')
    // }
  }
}
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 1);
  opacity: 0.5;

  border-radius: 5px;
}
#app:hover {
  opacity: 0.8;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 12px;
  color: rgba($color: #ffffff, $alpha: 0.3);
}

.tools {
  position: absolute;
  bottom: 0px;
  right: 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 4px;
  margin-bottom: 4px;
}

.tools i {
  font-size: 18px;
  padding: 2px 5px;
  cursor: pointer;
  color: #ffffff;
} 
</style>