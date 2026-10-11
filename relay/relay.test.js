'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict');
const {createRelay}=require('./server');
const {createRemote}=require('./test-fixtures/remote-bridge');
async function fixture(t,options={}) {
 const server=createRelay(options); await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(()=>{server.close();server.closeAllConnections();});
 const base='http://127.0.0.1:'+server.address().port+'/';
 const post=(path,body,headers={})=>fetch(base+path,{method:'POST',headers,body:JSON.stringify(body)});
 const session=async()=>{const r=await post('sessions',{});assert.equal(r.status,201);return r.json();};
 return {base,post,session,read:(s,method='GET')=>fetch(base+'session',{method,headers:{Authorization:'Bearer '+s.reader}})};
}
test('sessions isolate readers and writers; stale markers expire; disconnect revokes both credentials',async t=>{
 let now=10000;const f=await fixture(t,{clock:()=>now});const a=await f.session(),b=await f.session();
 assert.equal((await f.post('marker',{token:a.token,x:4000,z:6000})).status,200);
 assert.deepEqual((await (await f.read(a)).json()).point,{x:4000,z:6000});
 assert.equal((await (await f.read(b)).json()).point,null);
 assert.equal((await f.read({reader:a.token})).status,401);
 assert.equal((await f.post('marker',{token:b.reader,x:1,z:2})).status,400);
 assert.equal((await f.post('marker',{token:a.token,x:1,z:2})).status,429);
 now+=7001;assert.equal((await (await f.read(a)).json()).point,null);
 assert.equal((await f.read(a,'DELETE')).status,200);
 assert.equal((await f.post('marker',{token:a.token,x:1,z:2})).status,401);
 assert.equal((await f.read(a)).status,401);
});
test('rejects malformed data, browser origin, excess creation and expired sessions',async t=>{
 let now=10000;const f=await fixture(t,{clock:()=>now,lifetime:1000,maxSessions:1});const a=await f.session();
 assert.equal((await f.post('sessions',{})).status,429);
 assert.equal((await f.post('marker',{token:a.token,x:14000,z:2})).status,400);
 assert.equal((await f.post('marker',{token:a.token,x:1,z:2,extra:1})).status,400);
 assert.equal((await f.post('marker',{token:a.token,x:1,z:2},{Origin:'https://evil.example'})).status,403);
 now+=1001;assert.equal((await f.read(a)).status,401);
});
test('planner polls actual relay, clears stale state, stops and enforces HTTPS in production',async t=>{
 const f=await fixture(t,{staleAfter:80});let last;
 const client=createRemote(s=>last=s,{allowHttp:true,pollMs:20});t.after(()=>client.stop());
 const state=await client.start(f.base);assert.equal(state.status,'waiting');
 await f.post('marker',{token:state.token,x:1234,z:5678});
 const until=async predicate=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,10));}throw Error('Timed out');};
 await until(()=>last.status==='connected');assert.deepEqual(last.point,{x:1234,z:5678});
 await until(()=>last.status==='stale');assert.equal(last.point,null);
 client.stop();assert.equal(client.status().token,'');assert.equal(client.status().point,null);
 const secure=createRemote();await assert.rejects(secure.start(f.base),/HTTPS/);
 await assert.rejects(secure.start('https://host.example/subpath'),/HTTPS/);
 await assert.rejects(secure.start('https://user:secret@host.example/'),/HTTPS/);
});
test('stop during session creation cannot resurrect session',async()=>{
 let resolve;const calls=[];
 const client=createRemote(()=>{},{fetchImpl:(url,options)=>{calls.push([url,options.method]);if(options.method==='DELETE')return Promise.resolve({ok:true});return new Promise(r=>resolve=r);}});
 const pending=client.start('https://relay.example/');client.stop();
 resolve({ok:true,json:async()=>({token:'a'.repeat(32),reader:'b'.repeat(64)})});
 await pending;assert.equal(client.status().status,'off');assert.equal(calls[1][1],'DELETE');
});
