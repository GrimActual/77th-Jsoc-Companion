'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),C=require('./planner-core');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'translations.js'),'utf8'),ctx);const dictionaries=ctx.window.PlannerTranslations;
function fixture(){const p=JSON.parse(fs.readFileSync(path.join(__dirname,'feature-tour.json'),'utf8'));p.operation.name='Routes';p.operation.briefing='My custom brief — untouched';p.phases[0].name='Shared';p.orderOfBattle[0].name='Infantry';p.orderOfBattle[1].asset='mod-uh60';p.orderOfBattle[1].assetName='UH-60 CUSTOM MOD';return C.validate(p);}
test('French/German briefs translate generated labels but preserve callsigns, mission text, phases and mod names',()=>{
 for(const language of ['fr','de']){const p=fixture(),before=JSON.stringify(p),dictionary=dictionaries[language],t=s=>dictionary[s]??s,out=C.briefing(p,{t});
  assert.ok(out.includes('**Routes**'));assert.ok(out.includes('My custom brief — untouched'));assert.ok(out.includes('**Infantry**'));assert.ok(out.includes('UH-60 CUSTOM MOD'));assert.ok(out.includes('| Shared'));
  for(const label of ['ORDER OF BATTLE (visible phases)','ROUTES','AREAS','grid','Bluefor / Friendly','Infantry','circle','radius']){assert.ok(dictionary[label],language+' missing '+label);assert.ok(out.includes(dictionary[label]),label);}
  assert.doesNotMatch(out,/\*\*ORDER OF BATTLE \(visible phases\)\*\*/);assert.equal(JSON.stringify(p),before);
 }
});
test('briefing uses supplied distance preferences and still excludes hidden phases',()=>{
 const p=fixture();let calls=0;const out=C.briefing(p,{distance:n=>{calls++;return n.toFixed(0)+' test feet';}});assert.ok(calls>=2);assert.match(out,/test feet/);
 const hidden=p.orderOfBattle.find(u=>u.phaseId);p.view.hiddenPhases=[hidden.phaseId];assert.ok(!C.briefing(p).includes('**'+hidden.name+'**'));assert.match(C.briefing(p),/ORDER OF BATTLE \(visible phases\)/);
});
