/* Versioned, bounded native AI requests; no scripts, resource paths or client authority. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionAIOrderContract=api;})(globalThis,function(){
'use strict';
const CAPABILITY='ai-orders-v1',MAX_HOLD_SECONDS=300;
function validate(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||![Object.prototype,null].includes(Object.getPrototypeOf(raw)))throw Error('Invalid AI order');
 const move=raw.kind==='ai-move',hold=raw.kind==='ai-hold';if(!move&&!hold||raw.version!==2)throw Error('Unsupported AI order');
 const keys=['version','requestId','kind','targetRequestId','unitId',...(move?['worldX','worldZ']:['holdSeconds'])];if(Reflect.ownKeys(raw).length!==keys.length||keys.some(k=>{const d=Object.getOwnPropertyDescriptor(raw,k);return !d||!('value' in d)||!d.enumerable;}))throw Error('Unsupported AI order fields');
 const key=(v,max=64)=>typeof v==='string'&&new RegExp('^[A-Za-z0-9_-]{1,'+max+'}$').test(v);
 if(!key(raw.requestId,40)||!key(raw.targetRequestId,40)||raw.requestId===raw.targetRequestId||!key(raw.unitId))throw Error('Invalid AI order target');
 if(move&&![raw.worldX,raw.worldZ].every(v=>Number.isFinite(v)&&v>=0&&v<=13500))throw Error('AI move requires supported Everon world coordinates');
 if(hold&&(!Number.isSafeInteger(raw.holdSeconds)||raw.holdSeconds<5||raw.holdSeconds>MAX_HOLD_SECONDS))throw Error('Hold duration must be 5–300 seconds');
 return JSON.parse(JSON.stringify(raw));
}
function capabilities(values){if(!Array.isArray(values)||values.length>1||new Set(values).size!==values.length||values.some(v=>v!==CAPABILITY))throw Error('Unsupported GM capabilities');return [...values];}
return {validate,capabilities,CAPABILITY,MAX_HOLD_SECONDS};
});
