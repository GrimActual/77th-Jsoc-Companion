'use strict';
const {LIMITS}=require('../protocol');
class FaultQueue{
 constructor({seed=1,fault=()=>({}),maxMessages=64,maxBytes=2*1024*1024}={}){this.seed=seed>>>0;this.fault=fault;this.maxMessages=maxMessages;this.maxBytes=maxBytes;this.items=[];this.bytes=0;this.sequence=0;this.peakMessages=0;this.peakBytes=0;this.dropped=0;}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 send(direction,wire,now){if(typeof wire!=='string'||Buffer.byteLength(wire)>LIMITS.wire)throw Error('Transport wire limit');const f=this.fault({direction,wire,sequence:this.sequence++,random:()=>this.random()})||{};if(f.drop){this.dropped++;return false;}const data=f.corrupt?'{broken':wire,bytes=Buffer.byteLength(data),copies=f.duplicate?2:1;const delay=f.delay??0;if(!Number.isFinite(delay)||delay<0||delay>60000)throw Error('Invalid fault delay');if(this.items.length+copies>this.maxMessages||this.bytes+bytes*copies>this.maxBytes)throw Error('Transport queue full');for(let i=0;i<copies;i++)this.items.push({direction,wire:data,bytes,due:now+delay+i,order:this.sequence++});this.bytes+=bytes*copies;this.peakMessages=Math.max(this.peakMessages,this.items.length);this.peakBytes=Math.max(this.peakBytes,this.bytes);return true;}
 drain(now,deliver){const ready=this.items.filter(x=>x.due<=now).sort((a,b)=>a.due-b.due||a.order-b.order);this.items=this.items.filter(x=>x.due>now);this.bytes=this.items.reduce((n,x)=>n+x.bytes,0);const epoch=this.epoch;for(const item of ready){if(this.epoch!==epoch)break;deliver(item.direction,item.wire);}}
 clear(){this.items=[];this.bytes=0;this.epoch=(this.epoch||0)+1;}
}
module.exports={FaultQueue};
