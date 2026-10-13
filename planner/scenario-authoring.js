/* Validated draft edits; never changes a running engine or the source mission. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./scenario-core'):root.CompanionScenario);if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionScenarioAuthoring=api;})(globalThis,function(S){
'use strict';
const clone=value=>JSON.parse(JSON.stringify(value,(key,item)=>{if(typeof item==='number'&&!Number.isFinite(item))throw Error('Draft contains an invalid number');return item;}));
function replaceItem(draft,kind,id,item,mission){
 if(!['objectives','events'].includes(kind))throw Error('Unsupported draft item');
 if(!item||item.id!==id)throw Error('Keep the existing ID when editing; use the complete JSON editor for reference changes.');
 const next=clone(draft),index=next[kind].findIndex(row=>row.id===id);
 if(index<0)throw Error('Draft item no longer exists');
 next[kind][index]=clone(item);
 return S.validate(next,mission);
}
function formEditable(event){return Array.isArray(event?.actions)&&event.actions.length===1&&Array.isArray(event.requires)&&event.requires.length<=1&&(event.conditions||[]).length<=1&&!(event.atMs!==null&&(event.conditions||[]).length);}
return {replaceItem,formEditable};
});
