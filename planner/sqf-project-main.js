/* One explicit package, sequential workers, then one synchronous snapshot publication. */
'use strict';
const crypto=require('node:crypto'),D=require('./sqf-dependency-main');
function install({ipcMain,dialog,getWindow,indexURL,reviews,run=D.start,load=paths=>D.loadSelection(paths,{functions:true})}){
 const profiles=['dependencies','functions','types','effects'];let epoch=0,busy=false,job=null,reservations=[];
 const trusted=(event,args)=>{const w=getWindow();if(!w||w.isDestroyed()||event.sender!==w.webContents||event.senderFrame!==w.webContents.mainFrame||event.senderFrame.url!==indexURL||args.length)throw Error('Unexpected project review sender or arguments');return w;};
 const release=()=>{for(const r of reservations)r.release();reservations=[];};
 const reset=()=>{epoch++;job?.cancel();job=null;release();busy=false;};
 ipcMain.handle('sqf-project-select',async(event,...args)=>{
  const w=trusted(event,args);if(busy)return {ok:false,error:'A project review is already active'};
  for(const p of profiles){const reservation=reviews[p].reserve();if(!reservation){release();return {ok:false,error:'Wait for the active source review to finish'};}reservations.push(reservation);}
  busy=true;const at=++epoch,current=()=>at===epoch&&!w.isDestroyed()&&reservations.length===4&&reservations.every(r=>r.current());
  try{
   const selected=await dialog.showOpenDialog(w,{title:'Choose one source-package JSON for all four reviews',properties:['openFile'],filters:[{name:'COMMAND source package',extensions:['json']}]});
   if(selected.canceled||!current())return {cancelled:true};
   if(selected.filePaths.length!==1||!/\.json$/i.test(selected.filePaths[0]))throw Error('Select one source-package JSON');
   const captured=await load(selected.filePaths);if(!current())return {cancelled:true};
   const reports={};for(const profile of profiles){job=run(captured.input,{profile});reports[profile]=await job.promise;job=null;if(!current())return {cancelled:true};}
   for(const f of captured.originals){const bytes=await D.read(f.file,f.max);if(crypto.createHash('sha256').update(bytes).digest('hex')!==f.hash)throw Error('Source package changed during review');}
   if(!current())return {cancelled:true};
   // No awaits in this loop: every export owner changes in the same event-loop turn.
   profiles.forEach((p,i)=>reservations[i].publish({input:captured.input,report:reports[p]}));
   return {ok:true,reports,files:captured.input.files};
  }catch(e){return at!==epoch?{cancelled:true}:{ok:false,error:e.message};}
  finally{if(at===epoch){release();busy=false;job=null;}}
 });
 ipcMain.handle('sqf-project-cancel',(event,...args)=>{trusted(event,args);reset();return {cancelled:true};});
 return {reset};
}
module.exports={install};
