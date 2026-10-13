/* Two independently validated slots. Recovery is offered explicitly, never auto-runs. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./scenario-core'):root.CompanionScenario);if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionRecovery=api;})(globalThis,function(S){
'use strict';const slots=['everonGMRecoveryA','everonGMRecoveryB'];
function verify(doc){const e=S.create(doc.mission,doc.scenario);e.restore(doc);return doc;}
function createStore(storage){
 function entries(){const result=[];for(const key of slots){try{const raw=storage.getItem(key);if(!raw||raw.length>5000000)continue;const e=JSON.parse(raw);if(e.version!==1||!Number.isSafeInteger(e.generation)||e.generation<1)continue;verify(e.journal);result.push({key,...e});}catch{}}return result.sort((a,b)=>b.generation-a.generation);}
 return {load(){return entries()[0]?.journal||null;},save(journal){verify(journal);const prior=entries()[0],key=prior?.key===slots[0]?slots[1]:slots[0];const text=JSON.stringify({version:1,generation:(prior?.generation||0)+1,journal});if(text.length>5000000)throw Error('Recovery exceeds 5 MB; export the journal');storage.setItem(key,text);const actual=storage.getItem(key);if(actual!==text)throw Error('Recovery write could not be verified');verify(JSON.parse(actual).journal);},clear(){for(const key of slots)storage.removeItem(key);}};
}return {createStore};});
