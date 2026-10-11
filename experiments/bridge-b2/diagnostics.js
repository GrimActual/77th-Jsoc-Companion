'use strict';
const {LIMITS}=require('./protocol');
class Diagnostics{
 constructor(){this.events=[];this.counters={receivedBytes:0,sentBytes:0,messages:0,rejected:0,resyncs:0};}
 log(level,code,now=Date.now()){const last=this.events.at(-1);if(last&&last.code===code&&last.level===level&&now-last.at<5000){last.count++;return;}this.events.push({level,code,at:now,count:1});if(this.events.length>LIMITS.diagnostics)this.events.shift();}
 report(){return JSON.parse(JSON.stringify({counters:this.counters,events:this.events}));}
}
module.exports={Diagnostics};
