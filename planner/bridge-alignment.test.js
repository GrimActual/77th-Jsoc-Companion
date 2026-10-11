const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('provider offset is applied once to marker and fit, while game coordinates remain unchanged',()=>{
 const handlers={},markers=[];let fitted;
 const layer={addTo(){return this},clearLayers(){markers.length=0},getLayers(){return markers}};
 const window={addEventListener:(name,fn)=>handlers[name]=fn};
 const L={layerGroup:()=>layer,circleMarker:position=>({addTo(){markers.push(position);return this},bindTooltip(){return this}})};
 vm.runInNewContext(fs.readFileSync(__dirname+'/local-bridge-layer.js','utf8'),{window,L});
 window.PlannerLocalBridgeLayer.attach({setView:position=>fitted=position});
 const point=Object.freeze({x:4241.47,z:9469.76});
 handlers['local-bridge-state']({detail:{point}});
 assert.deepEqual(Array.from(markers[0]),[9519.76,4291.47]);
 handlers['local-bridge-fit']();assert.deepEqual(Array.from(fitted),[9519.76,4291.47]);
 handlers['local-bridge-state']({detail:{point}});assert.deepEqual(Array.from(markers[0]),[9519.76,4291.47]);
 assert.deepEqual(point,{x:4241.47,z:9469.76});
 handlers['local-bridge-state']({detail:{point:null}});assert.equal(markers.length,0);
});
