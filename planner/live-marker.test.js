const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('live updates reuse the marker, skip stationary redraws, retain raw coordinates and clear stale positions',()=>{
 const events={},layers=[];let creates=0,moves=0,labels=0,fitted;
 const layer={addTo(){return this},clearLayers(){layers.length=0},getLayers(){return layers}};
 const L={layerGroup:()=>layer,circleMarker:position=>{creates++;return {position,addTo(){layers.push(this);return this},bindTooltip(text){this.text=text;return this},setLatLng(p){moves++;this.position=p;},setTooltipContent(t){labels++;this.text=t;}}}};
 const window={addEventListener:(name,fn)=>events[name]=fn};
 vm.runInNewContext(fs.readFileSync(__dirname+'/local-bridge-layer.js','utf8'),{window,L});
 window.PlannerLocalBridgeLayer.attach({setView:p=>fitted=p});
 const point=Object.freeze({x:4241.47,z:9469.76});
 const send=p=>events['local-bridge-state']({detail:{point:p}});
 for(let i=0;i<1000;i++)send(point);
 assert.equal(creates,1);assert.equal(moves,0);assert.equal(labels,0);
 send({x:4242,z:9470});assert.equal(moves,1);assert.equal(labels,0);
 send({x:4301,z:9501});assert.equal(labels,1);assert.equal(layers[0].text,'LIVE · 043-095');
 events['local-bridge-fit']();assert.deepEqual(Array.from(fitted),[9551,4351]);
 assert.deepEqual(point,{x:4241.47,z:9469.76});
 send(null);assert.equal(window.PlannerLocalBridgeView.count(),0);
 send(point);assert.equal(creates,2);assert.equal(window.PlannerLocalBridgeView.count(),1);
});
