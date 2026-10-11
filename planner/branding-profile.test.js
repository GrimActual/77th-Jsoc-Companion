'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),B=require('./branding-profile');
function storage(){const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
test('community defaults round-trip and never persist operation-specific or unknown fields',()=>{
 const s=storage(),brand={community:'77th JSOC',watermark:'EXERCISE',stamp:'EXERCISE ONLY',opacity:.35,logo:null,title:'SECRET MISSION',date:'2026-10-12',operation:{name:'Never persist'}};
 assert.equal(B.load(s),null);const next=B.save(s,brand);assert.deepEqual(B.load(s),next);assert.deepEqual(Object.keys(next),['community','logo','watermark','opacity','stamp']);assert.doesNotMatch(s.getItem(B.KEY),/SECRET MISSION|2026-10-12|Never persist/);assert.equal(brand.title,'SECRET MISSION');B.forget(s);assert.equal(B.load(s),null);
});
test('untrusted stored logos, values, versions and malformed data are rejected without replacing a valid profile',()=>{
 const s=storage();B.save(s,{community:'Keep'});const before=s.getItem(B.KEY);
 for(const patch of [{logo:'https://example.com/image.png'},{logo:'data:image/svg+xml,<svg/>'},{logo:'data:image/png;base64,bad'},{logo:'x'.repeat(1500001)},{opacity:2},{stamp:'invalid'},{community:'x'.repeat(121)},{watermark:[]},null]){assert.throws(()=>B.save(s,patch));assert.equal(s.getItem(B.KEY),before);}
 for(const raw of ['{bad','null','{"version":9,"brand":{}}','{"version":1,"brand":[]}']){s.setItem(B.KEY,raw);assert.throws(()=>B.load(s));}
});
test('storage failures propagate so the interface cannot falsely claim success',()=>{
 const s={getItem(){throw Error('blocked');},setItem(){throw Error('quota');},removeItem(){throw Error('blocked');}};
 assert.throws(()=>B.save(s,{community:'JSOC'}),/quota/);assert.throws(()=>B.load(s),/blocked/);assert.throws(()=>B.forget(s),/blocked/);
});
