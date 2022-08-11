<div align=center><img src="./static/logo.png" width = "200" height = "200" /></div>

# never-todo-client

> This is a todo list client for never-todo series products made up by electron-vue

English/[中文](./README_CN.md)

This repo is mantained by [SpicyChickenFLY](https://github.com/SpicyChickenFLY) and [bluepongo](https://github.com/bluepongo)

never-todo series products include following parts:
* [backend(not done yet)](https://github.com/SpicyChickenFLY/never-todo-backend) - developed with Golang
* [client(Win/Linux/Mac)(v0.0.1)](https://github.com/bluepongo/never-todo-client) - developed with Electron-Vue
* [mobile(Android/IOS)(not done yet)](https://github.com/SpicyChickenFLY/never-todo-mobile) - developed with Dart/Flutter
* [converter(noe done yet)](https://github.com/SpicyChickenFLY/never-todo-converter) - developed with Golang

This repo was greatly inspired by [xhznl-todo-list](https://github.com/xiajingren/xhznl-todo-list), which is a wonderfull todo list. However, we reconstruct it because we need some requirements like tags and project.

## Usage

[](./USAGE.md)

## ScreenShot

### MacOS
![](./static/app-mac.png "")
### Win10
![](./static/app-win.png "")

## Feature
* [x] add/delete/modify tasks&tags
* [x] set tasks as important
* [x] assign/unassign tags for tasks
* [x] show the count of todo/done tasks
* [x] drag the window by the top bar
* [x] set the window always on top
* [x] lock window to operate through the window
* [x] import/export/log with lowdb
* [x] auto startup

## Fixed in current version
* [x] improve UI
  * [x] Allow hints when hover on widget
  * [x] 4 themes Black/White/Pink/Green 
  * [x] Custom transparency
  * [x] Allow scale
* [x] Call/Hide window by binding key
* [x] Pop Error when open another instance

## What for Next version?
* [ ] improve database struct
* [ ] remind user in time
* [ ] sync with backend
* [ ] improve UI
  * [ ] custom color table
  * [ ] drag on anywhere


#### Deployment

``` bash
# install dependency
npm install

# run with development mode
npm run dev

# or build a executable file for installation
npm run build
```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8d4ed60](https://github.com/SimulatedGREG/electron-vue/tree/8d4ed607d65300381a8f47d97923eb07832b1a9a) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
