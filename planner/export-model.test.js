'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),C=require('./planner-core'),M=require('./export-model');
const view={west:0,east:9000,south:1000,north:10000};
function fixture(){return C.validate({schemaVersion:4,orderOfBattle:[{id:'same',name:'UNIT',position:{lat:4000,lng:4000}}],routes:[{id:'same',name:'ROUTE',points:[{lat:2000,lng:2000},{lat:11000,lng:8000},{lat:4000,lng:5000}]}],areas:[{id:'same',name:'CIRCLE',kind:'circle',center:{lat:5000,lng:9000},radius:1500},{id:'box',name:'BOX',kind:'rectangle',points:[{lat:9000,lng:2000},{lat:11000,lng:5000}]}]});}
test('selected scope distinguishes identical IDs across units, routes and areas',()=>{
 const p=fixture(),before=JSON.stringify(p);let s=M.scene(p,view,[{kind:'route',id:'same'}],'selected');assert.equal(s.units.length,0);assert.equal(s.routes.length,1);assert.equal(s.areas.length,0);assert.ok(s.bounds.north>11000);assert.ok(s.bounds.west<2000);
 s=M.scene(p,view,[{kind:'unit',id:'same'},{kind:'route',id:'same'},{kind:'area',id:'same'}],'selected');assert.deepEqual([s.units.length,s.routes.length,s.areas.length],[1,1,1]);assert.ok(s.bounds.east>10500);assert.equal(JSON.stringify(p),before);
});
test('route-only and area-only bounds include all vertices, rectangle corners and full circle radius',()=>{
 const p=fixture();const s=M.scene(p,view,[{kind:'area',id:'same'}],'selected');assert.ok(s.bounds.west<7500&&s.bounds.east>10500&&s.bounds.south<3500&&s.bounds.north>6500);
 const box=M.scene(p,view,[{kind:'area',id:'box'}],'selected');assert.ok(box.bounds.west<2000&&box.bounds.east>5000&&box.bounds.south<9000&&box.bounds.north>11000);
});
test('hidden phases and disabled layers are excluded; empty visible selection fails clearly',()=>{
 const p=fixture();p.view.layers.routes=false;p.areas[0].phaseId='phase-1';p.view.hiddenPhases=['phase-1'];assert.throws(()=>M.scene(p,view,[{kind:'route',id:'same'},{kind:'area',id:'same'}],'selected'),/visible/);assert.throws(()=>M.scene(p,view,[],'selected'),/visible/);
 p.view.hiddenPhases=['shared'];assert.equal(M.scene(p,view,[],'full').units.length,0);
});
test('current view is exact and full map is unchanged by selection',()=>{
 const p=fixture();assert.deepEqual(M.scene(p,view,[],'current').bounds,view);const s=M.scene(p,view,[{kind:'unit',id:'same'}],'full');assert.equal(s.routes.length,1);assert.equal(s.areas.length,2);assert.deepEqual(s.bounds,{west:-500,east:13500,south:-500,north:13500});assert.throws(()=>M.scene(p,{...view,east:0},[],'current'),/bounds/);
});
test('PDF preview and file share a centered A4 layout with at least 24-point margins',()=>{
 for(const [w,h]of [[1600,2000],[3200,1700],[1600,1600]]){const l=M.pdfLayout(w,h);assert.ok(l.x>=24-1e-8&&l.y>=24-1e-8);assert.ok(Math.abs(l.w/l.h-w/h)<1e-8);assert.ok(Math.abs(l.x*2+l.w-l.pageW)<1e-8);assert.ok(Math.abs(l.y*2+l.h-l.pageH)<1e-8);}
});
