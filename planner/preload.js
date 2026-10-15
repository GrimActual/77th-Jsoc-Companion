'use strict';
const {contextBridge,ipcRenderer,webFrame}=require('electron');
contextBridge.exposeInMainWorld('presentationDesktop',{offlineBase:coord=>ipcRenderer.invoke('offline-base-tile',coord),tile:coord=>ipcRenderer.invoke('presentation-tile',coord)});

contextBridge.exposeInMainWorld('plannerDesktop',{injectModAOs:()=>ipcRenderer.invoke('inject-mod-aos'),graphicsStatus:()=>ipcRenderer.invoke('graphics-status'),displayDiagnostics:()=>ipcRenderer.invoke('display-diagnostics'),setInterfaceScale:value=>{if(Number.isFinite(value)&&value>=.5&&value<=2)webFrame.setZoomFactor(value)}});

contextBridge.exposeInMainWorld('plannerSimulation',{command:(action,options)=>ipcRenderer.invoke('simulation-command',action,options),subscribe:callback=>{if(typeof callback!=='function')throw Error('Callback required');const listener=(_event,state)=>callback(state);ipcRenderer.on('simulation-state',listener);return ()=>ipcRenderer.removeListener('simulation-state',listener);}});

contextBridge.exposeInMainWorld('plannerLocalBridge',{command:(action,options)=>ipcRenderer.invoke('local-bridge-command',action,options),subscribe:callback=>{const listener=(_event,state)=>callback(state);ipcRenderer.on('local-bridge-state',listener);return ()=>ipcRenderer.removeListener('local-bridge-state',listener);}});

contextBridge.exposeInMainWorld('plannerMetadata',{exportSQFAST:report=>ipcRenderer.invoke('sqf-ast-export',report),exportTerrainQuery:query=>ipcRenderer.invoke('terrain-query-export',query),exportIntentDraft:draft=>ipcRenderer.invoke('sqf-intent-draft-export',draft),exportClassMap:map=>ipcRenderer.invoke('sqf-class-map-export',map),exportMigration:report=>ipcRenderer.invoke('sqf-migration-export',report),select:()=>ipcRenderer.invoke('workbench-metadata-select'),selectProject:()=>ipcRenderer.invoke('workbench-project-select'),selectIndex:()=>ipcRenderer.invoke('workbench-index-select'),exportIndex:index=>ipcRenderer.invoke('workbench-metadata-export',index),exportDeployment:doc=>ipcRenderer.invoke('deployment-intent-export',doc),exportCatalog:catalog=>ipcRenderer.invoke('workbench-catalog-export',catalog)});

contextBridge.exposeInMainWorld('plannerDependencies',{select:()=>ipcRenderer.invoke('sqf-dependency-select'),cancel:()=>ipcRenderer.invoke('sqf-dependency-cancel')});

contextBridge.exposeInMainWorld('plannerFunctions',{select:()=>ipcRenderer.invoke('sqf-function-select'),cancel:()=>ipcRenderer.invoke('sqf-function-cancel')});
