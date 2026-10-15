'use strict';
const {Worker}=require('node:worker_threads'),path=require('node:path');
const MAX_INPUT_BYTES=16777216;
function start(sourceText,{timeoutMs=15000,profile='dependencies'}={}){
 if(typeof sourceText!=='string'||Buffer.byteLength(sourceText,'utf8')>MAX_INPUT_BYTES)throw Error('Source-set JSON exceeds text/byte budget');
 if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)throw Error('Invalid worker timeout');
 const profiles={scalars:{worker:'scalar-worker.cjs',schema:'command-scalar-macro-review'},conditions:{worker:'conditional-worker.cjs',schema:'command-conditional-include-review'},dependencies:{worker:'dependency-worker.cjs',schema:'command-source-dependency-review'},registrations:{worker:'registration-worker.cjs',schema:'command-sqf-function-registration-review'},includes:{worker:'include-expansion-worker.cjs',schema:'command-literal-include-expansion'}};
 if(typeof profile!=='string'||!Object.hasOwn(profiles,profile))throw Error('Unknown compiler review profile');const selected=profiles[profile];
 let worker,timer,settled=false,rejectPromise;
 const promise=new Promise((resolve,reject)=>{
  rejectPromise=reject;
  worker=new Worker(path.join(__dirname,selected.worker),{workerData:{sourceText},resourceLimits:{maxOldGenerationSizeMb:256,stackSizeMb:4}});
  const finish=(error,report)=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(report);};
  worker.once('message',message=>{if(message?.ok===true&&message.report?.schema===selected.schema&&message.report.executable===false&&message.report.summary?.executionReady===0)finish(null,message.report);else finish(Error(message?.error||'Compiler worker result rejected'));});
  worker.once('error',error=>finish(error));
  worker.once('exit',()=>{if(!settled)finish(Error('Dependency worker stopped before producing a report'));});
  timer=setTimeout(()=>finish(Error('Dependency inspection timed out')),timeoutMs);
 });
 // Await termination on either outcome; no idle worker or timer remains after completion.
 const cleaned=promise.finally(async()=>{clearTimeout(timer);if(worker)await worker.terminate();});
 return {promise:cleaned,cancel(){if(settled)return;settled=true;clearTimeout(timer);rejectPromise(Error('Dependency inspection cancelled'));}};
}
module.exports={start,MAX_INPUT_BYTES};
