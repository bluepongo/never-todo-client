<template>
  <div id="app" :class="{ unfocused: ignoreMouse }">
    <div class="drag-nav">
      <b>{{ appName }}</b>
      <i>Powered by Zhy/Yc</i>
    </div>
    <router-view></router-view>
  </div>
</template>


<script>
  export default {
    data () {
      return {
        appName: 'Never Todo',
        ignoreMouse: false
      }
    },
    name: 'never-todo-frontend'
  }
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.6);
  border-radius: 5px;
  .drag-nav {
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 12px;
    b,
    i {
      color: rgba($color: #ffffff, $alpha: 0.3);
    }
  }
  .nav {
    display: flex;
    justify-content: space-between;
    height: 26px;
    padding: 0 20px;
    color: #dddddd;
    user-select: none;
    .link {
      a {
        font-weight: bold;
        color: #dddddd;
        text-decoration: none;
        &.router-link-exact-active {
          font-size: 20px;
          color: #ffffff;
        }
        &:hover {
          color: rgba($color: #ffffff, $alpha: 0.6);
        }
      }
    }
    .tools {
      display: flex;
      i {
        font-size: 20px;
        line-height: 26px;
        padding: 0 5px;
        cursor: pointer;
      }
    }
  }
  .main {
    flex: 1;
    margin: 10px 0;
    overflow-y: auto;
    &:hover::-webkit-scrollbar-thumb {
      display: block;
    }
  }
}
#app.unfocused {
  opacity: 0.4;
  .mask {
    display: block;
  }
  .tools {
    z-index: 1000;
  }
}
</style>