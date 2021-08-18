<template>
  <div :id="theme.app" :class="{ unfocused: ignoreMouse }" :style="theme.opacity">
    <div :class="theme.header">
      <b title="「彩蛋 Powered by Zhy/Yc」">{{ appName }}</b>
      <div :class="theme.toolkit">
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
    <div :class="theme.producers">
      <i>Powered by Zhy/Yc</i>
    </div>
    <router-view></router-view>
  </div>
</template>



<script>
import { ipcRenderer } from 'electron'
import db from '@/utils/db'

export default {
  data () {
    return {
      appName: 'Never Todo',
      ignoreMouse: false,
      notTop: false,
      locklight: false,
      theme: {
        style: 'pink',
        app: '',
        header: '',
        toolkit: '',
        producers: '',
        opacity: '60'
      }
    }
  },
  mounted () {
    this.initData()
    this.timer()
  },
  methods: {
    // exportData () {
    //   ipcRenderer.invoke('exportData')
    // },
    timer () {
      return setInterval(() => {
        this.checkDataUpdate()
      }, 1000)
    },
    checkDataUpdate () {
      let updateFlag = db.read().get('updateApp').value()
      if (updateFlag) {
        this.initData()
        db.read().set('updateApp', false).write()
      }
    },
    initData () {
      // By Lowdb database
      let theme = db.read().get('theme').value()
      let opacity = db.read().get('opacity').value()
      this.theme.style = theme
      this.theme.opacity = opacity
      this.switchTheme()
      this.switchOpacity()
    },
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
        case 'pink':
          this.theme.app = 'app-pink'
          this.theme.header = 'header-pink'
          this.theme.toolkit = 'toolkit-pink'
          this.theme.producers = 'producers-pink'
          break
        case 'green':
          this.theme.app = 'app-green'
          this.theme.header = 'header-green'
          this.theme.toolkit = 'toolkit-green'
          this.theme.producers = 'producers-green'
          break
      }
    },
    switchOpacity () {
      switch (this.theme.opacity) {
        case '100':
          this.theme.opacity = 'opacity: 1'
          break
        case '80':
          this.theme.opacity = 'opacity: 0.9'
          break
        case '60':
          this.theme.opacity = 'opacity: 0.8'
          break
        case '40':
          this.theme.opacity = 'opacity: 0.7'
          break
        case '20':
          this.theme.opacity = 'opacity: 0.6'
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

/* 深色主题 */
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

/* 浅色主题 */
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

/* 粉色主题 */
#app-pink {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #ffbbf9, $alpha: 1);
  opacity: 0.8;

  border-radius: 5px;
}

#app-pink.unfocused {
  opacity: 0.6;
}

.header-pink {
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

.producers-pink {
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

.producers-pink i {
  font-size: 14px;
  padding: 2px 5px;
  cursor: pointer;
  color: rgba($color: #444, $alpha: 0.3);
}

.toolkit-pink i {
  -webkit-app-region: no-drag;
  font-size: 18px;
  padding: 2px 5px;
  cursor: pointer;
  color: #444;
}

/* 绿色主题 */
#app-green {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #40e2c1, $alpha: 1);
  opacity: 0.8;

  border-radius: 5px;
}

#app-green.unfocused {
  opacity: 0.6;
}

.header-green {
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

.producers-green {
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

.producers-green i {
  font-size: 14px;
  padding: 2px 5px;
  cursor: pointer;
  color: rgba($color: #444, $alpha: 0.2);
}

.toolkit-green i {
  -webkit-app-region: no-drag;
  font-size: 18px;
  padding: 2px 5px;
  cursor: pointer;
  color: #444;
}
</style>
