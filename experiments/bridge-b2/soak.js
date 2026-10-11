'use strict';
const assert=require('node:assert/strict'),{Coordinator}=require('./coordinator');
if(!global.gc)throw Error('Run node --expose-gc soak.js for comparable post-cleanup heap samples');
function pump(c,end){for(let t=c.now+100;t<=end;t+=100)c.tick(t);}
// Warm the codec/JIT before collecting the baseline, then discard its state.
{const warm=new Coordinator();warm.start();for(let i=0;i<300;i++){pump(warm,warm.now+2000);warm.step();}warm.stop();}
global.gc();const baseline=process.memoryUsage().heapUsed,samples=[],runs=[],started=performance.now();
for(let cycle=0;cycle<8;cycle++){
 const interval=[1000,2000,5000,10000][cycle%4];
 const c=new Coordinator({interval,seed:100+cycle,fault:({random})=>{const n=random();return n<.01?{drop:true}:n<.04?{delay:4500}:n<.05?{duplicate:true}:{};}});
 c.start();for(let i=0;i<2000;i++){pump(c,c.now+interval);c.step();if(i===800)c.interrupt();assert.equal(c.status,'running');}
 // Remove faults and let all authorized state converge after the last movement.
 c.link.fault=()=>({});pump(c,c.now+60000);assert.equal(c.status,'running');assert.equal(c.pendingSnapshot,null);const actual=c.receiver.state.snapshot(),expected=c.payload();assert.deepEqual(actual.units,expected.units);assert.deepEqual(actual.markers,expected.markers);assert.deepEqual(actual.events,expected.events);assert.equal(c.batcher.inflight.size,0);assert.equal(c.source.events.length,100);
 const r=c.report();runs.push({interval,steps:r.steps,virtualMilliseconds:r.virtualMilliseconds,recoveries:r.recoveries,retries:r.retries,reconnects:r.reconnects,dropped:r.dropped,queuePeakMessages:r.queuePeakMessages,queuePeakBytes:r.queuePeakBytes,maxPending:r.maxPending,maxInflight:r.maxInflight});c.stop();assert.equal(c.link.items.length,0);assert.equal(c.receiver.state.units.size,0);assert.equal(c.source,null);global.gc();samples.push(process.memoryUsage().heapUsed);
}
const growth=Math.max(...samples)-baseline;
assert.ok(growth<8*1024*1024,'Post-cleanup heap growth exceeded experiment budget');
console.log(JSON.stringify({simulationOnly:true,cycles:runs.length,totalSteps:runs.reduce((n,r)=>n+r.steps,0),totalVirtualHours:runs.reduce((n,r)=>n+r.virtualMilliseconds,0)/3600000,wallMilliseconds:Math.round(performance.now()-started),heapBaselineBytes:baseline,postCleanupHeapBytes:samples,maxGrowthBytes:growth,heapBudgetBytes:8*1024*1024,runs},null,2));
