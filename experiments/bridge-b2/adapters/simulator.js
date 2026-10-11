'use strict';
const {message}=require('../codec');
class Simulator{
 constructor(sessionId,count=100){this.sessionId=sessionId;this.count=count;this.generations=Array(count).fill(0);}
 unit(i,t=0){return {id:'unit-'+i,generation:this.generations[i],label:'SIM '+i,side:'blue',position:[1500+(i%10)*400+Math.sin(t/10+i)*50,1500+Math.floor(i/10)*400+Math.cos(t/10+i)*50]};}
 snapshot(){return message('orbat.snapshot',this.sessionId,0,{terrainId:'everon-simulation',coordinateSpace:'planner-local-meters-simulation',units:Array.from({length:this.count},(_,i)=>this.unit(i)),markers:[{id:'objective',generation:0,label:'SIM objective',side:'neutral',position:[6000,6000]}],events:[]});}
 step(t,batcher){for(let i=0;i<this.count;i++){const e=this.unit(i,t);batcher.push({kind:'position',target:'unit',id:e.id,generation:e.generation,position:e.position});}if(t%20===0)batcher.push({kind:'event',event:{eventId:'objective-'+t,label:'SIM objective update '+t,at:t*2000}});if(t%100===0){batcher.push({kind:'delete',target:'unit',id:'unit-0',generation:this.generations[0]});this.generations[0]++;batcher.push({kind:'upsert',target:'unit',entity:this.unit(0,t)});}}
}
module.exports={Simulator};
