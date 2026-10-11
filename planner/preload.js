'use strict';
const {contextBridge,ipcRenderer,webFrame}=require('electron');
contextBridge.exposeInMainWorld('presentationDesktop',{offlineBase:coord=>ipcRenderer.invoke('offline-base-tile',coord),tile:coord=>ipcRenderer.invoke('presentation-tile',coord)});

contextBridge.exposeInMainWorld('plannerDesktop',{setInterfaceScale:value=>{if([1,1.1,1.25].includes(value))webFrame.setZoomFactor(value)}});
