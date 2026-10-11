'use strict';
const crypto=require('node:crypto'),P=require('./protocol');
const clone=v=>JSON.parse(JSON.stringify(v));
class SyncState{
 constructor(){this.reset(null);}
 reset(sessionId){this.sessionId=sessionId;this.revision=null;this.awaitingSnapshot=true;this.units=new Map();this.markers=new Map();this.events=[];this.tombstones=new Map();this.seen=new Map();}
 resync(){this.awaitingSnapshot=true;}
 apply(m){P.metadata(m);P.payload(m.type,m.payload);if(m.sessionId!==this.sessionId)return {status:'stale-session'};const hash=crypto.createHash('sha256').update(JSON.stringify(m)).digest('hex');if(this.seen.has(m.messageId)){if(this.seen.get(m.messageId)!==hash)throw Error('Inconsistent duplicate');if(this.awaitingSnapshot)return {status:'resync',reason:'revision'};return {status:'duplicate',revision:this.revision};}
 const remember=()=>{this.seen.set(m.messageId,hash);if(this.seen.size>512)this.seen.delete(this.seen.keys().next().value);};
 if(m.type==='orbat.snapshot'){if(!this.awaitingSnapshot||this.revision!==null&&m.revision<this.revision)return {status:'stale-snapshot'};this.units=new Map(m.payload.units.map(e=>[e.id,clone(e)]));this.markers=new Map(m.payload.markers.map(e=>[e.id,clone(e)]));this.events=clone(m.payload.events);this.tombstones.clear();this.revision=m.revision;this.awaitingSnapshot=false;remember();return {status:'applied',revision:this.revision};}
 if(m.type!=='orbat.delta.batch')return {status:'control',revision:this.revision};
 if(this.awaitingSnapshot||m.baseRevision!==this.revision){this.resync();return {status:'resync',reason:'revision'};}
 const units=new Map(this.units),markers=new Map(this.markers),events=this.events.slice(),tombs=new Map(this.tombstones);const ids=new Set(events.map(e=>e.eventId));
 for(const u of m.payload.updates){if(u.kind==='event'){if(ids.has(u.event.eventId))throw Error('Duplicate event');ids.add(u.event.eventId);events.push(clone(u.event));continue;}const map=u.target==='unit'?units:markers,id=u.kind==='upsert'?u.entity.id:u.id,key=u.target+':'+id,old=map.get(id),generation=u.kind==='upsert'?u.entity.generation:u.generation;
  if(u.kind==='upsert'){if(old&&generation<old.generation||tombs.has(key)&&generation<=tombs.get(key)){this.resync();return {status:'resync',reason:'state'};}map.set(id,clone(u.entity));}
  else{if(!old||generation!==old.generation){this.resync();return {status:'resync',reason:'state'};}if(u.kind==='position')map.set(id,{...old,position:[...u.position]});else{map.delete(id);tombs.set(key,generation);}}
 }
 if(units.size+markers.size>P.LIMITS.entities||events.length>P.LIMITS.events||tombs.size>P.LIMITS.entities){this.resync();return {status:'resync',reason:'queue'};}
 this.units=units;this.markers=markers;this.events=events;this.tombstones=tombs;this.revision=m.revision;remember();return {status:'applied',revision:this.revision};
 }
 snapshot(){return {sessionId:this.sessionId,revision:this.revision,awaitingSnapshot:this.awaitingSnapshot,units:clone([...this.units.values()]),markers:clone([...this.markers.values()]),events:clone(this.events)};}
}
module.exports={SyncState};
