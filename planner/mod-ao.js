'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const MOD='65AF366F829759CB',MISSION='{90F086877C27B6F6}Missions/JSC_IA_Eden.conf';
// Read only the required PAC1 entries; never extract archive paths onto disk.
function entries(b){
 if(b.length<64||b.toString('ascii',0,4)!=='FORM'||b.toString('ascii',8,16)!=='PAC1HEAD'||b.toString('ascii',48,52)!=='DATA')throw Error('Unsupported mod archive');
 let p=56+b.readUInt32BE(52);if(p+10>b.length||b.toString('ascii',p,p+4)!=='FILE')throw Error('Missing archive index');p+=10;const out=new Map();let total=0;
 function take(n){if(n<0||p+n>b.length)throw Error('Truncated archive');const x=b.subarray(p,p+n);p+=n;return x;}
 function dir(parent,depth){if(depth>20)throw Error('Archive nesting too deep');const count=take(4).readUInt32LE();if(count>20000)throw Error('Archive index too large');for(let i=0;i<count;i++){if(++total>50000)throw Error('Archive index too large');const kind=take(1)[0],name=take(take(1)[0]).toString('ascii'),full=parent?parent+'/'+name:name;if(kind===0)dir(full,depth+1);else if(kind===1){const v=take(24);if(out.has(full))throw Error('Duplicate archive path');out.set(full,{offset:v.readUInt32LE(),stored:v.readUInt32LE(4),plain:v.readUInt32LE(8),codec:v.readUInt32BE(16)});}else throw Error('Unsupported archive entry');}}
 dir('',0);
 return name=>{const e=out.get(name);if(!e||e.plain>2000000||e.stored>2000000||e.offset+e.stored>b.length)throw Error('Missing or oversized mission resource: '+name);const raw=b.subarray(e.offset,e.offset+e.stored);const data=e.codec===0?raw:e.codec===262?zlib.inflateSync(raw,{maxOutputLength:2000000}):null;if(!data||data.length!==e.plain)throw Error('Invalid mission resource');return data.toString('utf8');};
}
function parse(layer,prefab){
 if(!layer.startsWith('$grp JSC_MissionArea : "{0E106F95BEDE3AC7}Prefabs/JSC/JSC_MissionArea.et" {'))throw Error('Unsupported AO layer');
 const field=(s,k)=>s.match(new RegExp('(?:^|\\n)\\s*'+k+'\\s+([^\\r\\n]+)'))?.[1].trim();
 const blocks=[...layer.matchAll(/\n (AO_\w+) \{\s*\n([\s\S]*?)\n \}/g)];if(!blocks.length||blocks.length>200)throw Error('No supported AO definitions');
 return blocks.filter(([, ,s])=>(field(s,'m_bAreaEnabled')??'1')!=='0').map(([all,id,s])=>{
  const v=(field(s,'coords')||'').split(/\s+/).map(Number),radius=Number(field(s,'m_fAreaRadius')??field(prefab,'m_fAreaRadius')),raw=field(s,'m_sAreaName')??field(prefab,'m_sAreaName');
  if(v.length!==3||!v.every(Number.isFinite)||v[0]<0||v[0]>13000||v[2]<0||v[2]>13000||!Number.isFinite(radius)||radius<=0||radius>5000||!/^"[^"\r\n]+"$/.test(raw||''))throw Error('Invalid AO '+id);
  return {id:'jsoc-ia-'+id,name:raw.slice(1,-1),kind:'circle',center:{lng:v[0],lat:v[2]},radius,phaseId:null,style:{color:'#FF9933',width:2,pattern:'dashed',opacity:.15}};
 });
}
function read(folder){
 const metaPath=path.join(folder,'meta');if(fs.statSync(metaPath).size>1000000)throw Error('Mod metadata too large');const meta=JSON.parse(fs.readFileSync(metaPath,'utf8').replace(/^\uFEFF/,'')).meta,version=meta?.versions?.[meta.selectedRev??0];
 if(meta?.id!==MOD||version?.version!=='1.0.66'||!version.scenarios?.some(s=>s.gameId===MISSION))throw Error('Select Invade & Annex - Reforged 1.0.66 with the JSC_IA_Eden mission.');
 const pak=path.join(folder,'data.pak');if(fs.statSync(pak).size>100000000)throw Error('Mod archive too large');const resource=entries(fs.readFileSync(pak));
 if(!resource('Missions/JSC_IA_Eden.conf').includes('{D152FCAF0A00F67F}Worlds/JSC_IA_Everon.ent'))throw Error('Unexpected mission world');
 const sideMissions=['HVTElimination','ConvoyAmbush','IntelRetrieval','DownedPilotRescue','CacheDestruction'].map(key=>{const source=resource('scripts/Game/JSOC/SideMissions/JSC_SM_'+key+'.c'),name=source.match(/m_sName\s*=\s*"([^"]+)"/)?.[1],description=source.match(/m_sDescription\s*=\s*"([^"]+)"/)?.[1];if(!name||!description)throw Error('Unsupported side mission '+key);return {key,name,description};});
 return {mod:MOD,version:'1.0.66',mission:MISSION,sideMissions,areas:parse(resource('Worlds/JSC_IA_Everon_Layers/AO.layer'),resource('Prefabs/JSC/JSC_MissionArea.et'))};
}
function readAsync(folder){const {Worker}=require('node:worker_threads');return new Promise((resolve,reject)=>{const worker=new Worker(__filename,{workerData:{folder}});let settled=false;const timer=setTimeout(()=>{settled=true;worker.terminate();reject(Error('Mod read timed out'));},20000);worker.once('message',m=>{settled=true;clearTimeout(timer);m.error?reject(Error(m.error)):resolve(m.result);});worker.once('error',e=>{settled=true;clearTimeout(timer);reject(e);});worker.once('exit',code=>{if(!settled){clearTimeout(timer);reject(Error('Mod reader stopped: '+code));}});});}
const {isMainThread,workerData,parentPort}=require('node:worker_threads');if(!isMainThread&&workerData?.folder){try{parentPort.postMessage({result:read(workerData.folder)});}catch(e){parentPort.postMessage({error:e.message});}}
module.exports={read,readAsync,parse,entries};

