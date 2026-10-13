/* Reproducible headless benchmark; this is not a map FPS or native engine test. */
const {performance}=require('node:perf_hooks');
const R=require('../resource-index');
const A='6A969EB0C5012BB9';
function run(count,withRefs){const doc={schema:'companion-resource-index',version:1,addons:[{id:A,name:'Synthetic benchmark',version:null,dependencies:[]}],resources:Array.from({length:count},(_,i)=>({id:'r'+i,addonId:A,path:'Prefabs/Test'+i+'.et',guid:null,kind:'prefab',observation:'metadata-only',provenance:{method:'manual',source:'Synthetic benchmark; no real assets',license:null},dependencies:withRefs?[{addonId:A,guid:null,path:'Prefabs/Test'+((i+1)%count)+'.et'}]:[]}))};const validation=[],audit=[],lookup=[];let bytes;
 for(let pass=0;pass<6;pass++){let t=performance.now();const idx=R.create(doc);const build=performance.now()-t;t=performance.now();const result=idx.audit();const scan=performance.now()-t;t=performance.now();for(let i=0;i<1000;i++)idx.resolve({addonId:A,guid:null,path:'Prefabs/Test'+(i%count)+'.et'});const resolve=performance.now()-t;if(!result.metadataComplete)throw new Error('Synthetic references did not resolve');bytes=Buffer.byteLength(idx.serialize());if(pass){validation.push(build);audit.push(scan);lookup.push(resolve);}}
 const stats=a=>({meanMs:+(a.reduce((s,x)=>s+x,0)/a.length).toFixed(2),maxMs:+Math.max(...a).toFixed(2)});return {resources:count,references:withRefs?count:0,serializedBytes:bytes,build:stats(validation),audit:stats(audit),resolve1000:stats(lookup)};
}
process.stdout.write(JSON.stringify({node:process.version,runs:5,warmup:1,scope:'Synthetic headless metadata only',cases:[run(10000,false),run(5000,true)]},null,2)+'\n');
