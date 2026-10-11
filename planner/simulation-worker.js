'use strict';
const {parentPort,workerData}=require('node:worker_threads'),{Coordinator}=require('./bridge/coordinator');
const c=new Coordinator({interval:workerData.interval});c.start();const began=Date.now();let lastStep=0,lastFrame='',lastReport=0;
function publish(force=false){const s=c.receiver.state.snapshot(),key=c.status+'|'+c.receiver.status+'|'+s.sessionId+'|'+s.revision;if(force||key!==lastFrame||Date.now()-lastReport>=1000){lastFrame=key;lastReport=Date.now();parentPort.postMessage({type:'frame',status:c.status==='running'?c.receiver.status:c.status,units:s.units,markers:s.markers,events:s.events.length,revision:s.revision,report:c.report()});}}
const timer=setInterval(()=>{try{const now=Date.now()-began;c.tick(now);if(now-lastStep>=workerData.interval){lastStep=now;c.step();}publish();}catch{c.stop();parentPort.postMessage({type:'failed'});clearInterval(timer);}},100);
parentPort.on('message',m=>{if(m?.type==='stop'){clearInterval(timer);c.stop();parentPort.close();}else if(m?.type==='interrupt'){c.interrupt();publish(true);}else if(m?.type==='crash'){throw Error('Requested simulation failure test');}});publish(true);
