/* Offline scenario state is separate from the immutable source mission. No game commands. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./planner-core'):root.PlannerCore);if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionScenario=api;})(globalThis,function(C){
'use strict';
const copy=C.clone, key=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(v);
function strict(v,fields){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!fields.includes(k)))throw Error('Unsupported scenario fields');}
function validate(raw,plan){strict(raw,['schema','version','id','objectives','events']);if(raw.schema!=='companion-scenario'||![1,2].includes(raw.version)||!key(raw.id))throw Error('Unsupported scenario schema');
 const s=copy(raw);if(!Array.isArray(s.objectives)||s.objectives.length>100||!Array.isArray(s.events)||s.events.length>200)throw Error('Scenario limits exceeded');
 const ids=new Set();for(const o of s.objectives){strict(o,['id','name','status']);if(!key(o.id)||ids.has(o.id)||typeof o.name!=='string'||!o.name.trim()||o.name.length>120||!['pending','active','complete','failed'].includes(o.status))throw Error('Invalid objective');ids.add(o.id);}
 const eventIds=new Set();for(const e of s.events){strict(e,['id','name','atMs','requires','actions','conditions']);if(!key(e.id)||eventIds.has(e.id)||typeof e.name!=='string'||e.name.length>120||!e.name.trim()||!Array.isArray(e.requires)||e.requires.length>100||e.requires.some(id=>!ids.has(id))||!Array.isArray(e.actions)||!e.actions.length||e.actions.length>50)throw Error('Invalid event');eventIds.add(e.id);if(e.atMs!==null&&(!Number.isSafeInteger(e.atMs)||e.atMs<0||e.atMs>86400000))throw Error('Invalid trigger time');if(e.conditions!==undefined){if(s.version!==2||!Array.isArray(e.conditions)||e.conditions.length>20)throw Error('Conditions require scenario version 2');for(const rule of e.conditions){strict(rule,['type','unitId','center','radius']);if(rule.type!=='inside-radius'||!plan.orderOfBattle.some(u=>u.id===rule.unitId)||!Number.isFinite(rule.radius)||rule.radius<1||rule.radius>5000)throw Error('Invalid spatial condition');strict(rule.center,['lat','lng']);if(!Number.isFinite(rule.center.lat)||!Number.isFinite(rule.center.lng)||Math.abs(rule.center.lat)>13500||Math.abs(rule.center.lng)>13500)throw Error('Invalid zone center');}}for(const a of e.actions)action(a,plan,ids);}
 return s;
}
function action(a,plan,objectives){if(!a||typeof a!=='object')throw Error('Invalid action');
 switch(a.type){case 'objective':strict(a,['type','id','status']);if(!objectives.has(a.id)||!['pending','active','complete','failed'].includes(a.status))throw Error('Invalid objective action');break;
 case 'move':strict(a,['type','unitId','position']);if(!plan.orderOfBattle.some(u=>u.id===a.unitId))throw Error('Unknown unit');strict(a.position,['lat','lng']);if(!Number.isFinite(a.position.lat)||!Number.isFinite(a.position.lng)||Math.abs(a.position.lat)>13500||Math.abs(a.position.lng)>13500)throw Error('Invalid movement');break;
 case 'phase':strict(a,['type','id']);if(!plan.phases.some(p=>p.id===a.id))throw Error('Unknown phase');break;
 case 'report':strict(a,['type','text']);if(typeof a.text!=='string'||!a.text.trim()||a.text.length>500)throw Error('Invalid report');break;
 default:throw Error('Action is not allowlisted');}
}
function create(mission,raw){const original=C.validate(copy(mission)),scenario=validate(raw,original);let state,events=[],active=0,parents=new Map();
 function resetState(){state={timeMs:0,paused:true,units:original.orderOfBattle.map(u=>({id:u.id,position:copy(u.position)})),objectives:copy(scenario.objectives),phaseId:null,fired:[],reports:[]};}resetState();
 function eligible(e){return e.requires.every(id=>state.objectives.find(o=>o.id===id).status==='complete')&&(e.conditions||[]).every(rule=>{const u=state.units.find(u=>u.id===rule.unitId);return Math.hypot(u.position.lat-rule.center.lat,u.position.lng-rule.center.lng)<=rule.radius;});}
 function automatic(){let progress=true;while(progress){progress=false;for(const e of scenario.events){const triggered=e.atMs!==null?e.atMs<=state.timeMs:(e.conditions||[]).length>0;if(triggered&&!state.fired.includes(e.id)&&eligible(e)){applyEvent(e.id);progress=true;}}}}
 function applyEvent(id){const e=scenario.events.find(e=>e.id===id);if(!e||state.fired.includes(id)||!eligible(e))throw Error('Event unavailable or prerequisites incomplete');
  for(const a of e.actions){if(a.type==='move')state.units.find(u=>u.id===a.unitId).position=copy(a.position);else if(a.type==='objective')state.objectives.find(o=>o.id===a.id).status=a.status;else if(a.type==='phase')state.phaseId=a.id;else state.reports.push({timeMs:state.timeMs,text:a.text});}state.fired.push(id);
 }
 function execute(cmd){strict(cmd,['type','eventId','deltaMs']);if(cmd.type==='undo'){if(Object.keys(cmd).length!==1||!active)throw Error('Nothing to undo');active=parents.get(active)||0;const chain=[];for(let at=active;at;at=parents.get(at)||0)chain.unshift(events[at-1].command);resetState();for(const c of chain)execute(c);}
  else if(cmd.type==='reset'){if(Object.keys(cmd).length!==1)throw Error('Invalid reset');resetState();active=0;}
  else if(cmd.type==='pause'||cmd.type==='resume'){if(Object.keys(cmd).length!==1)throw Error('Invalid clock command');state.paused=cmd.type==='pause';}
  else if(cmd.type==='fire'){if(Object.keys(cmd).length!==2||!key(cmd.eventId))throw Error('Invalid event command');applyEvent(cmd.eventId);if(scenario.version===2)automatic();}
  else if(cmd.type==='advance'){if(Object.keys(cmd).length!==2||!Number.isSafeInteger(cmd.deltaMs)||cmd.deltaMs<1||cmd.deltaMs>60000||state.paused||state.timeMs+cmd.deltaMs>86400000)throw Error('Invalid clock advance');state.timeMs+=cmd.deltaMs;
   automatic();
  }else throw Error('Command is not allowlisted');
 }
 function dispatch(cmd){if(events.length>=10000)throw Error('Journal capacity reached');const before=copy(state);try{execute(cmd);}catch(e){state=before;throw e;}const rev=events.length+1;if(!['undo','reset'].includes(cmd.type)){parents.set(rev,active);active=rev;}events.push({revision:rev,command:copy(cmd)});return copy(state);}
 function restore(doc){strict(doc,['schema','version','scenarioId','mission','scenario','events']);if(doc.schema!=='companion-journal'||![1,2].includes(doc.version)||doc.scenarioId!==scenario.id||JSON.stringify(doc.mission)!==JSON.stringify(original)||JSON.stringify(doc.scenario)!==JSON.stringify(scenario)||!Array.isArray(doc.events)||doc.events.length>10000)throw Error('Journal does not match its source mission and scenario');const previous=copy(state),prior=events,oldActive=active,oldParents=parents;resetState();events=[];active=0;parents=new Map();try{for(const e of doc.events){strict(e,['revision','command']);if(e.revision!==events.length+1)throw Error('Journal revisions are not ordered');if(doc.version===1&&['undo','reset'].includes(e.command?.type))throw Error('v1 journal does not support undo/reset');dispatch(e.command);}}catch(e){state=previous;events=prior;active=oldActive;parents=oldParents;throw e;}return copy(state);}
 return {dispatch,revision:()=>events.length,canUndo:()=>active>0,state:()=>copy(state),mission:()=>copy(original),scenario:()=>copy(scenario),journal:()=>({schema:'companion-journal',version:2,scenarioId:scenario.id,mission:copy(original),scenario:copy(scenario),events:copy(events)}),restore};
}
return {VERSION:1,validate,create};
});
