const {parentPort,workerData}=require('node:worker_threads');
try{parentPort.postMessage({ok:true,result:require('./workbench-metadata-cli').inspect(workerData.files)});}catch(e){parentPort.postMessage({ok:false,error:{code:e.code||'INPUT',message:e.message}});}
