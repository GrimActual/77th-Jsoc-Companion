/* Protocol 3: bounded, explicitly allowlisted telemetry; heartbeat membership plus deltas. */
'use strict';
const key=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(v);
function ids(raw){if(!Array.isArray(raw)||!raw.length||raw.length>60||raw.some(x=>!key(x))||new Set(raw).size!==raw.length)throw Error('Choose 1–60 distinct entity IDs');return raw.slice();}
function state(entityIds){return {allowlist:new Set(ids(entityIds)),entities:new Map(),lastSequence:0,lastWrite:null,lastBody:'',needsSnapshot:true};}
function fields(v,allowed){if(!v||typeof v!=='object'||Array.isArray(v)||![Object.prototype,null].includes(Object.getPrototypeOf(v))||Reflect.ownKeys(v).length!==allowed.length||allowed.some(k=>{const d=Object.getOwnPropertyDescriptor(v,k);return !d||!('value' in d)||!d.enumerable;}))throw Error('Unsupported batch fields');}
function apply(s,b,now){
 fields(b,['protocol','token','sequence','full','activeIds','entities']);
 if(b.protocol!==3||!Number.isSafeInteger(b.sequence)||b.sequence<1||typeof b.full!=='boolean'||!Array.isArray(b.activeIds)||b.activeIds.length>60||new Set(b.activeIds).size!==b.activeIds.length||b.activeIds.some(id=>!key(id)||!s.allowlist.has(id))||!Array.isArray(b.entities)||b.entities.length>60)throw Error('Invalid or unauthorised tracked batch');
 const active=new Set(b.activeIds),changes=new Map();
 for(const e of b.entities){fields(e,['id','x','z']);if(!key(e.id)||!active.has(e.id)||changes.has(e.id)||!Number.isFinite(e.x)||!Number.isFinite(e.z)||Math.abs(e.x)>13500||Math.abs(e.z)>13500)throw Error('Invalid entity state');changes.set(e.id,{id:e.id,x:e.x,z:e.z});}
 if(b.full&&changes.size!==active.size)throw Error('Full snapshot must include every active entity');
 const canonical=JSON.stringify({full:b.full,activeIds:[...active].sort(),entities:[...changes.values()].sort((a,b)=>a.id.localeCompare(b.id))});
 if(b.sequence<s.lastSequence)return {status:409,error:'Out-of-order batch'};
 if(b.sequence===s.lastSequence){if(canonical!==s.lastBody)throw Error('Conflicting duplicate batch');return {status:200,duplicate:true};}
 if((s.needsSnapshot||b.sequence!==s.lastSequence+1)&&!b.full)return {status:409,error:'Full snapshot required',snapshotRequired:true};
 if(s.lastWrite!==null&&now-s.lastWrite<1000)return {status:429,error:'Batch updates must be at least one second apart'};
 const next=new Map();for(const id of active){const e=changes.get(id)||(b.full?null:s.entities.get(id));if(!e)return {status:409,error:'Full snapshot required after baseline expiry',snapshotRequired:true};next.set(id,{id:e.id,x:e.x,z:e.z,updated:now});}
 s.entities=next;s.lastSequence=b.sequence;s.lastWrite=now;s.lastBody=canonical;s.needsSnapshot=false;return {status:200};
}
function snapshot(s,now,staleAfter=5000){for(const [id,e] of s.entities)if(now-e.updated>=staleAfter)s.entities.delete(id);return [...s.entities.values()].map(({id,x,z})=>({id,x,z}));}
class Publisher {
 constructor(entityIds,{distance=.5,fullEvery=10}={}){this.allowed=new Set(ids(entityIds));if(!Number.isFinite(distance)||distance<0||!Number.isInteger(fullEvery)||fullEvery<1||fullEvery>60)throw Error('Invalid publisher options');this.distance=distance;this.fullEvery=fullEvery;this.sequence=0;this.previous=new Map();}
 next(points,token,{forceFull=false}={}){if(typeof token!=='string'||!/^[a-f0-9]{32}$/.test(token)||!Array.isArray(points)||points.length>60)throw Error('Invalid publisher input');const all=new Map();for(const p of points){fields(p,['id','x','z']);if(!this.allowed.has(p.id)||all.has(p.id)||!Number.isFinite(p.x)||!Number.isFinite(p.z)||Math.abs(p.x)>13500||Math.abs(p.z)>13500)throw Error('Invalid publisher entity');all.set(p.id,{...p});}const full=forceFull||this.sequence%this.fullEvery===0;const entities=[...all.values()].filter(p=>{const old=this.previous.get(p.id);return full||!old||Math.hypot(p.x-old.x,p.z-old.z)>=this.distance;});const next=new Map();for(const p of all.values())next.set(p.id,entities.find(e=>e.id===p.id)||this.previous.get(p.id));this.previous=next;return {protocol:3,token,sequence:++this.sequence,full,activeIds:[...all.keys()],entities};}
}
module.exports={ids,state,apply,snapshot,Publisher};
