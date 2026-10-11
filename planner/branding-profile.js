/* A local community default, deliberately separate from mission/project data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlannerBrandingProfile=api;})(globalThis,()=>{
 'use strict';
 const KEY='everonCommunityBrandingV1';
 function validate(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Saved community defaults are invalid.');
  const text=(key,max)=>{const v=raw[key]??'';if(typeof v!=='string'||v.length>max)throw Error('Saved community defaults are invalid.');return v.trim();};
  const logo=raw.logo??null;
  if(logo!==null&&(typeof logo!=='string'||logo.length>1500000||!/^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$/.test(logo)))throw Error('Saved community logo is invalid.');
  const opacity=raw.opacity??.2,stamp=raw.stamp??'';
  if(![.12,.2,.35].includes(opacity)||!['','EXERCISE ONLY','FICTIONAL — TRAINING USE'].includes(stamp))throw Error('Saved community defaults are invalid.');
  return {community:text('community',120),logo,watermark:text('watermark',80),opacity,stamp};
 }
 function load(storage){const raw=storage.getItem(KEY);if(raw===null)return null;if(raw.length>1600000)throw Error('Saved community defaults are invalid.');let parsed;try{parsed=JSON.parse(raw);}catch{throw Error('Saved community defaults are invalid.');}if(parsed?.version!==1)throw Error('Saved community defaults are invalid.');return validate(parsed.brand);}
 function save(storage,brand){const next=validate(brand);storage.setItem(KEY,JSON.stringify({version:1,brand:next}));return next;}
 function forget(storage){storage.removeItem(KEY);}
 return {KEY,validate,load,save,forget};
});
