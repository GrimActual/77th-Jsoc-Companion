const {test}=require('node:test'),assert=require('node:assert/strict'),{EventEmitter}=require('node:events');
const {createFreeBridge}=require('./free-bridge');
function harness(announce=true){
 let callback;const helper=new EventEmitter();helper.stdout=new EventEmitter();helper.stderr=new EventEmitter();helper.stdout.resume=helper.stderr.resume=()=>{};helper.kill=()=>helper.killed=true;
 const relay=new EventEmitter();relay.listen=(_port,host,fn)=>{assert.equal(host,'127.0.0.1');setImmediate(fn);};relay.address=()=>({port:12345});relay.close=()=>relay.closed=true;relay.closeAllConnections=()=>{};
 const deps={createRelay:()=>relay,spawn:()=>{if(announce)setImmediate(()=>helper.stderr.emit('data','https://example-name.trycloudflare.com'));return helper;},createRemote:cb=>{callback=cb;return {start:async endpoint=>cb({status:'waiting',endpoint,token:'a'.repeat(32),point:null,received:0}),stop:()=>cb({status:'off'})};}};
 const bridge=createFreeBridge(()=>{},deps);return {bridge,helper,relay,update:s=>callback(s)};
}
test('one-click start exposes a code; stop closes only owned relay/helper and clears secrets',async()=>{
 const h=harness();const s=await h.bridge.start();assert.equal(s.status,'waiting');assert.equal(s.token.length,32);
 h.update({status:'connected',token:s.token,point:{x:1,z:2},received:1});assert.equal(h.bridge.status().received,1);
 h.bridge.stop();assert.equal(h.helper.killed,true);assert.equal(h.relay.closed,true);assert.equal(h.bridge.status().token,'');assert.equal(h.bridge.status().endpoint,'');
 h.update({status:'connected',point:{x:8,z:9}});assert.equal(h.bridge.status().point,null);
});
test('cancelling startup resolves without a late connection',async()=>{
 const h=harness(false);const pending=h.bridge.start();await new Promise(r=>setImmediate(r));h.bridge.stop();await pending;
 h.helper.stderr.emit('data','https://late-name.trycloudflare.com');assert.equal(h.bridge.status().status,'off');assert.equal(h.relay.closed,true);
});
test('helper exit clears marker and gives actionable restart message',async()=>{
 const h=harness();await h.bridge.start();h.helper.emit('exit',1);assert.equal(h.bridge.status().status,'error');assert.equal(h.bridge.status().token,'');assert.match(h.bridge.status().error,/new address/);
});
test('expired pairing stops helper instead of leaving an idle public relay running',async()=>{
 const h=harness();await h.bridge.start();h.update({status:'off'});assert.equal(h.bridge.status().status,'error');assert.equal(h.helper.killed,true);assert.match(h.bridge.status().error,/expired/);
});
