<template>
  <div id="app" :class="{ unfocused: ignoreMouse }">
    <div class="header">
      <b title="「彩蛋 Powered by Zhy/Yc」">{{ appName }}</b>
      <div class="toolkit">
        <i
          title="窗口始终至于顶层"
          class="el-icon-copy-document"
          :style="notTop ? 'color: #505050' : 'color: #ffffff'"
          @click="windowOnTop"
        ></i>
        <i
          title="锁定窗口"
          :class="ignoreMouse ? 'el-icon-lock' : 'el-icon-unlock'"
          :style="!ignoreMouse ? 'color: #ffffff' : 'color: #505050'"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
          @click="ignoreMouse = !ignoreMouse"
        ></i>
        <i title="关闭窗口" class="el-icon-close" @click="hideWindow"></i>
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
      ignoreMouse: false,
      notTop: true
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
      this.notTop = !this.notTop
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
  color: #AAAAAA;
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
  color: rgba($color: #AAAAAA, $alpha: 0.1);
}

.toolkit i {
  -webkit-app-region: no-drag;
  font-size: 18px;
  padding: 2px 5px;
  cursor: pointer;
  color: #AAAAAA;
}
</style>
