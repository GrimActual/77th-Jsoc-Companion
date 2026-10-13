/* Ephemeral tracked-entity cache. Not part of mission saves or undo. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionTrackedEntities=api;})(globalThis,function(){
'use strict';
const key=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(v);
function create(entityIds,{clock=Date.now,staleAfter=5000}={}){
 if(!Array.isArray(entityIds)||!entityIds.length||entityIds.length>60||entityIds.some(id=>!key(id))||new Set(entityIds).size!==entityIds.length||!Number.isFinite(staleAfter)||staleAfter<2000||staleAfter>30000)throw Error('Invalid tracking scope');
 const allowed=new Set(entityIds);let entities=new Map(),lastSnapshot=new Map(),sequence=0;
 function prune(){const now=clock();for(const [id,e] of entities)if(now-e.updated>=staleAfter)entities.delete(id);return snapshot();}
 function snapshot(){return [...entities.values()].map(({id,x,z})=>({id,x,z}));}
 function apply(batch){if(!batch||batch.protocol!==3||!Number.isSafeInteger(batch.sequence)||batch.sequence<sequence||batch.sequence<0||!Array.isArray(batch.entities)||batch.entities.length>60)throw Error('Invalid tracked snapshot');const next=new Map();for(const e of batch.entities){if(!e||Object.keys(e).sort().join(',')!=='id,x,z'||!allowed.has(e.id)||next.has(e.id)||!Number.isFinite(e.x)||!Number.isFinite(e.z)||Math.abs(e.x)>13500||Math.abs(e.z)>13500)throw Error('Invalid or unauthorised tracked entity');next.set(e.id,{id:e.id,x:e.x,z:e.z,updated:clock()});}
 if(batch.sequence===0&&next.size)throw Error('Unsequenced entity snapshot');
 if(batch.sequence===sequence){for(const [id,e]of next){const old=lastSnapshot.get(id);if(!old||old.x!==e.x||old.z!==e.z)throw Error('Entity changed without a new sequence');}return {advanced:false,entities:prune()};}
 sequence=batch.sequence;entities=next;lastSnapshot=new Map(next);return {advanced:true,entities:prune()};
 }
 return {apply,prune,snapshot,sequence:()=>sequence,clear(){entities.clear();lastSnapshot.clear();sequence=0;}};
}
return {create};
});
