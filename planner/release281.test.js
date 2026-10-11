'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('./planner-core'),CSV=require('./plan-csv'),Clock=require('./mission-clock');
const example=()=>C.validate(JSON.parse(fs.readFileSync(__dirname+'/feature-tour.json','utf8').replace(/^\uFEFF/,'')));
test('CSV preserves assets, hierarchy, geometry, IDs, Unicode and timing across editable exchange',()=>{
 const p=example();p.orderOfBattle[0].name='=SUM(1,2)\n"Résistance"';p.operation.timing=Clock.change(null,'start','',1000);p.operation.timing=Clock.change(p.operation.timing,'mark','Phase I',2000);
 assert.deepEqual(C.validate(CSV.decode(CSV.encode(p))),C.validate(p));assert.match(CSV.encode(p),/'=SUM/);
 const rows=CSV.encode(p).replace('=SUM(1,2)','Changed');assert.match(CSV.decode(rows).orderOfBattle[0].name,/Changed/);
});
test('malformed CSV and invalid geometry cannot become a valid plan',()=>{
 const p=example();assert.throws(()=>CSV.decode('kind,id\nunit,bad'));assert.throws(()=>CSV.decode(CSV.encode(p)+'\n"unclosed'));assert.throws(()=>CSV.decode('x'.repeat(5000001)));
 const bad=CSV.encode(p).replace('"unit",','"unknown",');assert.throws(()=>CSV.decode(bad));p.orderOfBattle[0].position.lng=999999;assert.throws(()=>C.validate(CSV.decode(CSV.encode(p))));
});
test('clock start, pause, restart and event timestamps are deterministic and JSON-safe',()=>{
 let c=Clock.change(null,'start','',1000);assert.equal(Clock.elapsed(c,6000),5000);c=Clock.change(c,'mark','Phase I',6000);assert.equal(c.events[0].elapsed,5000);c=Clock.change(c,'pause','',9000);assert.equal(Clock.elapsed(c,99999),8000);c=Clock.change(c,'start','',10000);assert.equal(Clock.elapsed(c,12000),10000);assert.equal(Clock.format(3661000),'01:01:01');assert.throws(()=>Clock.validate({elapsed:-1}));assert.throws(()=>Clock.change(c,'mark',' '));const p=example();p.operation.timing=c;assert.deepEqual(C.validate(JSON.parse(JSON.stringify(p))).operation.timing,c);assert.equal(example().operation.timing,undefined);
});
test('scaling preferences persist in range and reject invalid values without affecting plans',()=>{
 let saved;const ctx={window:{dispatchEvent(){}},document:{documentElement:{dataset:{},style:{setProperty(){}}}},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},Event:class{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/preferences.js','utf8'),ctx);const P=ctx.window.PlannerPreferences;P.save({...P.get(),iconScale:'1.65',labelScale:2,lineScale:.5,exportSymbolScale:1.25,adaptiveIcons:false});assert.equal(P.get().iconScale,'1.65');assert.equal(P.get().adaptiveIcons,false);P.save({...P.get(),iconScale:Infinity,labelScale:true,lineScale:3});assert.equal(P.get().iconScale,'1');assert.equal(P.get().labelScale,'1');assert.equal(P.get().lineScale,'1');
});
