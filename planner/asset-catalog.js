/* Portable planning catalogs; no engine availability claims. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionAssetCatalog=api;})(globalThis,function(){
'use strict';
const MAX_BYTES=5000000;
function copy(raw){const text=JSON.stringify(raw);if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('Catalog exceeds 5 MB');return JSON.parse(text);}
function normalize(raw){const d=copy(raw),a=Array.isArray(d)?d:d?.assets??d?.game?.mods??d?.mods;if(!Array.isArray(a)||a.length>10000)throw Error('Expected an assets, mods or game.mods array (up to 10,000 items)');const ids=new Set();return a.map((x,i)=>{if(!x||typeof x.name!=='string'||!x.name.trim())throw Error('Every asset needs a name');const id=String(x.id??x.modId??x.workshopId??'asset-'+i);if(!id||id==='none'||ids.has(id))throw Error('Duplicate, empty or reserved asset ID');ids.add(id);return {...x,id,name:x.name.trim(),category:String(x.category||'Imported'),workshopId:String(x.workshopId??x.modId??''),searchQuery:String(x.searchQuery??'')};});}
function stable(v){if(Array.isArray(v))return v.map(stable);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));return v;}
function combine(session,assigned){const a=normalize(session),b=normalizeAssigned(assigned),byId=new Map(a.map(x=>[x.id,x]));for(const item of b){const prior=byId.get(item.id);if(prior&&JSON.stringify(stable(prior))!==JSON.stringify(stable(item)))throw Error('Conflicting asset snapshots: '+item.id);if(!prior){byId.set(item.id,item);a.push(item);}}return {assets:normalize(a)};}
function normalizeAssigned(raw){if(!Array.isArray(raw)||raw.length>10000)throw Error('Too many assigned asset snapshots');return raw.map(x=>normalize([x])[0]);}
function validate(raw){const doc={assets:normalize(raw)};if(!doc.assets.length)throw Error('No planning assets to export');copy(doc);return doc;}
return {normalize,combine,validate,MAX_BYTES};
});
