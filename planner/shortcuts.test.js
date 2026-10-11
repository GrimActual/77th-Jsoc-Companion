'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),S=require('./shortcuts'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
test('default shortcuts include legacy alternatives and portable Command support',()=>{
 const bindings=S.validate(S.defaults());
 assert.equal(S.match({key:'z',ctrlKey:true},bindings),'undo');assert.equal(S.match({key:'z',metaKey:true,shiftKey:true},bindings),'redo');assert.equal(S.match({key:'Backspace'},bindings),'delete');
 assert.equal(S.match({key:'+',shiftKey:true},bindings),'zoomIn');assert.equal(S.match({key:'W',shiftKey:true},bindings),'panUp');assert.equal(S.match({key:'w'},bindings,false),null);assert.equal(S.match({key:'ArrowUp'},bindings,false),'panUp');
});
test('custom and disabled bindings override defaults',()=>{
 const b=S.validate({...S.defaults(),duplicate:'Ctrl+B',copy:'',panUp:'I',holdPan:'G'});assert.equal(S.match({key:'b',ctrlKey:true},b),'duplicate');assert.equal(S.match({key:'d',ctrlKey:true},b),null);assert.equal(S.match({key:'c',ctrlKey:true},b),null);assert.equal(S.match({key:'i',shiftKey:true},b),'panUp');assert.equal(S.match({key:'g'},b),'holdPan');
});
test('conflicting, reserved, malformed and ambiguous movement bindings are rejected',()=>{
 for(const change of [{copy:'Ctrl+D'},{copy:'Ctrl+W'},{copy:'Alt+C'},{copy:'Ctrl+C, Ctrl+C'},{copy:'Shift+W'},{panUp:'Ctrl+I'},{copy:4},{copy:'Tab'},{copy:'Shift+1'},{copy:'Ctrl+Shift+-'}])assert.throws(()=>S.validate({...S.defaults(),...change}));
});
test('composition, Alt and modifier-only events never activate commands',()=>{
 const b=S.defaults();for(const e of [{key:'d',ctrlKey:true,isComposing:true},{key:'a',altKey:true},{key:'Shift'},{key:'Dead'},{key:'z',ctrlKey:true,metaKey:true}])assert.equal(S.match(e,b),null);
});
test('old or corrupt shortcut preferences retain other settings; save rejects conflicts atomically',()=>{
 let saved=JSON.stringify({theme:'light',language:'de',shortcuts:{copy:'Ctrl+D'}});const w={PlannerShortcuts:S,dispatchEvent(){}};
 const ctx={window:w,document:{documentElement:{dataset:{},style:{setProperty(){}}}},Event:class{},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'preferences.js'),'utf8'),ctx);const P=w.PlannerPreferences;
 assert.equal(P.get().theme,'light');assert.equal(P.get().language,'de');assert.equal(P.get().shortcuts.copy,'Ctrl+C');const old=saved;assert.throws(()=>P.save({...P.get(),shortcuts:{...S.defaults(),copy:'Ctrl+D'}}));assert.equal(saved,old);
 const external=P.get();external.shortcuts.copy='';assert.equal(P.get().shortcuts.copy,'Ctrl+C');
});
