<template>
  <div id="app" :class="{ unfocused: ignoreMouse }">
    <div class="header">
      <b>{{ appName }}</b>
      <div class="toolkit">
        <i class="el-icon-copy-document" @click="windowOnTop"></i>
        <i
          :class="ignoreMouse ? 'el-icon-lock' : 'el-icon-unlock'"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
          @click="ignoreMouse = !ignoreMouse"
        ></i>
        <i class="el-icon-close" @click="hideWindow"></i>
      </div>
    </div>
    <div class="producers">
      <i>Powered by Zhy/Yc</i>
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
    // exportData () {
    //   ipcRenderer.invoke('exportData')
    // },
    hideWindow () {
      ipcRenderer.send('hideWindow')
    },

    mouseenter () {
      console.log('enter')
      ipcRenderer.send('setIgnoreMouseEvents', false)
    },
    mouseleave () {
      console.log('leave')
      ipcRenderer.send('setIgnoreMouseEvents', this.ignoreMouse, { forward: true })
    },
    windowOnTop () {
      ipcRenderer.send('windowOnTop')
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #111, $alpha: 1);
  opacity: 0.8;

  border-radius: 5px;
}
#app.unfocused {
  opacity: 0.5;
}

.header {
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 2px 15px;
  box-sizing: border-box;
  font-size: 15px;
  color: #ffffff;
}

.producers {
  position: fixed;
  bottom: 0px;
  right: 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 4px;
  margin-bottom: 4px;
  z-index: 99;
}

.producers i {
  font-size: 14px;
  padding: 2px 5px;
  cursor: pointer;
  color: rgba($color: #ffffff, $alpha: 0.1);
}

.toolkit i {
  font-size: 18px;
  padding: 2px 5px;
  cursor: pointer;
  color: #ffffff;
}
</style>
