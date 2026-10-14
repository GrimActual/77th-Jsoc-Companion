/* Typed native orders. Capabilities distinguish existing movement from the tactical extension. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionAIOrderContract=api;})(globalThis,function(){
'use strict';
const CAPABILITY='ai-orders-v1',TACTICAL_CAPABILITY='ai-tactical-v1',MAX_HOLD_SECONDS=300;
const kinds=Object.freeze(['ai-move','ai-hold','ai-defend','ai-halt']);
const pointKind=kind=>kind==='ai-move'||kind==='ai-defend';
const capability=kind=>kind==='ai-defend'||kind==='ai-halt'?TACTICAL_CAPABILITY:CAPABILITY;
function validate(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||![Object.prototype,null].includes(Object.getPrototypeOf(raw)))throw Error('Invalid AI order');
 for(const k of Reflect.ownKeys(raw)){const d=Object.getOwnPropertyDescriptor(raw,k);if(typeof k!=='string'||!d||!('value' in d)||!d.enumerable)throw Error('Unsupported AI order fields');}
 if(!kinds.includes(raw.kind)||raw.version!==2)throw Error('Unsupported AI order');
 const keys=['version','requestId','kind','targetRequestId','unitId',...(pointKind(raw.kind)?['worldX','worldZ']:[]),...(['ai-hold','ai-defend'].includes(raw.kind)?['holdSeconds']:[])];
 if(Object.keys(raw).length!==keys.length||keys.some(k=>!Object.hasOwn(raw,k)))throw Error('Unsupported AI order fields');
 const key=(v,max=64)=>typeof v==='string'&&new RegExp('^[A-Za-z0-9_-]{1,'+max+'}$').test(v);
 if(!key(raw.requestId,40)||!key(raw.targetRequestId,40)||raw.requestId===raw.targetRequestId||!key(raw.unitId))throw Error('Invalid AI order target');
 if(pointKind(raw.kind)&&![raw.worldX,raw.worldZ].every(v=>Number.isFinite(v)&&v>=0&&v<=13500))throw Error('AI order requires supported Everon world coordinates');
 if(['ai-hold','ai-defend'].includes(raw.kind)&&(!Number.isSafeInteger(raw.holdSeconds)||raw.holdSeconds<5||raw.holdSeconds>MAX_HOLD_SECONDS))throw Error('Hold duration must be 5–300 seconds');
 return JSON.parse(JSON.stringify(raw));
}
function capabilities(values){if(!Array.isArray(values)||values.length>2||new Set(values).size!==values.length||values.some(v=>![CAPABILITY,TACTICAL_CAPABILITY].includes(v)))throw Error('Unsupported GM capabilities');return [...values];}
return {validate,capabilities,CAPABILITY,TACTICAL_CAPABILITY,MAX_HOLD_SECONDS,kinds,pointKind,capability};
});
