# never-todo-client

> 一个基于electron-vue框架搭建的待办列表应用

此应用由[SpicyChickenFLY](https://github.com/SpicyChickenFLY)与[bluepongo](https://github.com/bluepongo)合作开发

这个应用被分为四部分
* [后端数据库（开发中）](https://github.com/SpicyChickenFLY/never-todo-backend) - 使用Golang进行开发
* [前端Web页面（开发中）]() - 使用Vue进行开发，可能会用dart写Vue
* [PC端（Win/Linux/Mac）（发布v0.0.1）](https://github.com/bluepongo/never-todo-client)- 使用Electron-Vue框架搭建
* [移动端（Android/IOS）（开发中）](https://github.com/SpicyChickenFLY/never-todo-mobile) - 使用Dart/Flutter搭建

PC端的设计思路和逻辑编写的大量灵感来自于[xhznl-todo-list](https://github.com/xiajingren/xhznl-todo-list)这个仓库，这个APP做的特别棒，但是因为没有标签功能所以我们重新设计了一个

## 截图展示
### MacOS
![](./static/app-mac.png "")
### Win10
![](./static/app-win.png "")

## 实现功能
* [x] 添加新的待办、标签
* [x] 修改待办、标签内容
* [x] 删除待办和标签（软删除）
* [x] 将待办设置为重要并高亮显示
* [x] 为待办赋予或去除标签
* [x] 双击或点击图标完成代办
* [x] 显示进行中和已完成的待办的数目
* [x] 保持窗口显示在最前
* [x] 拖拽顶部移动窗口
* [x] 点击右下角忽略鼠标事件
* [x] 将所有的操作记录在数据库中便于远端同步

## 下个版本会修复的问题
* [x] 标签内容比较长的时候显示不正常
* [ ] MacOS中点击隐藏按钮后无法再次唤出

## 下个版本做什么
* [x] 利用lowdb增加导入导出功能
* [x] 设置开机启动功能
* [ ] 设置提醒时间，到时图标闪烁提醒
* [ ] 设计同步机制，与后端交互
* [ ] 修改优化UI，使其更加人性化
  * [ ] 调试背景的透明度
  * [ ] 改变正常文字和重要待办的颜色和样式
  * [ ] 修改标签调色盘的默认颜色
* [ ] 添加更多的键盘快捷键，让你离开鼠标

#### 项目搭建

``` bash
# 安装项目依赖
npm install

# 运行开发环境
npm run dev

# 构建对应开发平台的二进制安装包
npm run build
```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8d4ed60](https://github.com/SimulatedGREG/electron-vue/tree/8d4ed607d65300381a8f47d97923eb07832b1a9a) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
