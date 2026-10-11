'use strict';
const LIMITS=Object.freeze({wire:256*1024,raw:1024*1024,entities:1000,updates:250,events:256,inflight:8,pending:1000,diagnostics:200});
const fail=m=>{throw Error(m);};
function object(v,keys){if(!v||typeof v!=='object'||Array.isArray(v)||Object.getPrototypeOf(v)!==Object.prototype)fail('Expected plain object');for(const k of Object.keys(v))if(!keys.includes(k))fail('Unexpected field: '+k);}
function str(v,max=120){if(typeof v!=='string'||!v.length||v.length>max||/[\u0000-\u001f]/.test(v))fail('Invalid string');return v;}
function integer(v){if(!Number.isSafeInteger(v)||v<0)fail('Invalid integer');return v;}
function position(p){if(!Array.isArray(p)||p.length!==2||p.some(n=>!Number.isFinite(n)||n< -500||n>13500))fail('Invalid simulation coordinates');}
function entity(e){object(e,['id','generation','label','side','position']);str(e.id);integer(e.generation);str(e.label,200);if(!['blue','red','green','neutral'].includes(e.side))fail('Invalid faction');position(e.position);}
function event(e){object(e,['eventId','label','at']);str(e.eventId);str(e.label,300);integer(e.at);}
function list(v,max,fn){if(!Array.isArray(v)||v.length>max)fail('List limit exceeded');v.forEach(fn);}
function unique(v,key){if(new Set(v.map(x=>x[key])).size!==v.length)fail('Duplicate '+key);}
function payload(type,p){
 if(type==='orbat.snapshot'){object(p,['terrainId','coordinateSpace','units','markers','events']);if(p.terrainId!=='everon-simulation'||p.coordinateSpace!=='planner-local-meters-simulation')fail('Unsupported coordinate adapter');list(p.units,LIMITS.entities,entity);list(p.markers,LIMITS.entities,entity);if(p.units.length+p.markers.length>LIMITS.entities)fail('Entity limit exceeded');unique(p.units,'id');unique(p.markers,'id');list(p.events,LIMITS.events,event);unique(p.events,'eventId');}
 else if(type==='orbat.delta.batch'){object(p,['updates']);list(p.updates,LIMITS.updates,u=>{if(u?.kind==='event'){object(u,['kind','event']);event(u.event);return;}if(!['unit','marker'].includes(u?.target))fail('Invalid target');if(u.kind==='upsert'){object(u,['kind','target','entity']);entity(u.entity);}else if(u.kind==='delete'||u.kind==='position'){object(u,u.kind==='delete'?['kind','target','id','generation']:['kind','target','id','generation','position']);str(u.id);integer(u.generation);if(u.kind==='position')position(u.position);}else fail('Unknown update');});}
 else if(type==='ack'){object(p,['ackMessageId']);str(p.ackMessageId);}
 else if(type==='resync.request'){object(p,['reason']);if(!['revision','state','queue','timeout','initial'].includes(p.reason))fail('Invalid resync reason');}
 else if(type==='heartbeat'){object(p,[]);}else fail('Unsupported message type');
 return p;
}
function metadata(m){object(m,['protocol','type','encoding','sessionId','messageId','revision','baseRevision','payload']);if(m.protocol!=='everon-bridge-v1')fail('Unsupported protocol');str(m.sessionId);str(m.messageId);integer(m.revision);if(!['orbat.snapshot','orbat.delta.batch','ack','resync.request','heartbeat'].includes(m.type))fail('Unsupported message type');if(!['json','gzip+base64'].includes(m.encoding))fail('Unsupported encoding');if(m.type==='orbat.delta.batch'){integer(m.baseRevision);if(m.revision!==m.baseRevision+1)fail('Invalid revision advance');}else if('baseRevision'in m)fail('Unexpected base revision');}
module.exports={LIMITS,metadata,payload,entity,event,str,integer};
