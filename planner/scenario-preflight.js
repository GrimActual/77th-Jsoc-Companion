/* Advisory static checks. Does not execute events, schedule a run or infer live state. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./planner-core'):root.PlannerCore,typeof module==='object'&&module.exports?require('./scenario-core'):root.CompanionScenario);if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionPreflight=api;})(globalThis,function(C,S){
'use strict';
const MAX_ISSUES=500;
function analyse(raw,mission){const clean=JSON.parse(JSON.stringify(raw,(key,value)=>{if(typeof value==='number'&&!Number.isFinite(value))throw Error('Invalid preflight number');return value;})),plan=C.validate(C.clone(mission)),scenario=S.validate(clean,plan),issues=[],counts={warning:0,info:0};
 function add(code,level,kind,id,related=[]){counts[level]++;if(issues.length<MAX_ISSUES){const subject=kind==='scenario'?null:(kind==='event'?scenario.events:scenario.objectives).find(x=>x.id===id);issues.push({code,level,kind,id,name:subject?.name||scenario.id,related:[...new Set(related)]});}}
 const complete=new Set(scenario.objectives.filter(o=>o.status==='complete').map(o=>o.id));
 const finalWrites=new Map(scenario.events.map(e=>{const values=new Map();for(const a of e.actions)if(a.type==='objective')values.set(a.id,a.status);return [e.id,values];}));
 // An optimistic closure ignores time, zones and later failures. A missing path is
 // meaningful; a found path is not proof that a real execution order exists.
 let changed=true;while(changed){changed=false;for(const e of scenario.events)if(e.requires.every(id=>complete.has(id)))for(const [id,status] of finalWrites.get(e.id))if(status==='complete'&&!complete.has(id)){complete.add(id);changed=true;}}
 const starters=new Map(plan.orderOfBattle.map(u=>[u.id,u.position]));
 if(!scenario.events.length)add('empty-events','info','scenario',scenario.id);
 for(const o of scenario.objectives)if(!complete.has(o.id))add('no-completion-path','warning','objective',o.id);
 for(const e of scenario.events){
  const blocked=e.requires.filter(id=>!complete.has(id));if(blocked.length)add('blocked-prerequisites','warning','event',e.id,blocked);
  const statuses=new Map();for(const a of e.actions)if(a.type==='objective'){if(!statuses.has(a.id))statuses.set(a.id,new Set());statuses.get(a.id).add(a.status);}
  const conflicting=[...statuses].filter(([,values])=>values.size>1).map(([id])=>id);if(conflicting.length)add('conflicting-status-actions','warning','event',e.id,conflicting);
  if(e.atMs===0)add('time-zero','info','event',e.id);
  if(e.atMs!==null){const later=e.requires.filter(id=>{if(scenario.objectives.find(o=>o.id===id).status==='complete')return false;const producers=scenario.events.filter(p=>finalWrites.get(p.id).get(id)==='complete');return producers.length>0&&producers.every(p=>p.atMs!==null&&p.atMs>e.atMs);});if(later.length)add('later-scheduled-prerequisites','warning','event',e.id,later);}
  const zones=e.conditions||[];if(zones.length){const outside=zones.filter(z=>{const p=starters.get(z.unitId);return Math.hypot(p.lat-z.center.lat,p.lng-z.center.lng)>z.radius;});if(outside.length)add('zone-needs-movement','info','event',e.id,outside.map(z=>z.unitId));else add('zones-start-inside','info','event',e.id,zones.map(z=>z.unitId));}
 }
 return {schema:'companion-preflight',version:1,scenarioId:scenario.id,scenarioVersion:scenario.version,counts:{units:plan.orderOfBattle.length,objectives:scenario.objectives.length,events:scenario.events.length,warnings:counts.warning,information:counts.info},issues,truncated:counts.warning+counts.info>issues.length,scope:'Initial draft and mission positions; optimistic prerequisite analysis, not an execution guarantee.'};
}
return {analyse,MAX_ISSUES};
});
