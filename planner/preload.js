'use strict';
const {contextBridge,ipcRenderer,webFrame}=require('electron');
contextBridge.exposeInMainWorld('presentationDesktop',{offlineBase:coord=>ipcRenderer.invoke('offline-base-tile',coord),tile:coord=>ipcRenderer.invoke('presentation-tile',coord)});

contextBridge.exposeInMainWorld('plannerDesktop',{injectModAOs:()=>ipcRenderer.invoke('inject-mod-aos'),graphicsStatus:()=>ipcRenderer.invoke('graphics-status'),displayDiagnostics:()=>ipcRenderer.invoke('display-diagnostics'),setInterfaceScale:value=>{if(Number.isFinite(value)&&value>=.5&&value<=2)webFrame.setZoomFactor(value)}});

contextBridge.exposeInMainWorld('plannerSimulation',{command:(action,options)=>ipcRenderer.invoke('simulation-command',action,options),subscribe:callback=>{if(typeof callback!=='function')throw Error('Callback required');const listener=(_event,state)=>callback(state);ipcRenderer.on('simulation-state',listener);return ()=>ipcRenderer.removeListener('simulation-state',listener);}});

contextBridge.exposeInMainWorld('plannerLocalBridge',{command:(action,options)=>ipcRenderer.invoke('local-bridge-command',action,options),subscribe:callback=>{const listener=(_event,state)=>callback(state);ipcRenderer.on('local-bridge-state',listener);return ()=>ipcRenderer.removeListener('local-bridge-state',listener);}});

contextBridge.exposeInMainWorld('plannerMetadata',{select:()=>ipcRenderer.invoke('workbench-metadata-select'),exportIndex:index=>ipcRenderer.invoke('workbench-metadata-export',index)});
