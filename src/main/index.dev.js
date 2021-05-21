/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
// require('electron-debug')({ showDevTools: true })
require('electron-debug')()
// import {  BrowserWindow } from 'electron';

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  //手动加载vue-devtools，前提是 npm install vue-devtools --save-dev
  // BrowserWindow.addDevToolsExtension('node_modules/vue-devtools/vender')
})

// Require `main` process to boot app
require('./index')