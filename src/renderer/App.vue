<template>
  <div :id=theme.app :class="{ unfocused: ignoreMouse }">
    <div :class=theme.header>
      <b title="「彩蛋 Powered by Zhy/Yc」">{{ appName }}</b>
      <div :class=theme.toolkit>
        <i
          title="窗口始终至于顶层"
          class="el-icon-copy-document"
          :style="notTop ? 'color: #505050' : 'color: #ffffff'"
          @click="windowOnTop"
        ></i>
        <i
          title="锁定窗口(窗口置顶时可用)"
          :class="ignoreMouse ? 'el-icon-lock' : 'el-icon-unlock'"
          :style="locklight ? 'color: #ffffff' : 'color: #505050'"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
          @click="lock"
        ></i>
        <i title="关闭窗口" class="el-icon-close" @click="hideWindow"></i>
      </div>
    </div>
    <div :class=theme.producers :style="">
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
      notTop: true,
      locklight: false,
      theme: {
        style: 'light',
        app: '',
        header: '',
        toolkit: '',
        producers: ''
      }
    }
  },
  mounted () {
    this.switchTheme()
  },
  methods: {
    // exportData () {
    //   ipcRenderer.invoke('exportData')
    // },
    switchTheme () {
      switch (this.theme.style) {
        case 'dark':
          this.theme.app = 'app'
          this.theme.header = 'header'
          this.theme.toolkit = 'toolkit'
          this.theme.producers = 'producers'
          break
        case 'light':
          this.theme.app = 'app-light'
          this.theme.header = 'header-light'
          this.theme.toolkit = 'toolkit-light'
          this.theme.producers = 'producers-light'
          break
      }
    },
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
    },
    lock () {
      if (!this.notTop) {
        this.ignoreMouse = !this.ignoreMouse
        this.locklight = !this.locklight
      }
    }
  }
}
</script>

<style lang="scss" scoped>

// 深色主题
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
  opacity: 0.6;
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

// 浅色主题
#app-light {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #ddd, $alpha: 1);
  opacity: 0.8;

  border-radius: 5px;
}

#app-light.unfocused {
  opacity: 0.6;
}

.header-light {
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 2px 15px;
  box-sizing: border-box;
  font-size: 15px;
  color: #444;
}

.producers-light {
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

.producers-light i {
  font-size: 14px;
  padding: 2px 5px;
  cursor: pointer;
  color: rgba($color: #444, $alpha: 0.2);
}

.toolkit-light i {
  -webkit-app-region: no-drag;
  font-size: 18px;
  padding: 2px 5px;
  cursor: pointer;
  color: #444;
}
</style>
