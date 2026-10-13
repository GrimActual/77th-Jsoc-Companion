/* Read-only metadata review. Never scans or loads native resources. */
const fs=require('node:fs');
const R=require('./resource-index');
function main(args){
 const [command,file,...extra]=args;
 if(!['validate','audit','resolve'].includes(command)||!file||extra.length!==(command==='resolve'?1:0))throw new Error('Usage: node resource-index-cli.js validate|audit <index.json> OR resolve <index.json> <reference-json>');
 const fd=fs.openSync(file,'r');let raw;
 try{const stat=fs.fstatSync(fd);if(!stat.isFile()||stat.size>R.LIMITS.bytes){const e=new Error('Index must be a regular file of at most 5 MiB');e.code='LIMIT';throw e;}const bytes=Buffer.alloc(R.LIMITS.bytes+1);let count=0,n;while(count<bytes.length&&(n=fs.readSync(fd,bytes,count,bytes.length-count,null))>0)count+=n;if(count>R.LIMITS.bytes){const e=new Error('Index grew beyond 5 MiB');e.code='LIMIT';throw e;}raw=bytes.subarray(0,count).toString('utf8');}finally{fs.closeSync(fd);}
 const idx=R.create(R.parse(raw));
 return command==='audit'?idx.audit():command==='resolve'?idx.resolve(JSON.parse(extra[0])):{valid:true,version:R.VERSION,addons:idx.snapshot().addons.length,resources:idx.snapshot().resources.length,scope:'Metadata contract only; native/server availability is not verified.'};
}
if(require.main===module){try{process.stdout.write(JSON.stringify(main(process.argv.slice(2)),null,2)+'\n');}catch(e){process.stderr.write(JSON.stringify({error:e.code||'INPUT',message:e.message})+'\n');process.exitCode=1;}}
module.exports={main};
