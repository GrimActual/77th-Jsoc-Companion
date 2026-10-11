'use strict';
const path=require('node:path'),fs=require('node:fs'),{spawn}=require('node:child_process');
const {createRelay}=require('./bridge-runtime/relay');
const {createRemote}=require('./remote-bridge');
function createFreeBridge(onState=()=>{},deps={}) {
 const spawnHelper=deps.spawn||spawn,relayFactory=deps.createRelay||createRelay,remoteFactory=deps.createRemote||(callback=>createRemote(callback,{allowHttp:true}));
 let generation=0,relay=null,child=null,remote=null,cancel=null,starting=false;
 let state={mode:'free',status:'off',token:'',endpoint:'',point:null,received:0};
 const publish=()=>onState({...state});
 function stop(reason='') {
  generation++;starting=false;cancel?.abort();cancel=null;
  const oldRemote=remote;remote=null;oldRemote?.stop();
  const oldChild=child;child=null;oldChild?.kill();
  const oldRelay=relay;relay=null;if(oldRelay){oldRelay.close();oldRelay.closeAllConnections();}
  state={mode:'free',status:reason?'error':'off',error:reason,token:'',endpoint:'',point:null,received:0};publish();return {...state};
 }
 async function start() {
  if(starting||state.status!=='off'&&state.status!=='error')return {...state};
  stop();const ticket=generation;starting=true;cancel=new AbortController();const signal=cancel.signal;
  const check=()=>{if(ticket!==generation)throw Error('Cancelled');};
  state.status='starting';publish();
  try {
   const exe=path.join(__dirname,'bridge-runtime/cloudflared.exe');
   if(!deps.spawn&&!fs.existsSync(exe))throw Error('Tunnel helper is missing. Extract the whole application ZIP.');
   const srv=relayFactory();relay=srv;
   await new Promise((resolve,reject)=>{srv.once('error',reject);srv.listen(0,'127.0.0.1',()=>{if(signal.aborted){srv.close();reject(Error('Cancelled'));}else resolve();});});check();
   child=spawnHelper(exe,['tunnel','--url','http://127.0.0.1:'+srv.address().port,'--no-autoupdate'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
   const helper=child;
   const endpoint=await new Promise((resolve,reject)=>{
    let buffer='',publicURL='',registered=false;const timeout=setTimeout(()=>finish(Error('Tunnel startup timed out. Check your internet connection and retry.')),45000);
    const aborted=()=>finish(Error('Cancelled'));
    function finish(error,url){clearTimeout(timeout);signal.removeEventListener('abort',aborted);helper.stdout.removeListener('data',output);helper.stderr.removeListener('data',output);if(error)reject(error);else resolve(url);}
    function output(chunk){buffer=(buffer+String(chunk)).slice(-16000);const match=buffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);if(match)publicURL=match[0]+'/';if(buffer.includes('Registered tunnel connection'))registered=true;if(publicURL&&registered)finish(null,publicURL);}
    helper.stdout.on('data',output);helper.stderr.on('data',output);signal.addEventListener('abort',aborted,{once:true});
    helper.once('error',()=>{finish(Error('Tunnel helper could not start.'));if(ticket===generation)stop('Tunnel helper could not start.');});
    helper.once('exit',()=>{finish(Error('Tunnel stopped. Click Start free connection to create a new address.'));if(ticket===generation)stop('Tunnel stopped. Start again and copy the new address and code into the game.');});
   });check();
   // Drain output but do not persist addresses or credentials in logs.
   helper.stdout.resume();helper.stderr.resume();
   state={...state,status:'pairing',endpoint};publish();
   remote=remoteFactory(s=>{
    if(ticket!==generation)return;
    if(s.status==='off'){if(!starting)stop('Pairing expired. Start again and copy the new code into the game.');return;}
    state={...s,mode:'free',endpoint,error:''};publish();
   });
   // The planner and relay share this PC. Keep reads and pairing local;
   // only the game needs the public tunnel. Never expose this loopback URL in UI.
   await remote.start('http://127.0.0.1:'+srv.address().port+'/');
   check();starting=false;return {...state};
  }catch(e){if(ticket===generation)stop(e.message);return {...state};}
 }
 return {start,stop,status:()=>({...state})};
}
module.exports={createFreeBridge};



