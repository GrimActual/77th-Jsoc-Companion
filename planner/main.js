'use strict';
const {app,BrowserWindow,ipcMain,shell,dialog}=require('electron');
const path=require('path');
const fs=require('fs');
const {pathToFileURL}=require('url');
let mainWindow=null,quitting=false;
const pendingTiles=new Set();
const indexPath=path.join(__dirname,'index.html');
const indexURL=pathToFileURL(indexPath).href;
function log(event){try{const file=path.join(app.getPath('userData'),'planner-lifecycle.log');fs.mkdirSync(path.dirname(file),{recursive:true});if(fs.existsSync(file)&&fs.statSync(file).size>250000)fs.renameSync(file,file+'.previous');fs.appendFileSync(file,new Date().toISOString()+' '+event+'\n')}catch{}}
function external(url){try{const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol))return;shell.openExternal(parsed.href).catch(()=>log('external-link-failed'))}catch{}}
function showWindow(){if(quitting)return;if(!mainWindow||mainWindow.isDestroyed()){createWindow();return}if(mainWindow.isMinimized())mainWindow.restore();mainWindow.show();mainWindow.focus();}
function createWindow(){
 if(quitting)return;
 const win=new BrowserWindow({width:1600,height:900,title:'COMMAND — ORBAT / Mission Planner',icon:path.join(__dirname,'command-icon.ico'),show:false,webPreferences:{nodeIntegration:false,contextIsolation:true,preload:path.join(__dirname,'preload.js')}});
 mainWindow=win;win.setMenuBarVisibility(false);
 win.once('ready-to-show',()=>{if(!win.isDestroyed())win.show()});
 // Workshop links belong in the system browser, never in hidden app windows.
 win.webContents.setWindowOpenHandler(({url})=>{external(url);return {action:'deny'}});
 win.webContents.on('will-navigate',(event,url)=>{if(url!==indexURL){event.preventDefault();external(url)}});
 win.webContents.on('render-process-gone',(_event,details)=>{log('renderer-exited '+details.reason);if(!quitting&&!win.isDestroyed()){win.show();dialog.showMessageBox(win,{type:'error',title:'Planner needs to reload',message:'The planner window stopped responding.',detail:'Reload to restore the last locally saved plan. Unapplied edits may not have been saved.',buttons:['Reload','Exit'],defaultId:0,cancelId:1}).then(({response})=>{if(quitting||win.isDestroyed())return;if(response===0)win.reload();else app.quit()})}});
 win.on('unresponsive',()=>log('window-unresponsive'));
 win.on('closed',()=>{if(mainWindow===win)mainWindow=null;log('main-window-closed');if(process.platform!=='darwin')app.quit()});
 win.loadFile(indexPath).then(()=>{log('window-loaded');if(!win.isDestroyed())win.show()}).catch(error=>{log('load-failed '+error.code);if(!quitting){dialog.showErrorBox('Planner could not open','The application files could not be loaded. Extract the entire ZIP into a folder before running the EXE.');app.quit()}});
}
const primary=app.requestSingleInstanceLock();
if(!primary){app.quit()}else{
 app.on('second-instance',()=>{log('second-launch-focus');if(app.isReady())showWindow();else app.once('ready',showWindow)});
 app.on('activate',()=>{if(app.isReady())showWindow()});
 app.on('before-quit',()=>{quitting=true;for(const controller of pendingTiles)controller.abort();log('before-quit')});
 app.on('will-quit',()=>log('will-quit'));
 app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
 ipcMain.handle('presentation-tile',async(event,coord)=>{
  if(quitting)throw Error('Planner is closing');
  if(event.senderFrame!==event.sender.mainFrame||event.senderFrame.url!==indexURL)throw Error('Unexpected sender');
  if(!coord||!['z','x','y'].every(k=>Number.isInteger(coord[k]))||coord.z<0||coord.z>5||Math.abs(coord.x)>256||Math.abs(coord.y)>256)throw Error('Invalid tile');
  const ctrl=new AbortController();pendingTiles.add(ctrl);const timer=setTimeout(()=>ctrl.abort(),12000);
  try{const response=await fetch(`https://reforger.recoil.org/map-tiles/everon/${coord.z}/${coord.x}/${coord.y}/tile.jpg`,{signal:ctrl.signal,redirect:'error'});if(!response.ok)throw Error('Terrain HTTP '+response.status);const buffer=Buffer.from(await response.arrayBuffer());if(buffer.length>4000000)throw Error('Oversized tile');return 'data:image/jpeg;base64,'+buffer.toString('base64')}finally{clearTimeout(timer);pendingTiles.delete(ctrl)}
 });
 app.whenReady().then(()=>{log('startup '+app.getVersion());createWindow()}).catch(error=>{log('startup-failed '+error.name);dialog.showErrorBox('Planner startup failed','The planner could not start. See planner-lifecycle.log in the application data folder.');app.quit()});
}
