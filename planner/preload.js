'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('presentationDesktop',{tile:coord=>ipcRenderer.invoke('presentation-tile',coord)});
