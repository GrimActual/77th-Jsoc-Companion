'use strict';
const {LIMITS,payload}=require('./protocol'),{encode,message}=require('./codec');
class Batcher{
 constructor(sessionId,revision=0,{interval=2000}={}){if(![1000,2000,5000,10000].includes(interval))throw Error('Invalid interval');this.sessionId=sessionId;this.revision=revision;this.pending=[];this.inflight=new Map();this.interval=interval;this.baseInterval=interval;this.nextAt=0;this.blocked=false;}
 push(u){if(this.blocked)throw Error('Resynchronization required');payload('orbat.delta.batch',{updates:[u]});const copy=JSON.parse(JSON.stringify(u));if(u.kind==='position'){// Coalesce only after the last non-position event: preserve lifecycle/event ordering.
  for(let i=this.pending.length-1;i>=0;i--){const old=this.pending[i];if(old.kind!=='position')break;if(old.id===u.id&&old.target===u.target&&old.generation===u.generation){this.pending[i]=copy;return;}}
 }if(this.pending.length>=LIMITS.pending||u.kind==='event'&&this.pending.filter(x=>x.kind==='event').length>=LIMITS.events){this.blocked=true;throw Error('Queue full; resynchronization required');}this.pending.push(copy);}
 flush(now){if(this.blocked||now<this.nextAt||!this.pending.length)return null;if(this.inflight.size>=LIMITS.inflight){this.interval=Math.min(10000,this.interval*2);this.nextAt=now+this.interval;return null;}let count=Math.min(LIMITS.updates,this.pending.length),m,wire;while(count){m=message('orbat.delta.batch',this.sessionId,this.revision+1,{updates:this.pending.slice(0,count)},{baseRevision:this.revision});try{wire=encode(m);break;}catch(e){if(!/Wire payload limit/.test(e.message))throw e;count=Math.floor(count/2);}}if(!count){this.blocked=true;throw Error('Update cannot fit');}this.pending.splice(0,count);this.revision++;this.inflight.set(m.messageId,{wire,revision:m.revision,attempts:1,sentAt:now});this.nextAt=now+this.interval;return wire;}
 acknowledge(sessionId,id,revision){if(sessionId!==this.sessionId)return false;const b=this.inflight.get(id);if(!b||b.revision!==revision)return false;this.inflight.delete(id);if(!this.inflight.size)this.interval=this.baseInterval;return true;}
 retry(now){if(this.blocked)return null;const first=this.inflight.values().next().value;if(!first||now-first.sentAt<Math.min(10000,2000*2**(first.attempts-1)))return null;if(first.attempts>=4){this.blocked=true;throw Error('Acknowledgement timeout; resynchronization required');}first.attempts++;first.sentAt=now;return first.wire;}
 reset(sessionId,revision){this.sessionId=sessionId;this.revision=revision;this.pending=[];this.inflight.clear();this.blocked=false;this.nextAt=0;this.interval=this.baseInterval;}
 stats(){return {pending:this.pending.length,inflight:this.inflight.size,interval:this.interval,blocked:this.blocked};}
}
module.exports={Batcher};
