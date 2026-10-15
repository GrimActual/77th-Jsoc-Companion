'use strict';
const {contextBridge,ipcRenderer,webFrame}=require('electron');
contextBridge.exposeInMainWorld('presentationDesktop',{offlineBase:coord=>ipcRenderer.invoke('offline-base-tile',coord),tile:coord=>ipcRenderer.invoke('presentation-tile',coord)});

contextBridge.exposeInMainWorld('plannerDesktop',{injectModAOs:()=>ipcRenderer.invoke('inject-mod-aos'),graphicsStatus:()=>ipcRenderer.invoke('graphics-status'),displayDiagnostics:()=>ipcRenderer.invoke('display-diagnostics'),setInterfaceScale:value=>{if(Number.isFinite(value)&&value>=.5&&value<=2)webFrame.setZoomFactor(value)}});

contextBridge.exposeInMainWorld('plannerSimulation',{command:(action,options)=>ipcRenderer.invoke('simulation-command',action,options),subscribe:callback=>{if(typeof callback!=='function')throw Error('Callback required');const listener=(_event,state)=>callback(state);ipcRenderer.on('simulation-state',listener);return ()=>ipcRenderer.removeListener('simulation-state',listener);}});

contextBridge.exposeInMainWorld('plannerLocalBridge',{command:(action,options)=>ipcRenderer.invoke('local-bridge-command',action,options),subscribe:callback=>{const listener=(_event,state)=>callback(state);ipcRenderer.on('local-bridge-state',listener);return ()=>ipcRenderer.removeListener('local-bridge-state',listener);}});

contextBridge.exposeInMainWorld('plannerMetadata',{exportSQFAST:report=>ipcRenderer.invoke('sqf-ast-export',report),exportTerrainQuery:query=>ipcRenderer.invoke('terrain-query-export',query),exportIntentDraft:draft=>ipcRenderer.invoke('sqf-intent-draft-export',draft),exportClassMap:map=>ipcRenderer.invoke('sqf-class-map-export',map),exportMigration:report=>ipcRenderer.invoke('sqf-migration-export',report),select:()=>ipcRenderer.invoke('workbench-metadata-select'),selectProject:()=>ipcRenderer.invoke('workbench-project-select'),selectIndex:()=>ipcRenderer.invoke('workbench-index-select'),exportIndex:index=>ipcRenderer.invoke('workbench-metadata-export',index),exportDeployment:doc=>ipcRenderer.invoke('deployment-intent-export',doc),exportCatalog:catalog=>ipcRenderer.invoke('workbench-catalog-export',catalog)});

contextBridge.exposeInMainWorld('plannerDependencies',{clear:()=>ipcRenderer.invoke('sqf-dependency-clear'),select:()=>ipcRenderer.invoke('sqf-dependency-select'),cancel:()=>ipcRenderer.invoke('sqf-dependency-cancel')});

contextBridge.exposeInMainWorld('plannerFunctions',{clear:()=>ipcRenderer.invoke('sqf-function-clear'),select:()=>ipcRenderer.invoke('sqf-function-select'),cancel:()=>ipcRenderer.invoke('sqf-function-cancel')});

contextBridge.exposeInMainWorld('plannerEffects',{clear:()=>ipcRenderer.invoke('sqf-effect-clear'),select:()=>ipcRenderer.invoke('sqf-effect-select'),cancel:()=>ipcRenderer.invoke('sqf-effect-cancel')});
contextBridge.exposeInMainWorld('plannerTypes',{clear:()=>ipcRenderer.invoke('sqf-type-clear'),select:()=>ipcRenderer.invoke('sqf-type-select'),cancel:()=>ipcRenderer.invoke('sqf-type-cancel')});

contextBridge.exposeInMainWorld('plannerDiagnostics',{preview:options=>ipcRenderer.invoke('sqf-diagnostic-preview',options),status:()=>ipcRenderer.invoke('sqf-diagnostic-status'),export:options=>ipcRenderer.invoke('sqf-diagnostic-export',options)});

contextBridge.exposeInMainWorld('plannerProjectReview',{select:()=>ipcRenderer.invoke('sqf-project-select'),cancel:()=>ipcRenderer.invoke('sqf-project-cancel')});

contextBridge.exposeInMainWorld('plannerAdapters',{status:()=>ipcRenderer.invoke('sqf-adapter-status'),preprocess:options=>ipcRenderer.invoke('sqf-adapter-preprocess',options),packagePreprocessing:options=>ipcRenderer.invoke('sqf-adapter-package',options),savePreprocessing:options=>ipcRenderer.invoke('sqf-adapter-save-preprocess',options),exportJobs:options=>ipcRenderer.invoke('sqf-adapter-export-jobs',options),cancel:()=>ipcRenderer.invoke('sqf-adapter-cancel')});
