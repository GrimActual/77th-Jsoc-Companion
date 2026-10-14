/* Local, paged catalog browser. Classification hints do not change asset provenance. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionAssetBrowser=api;})(globalThis,function(){
'use strict';
const categories={all:'All asset types',troops:'Troops',vehicles:'Vehicles',groups:'Groups',armor:'Armoured vehicles',mechanized:'APCs / IFVs',motorized:'Light vehicles',rotary:'Helicopters',fixed:'Aircraft',logistics:'Trucks / logistics vehicles',weapons:'Weapons',equipment:'Equipment',structures:'Structures',props:'Props',other:'Other / unclassified'};
const fold=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function describe(a){
 const path=String(a.resourceReference?.path||''),category=fold(a.category),hint=fold([a.assetKind,a.vehicleType,a.type].filter(Boolean).join(' '));let kind='other';
 // Prefab folders identify the entity family more reliably than a vehicle/weapon name.
 if(/(?:^|\/)Groups\//i.test(path)||/\bgroups?\b/.test(category))kind='groups';
 else if(/(?:^|\/)Characters\//i.test(path)||/\b(characters?|infantry|soldiers?|troops?)\b/.test(category)||/\b(infantry|soldier|troop)\b/.test(hint))kind='troops';
 else if(/(?:^|\/)Vehicles\//i.test(path)||/\bvehicles?\b/.test(category)||/\b(tank|apc|truck|boat|helicopter|aircraft|lightvehicle)\b/.test(hint))kind='vehicles';
 else if(/(?:^|\/)Weapons\//i.test(path)||/\bweapons?\b/.test(category))kind='weapons';
 else if(/(?:^|\/)Items\//i.test(path)||/\b(items?|equipment)\b/.test(category))kind='equipment';
 else if(/(?:^|\/)Structures\//i.test(path)||/\bstructures?\b/.test(category))kind='structures';
 else if(/(?:^|\/)Props\//i.test(path)||/\bprops?\b/.test(category))kind='props';
 const basename=path.split('/').pop()?.replace(/\.et$/i,'');
 const title=basename?basename.replace(/^(?:Character|Vehicle|Group|Weapon|Item)_/i,'').replace(/_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2'):String(a.name||'');
 const faction=path.match(/\/Factions\/([^/]+)/i)?.[1]||'unknown';
 const tags=[kind];if(kind==='vehicles'){if(/^(tank|apc)$/.test(a.assetKind)||/\/(?:Armored|Armoured)\/|\b(?:btr|bmp|m113|bradley|abrams|t72|tank)/i.test(path))tags.push('armor');if(a.assetKind==='apc'||/\b(?:btr|bmp|m113|bradley|apc|ifv)/i.test(path))tags.push('mechanized');if(a.assetKind==='lightVehicle')tags.push('motorized');if(a.assetKind==='truck')tags.push('logistics');if(a.assetKind==='helicopter'||/\/Helicopters\//i.test(path))tags.push('rotary');if(a.assetKind==='aircraft'||/\/(?:Planes|Aircraft)\//i.test(path))tags.push('fixed');}const variant=/(?:^|[\/ _])(base(?:body)?|bases|damaged|destroyed|wreck|helper|template|dst|dbr|lights|wheels|components)(?:[\/ _\.]|$)/i.test(path)||/(?:^|_)base\.et$/i.test(path);
 return {asset:a,title,kind,tags,faction,variant,search:fold([a.name,title,path,a.category,a.author,a.modId,a.resourceReference?.guid,faction].join(' '))};
}
function filter(rows,{query='',kind='all',faction='all',variants=true}={}){const tokens=fold(query).trim().split(/\s+/).filter(Boolean);return rows.filter(r=>(kind==='all'||r.tags.includes(kind))&&(faction==='all'||r.faction===faction)&&(variants||!r.variant)&&tokens.every(s=>r.search.includes(s)));}
function attach({select,host,translate,choose}){
 const t=translate,doc=host.ownerDocument;let rows=[],page=0,timer=0;const cache=new WeakMap(),size=20;
 const el=(tag,text)=>{const n=doc.createElement(tag);if(text)n.textContent=text;return n;};
 const summary=el('button');summary.type='button';summary.id='assetBrowse';summary.setAttribute('aria-expanded','false');
 const panel=el('section');panel.id='assetBrowser';panel.className='asset-browser';panel.hidden=true;summary.setAttribute('aria-controls',panel.id);
 const searchLabel=el('label');searchLabel.htmlFor='assetQuery';const query=el('input');query.type='search';query.id='assetQuery';query.maxLength=200;
 const typeLabel=el('label');typeLabel.htmlFor='assetTypeFilter';const type=el('select');type.id='assetTypeFilter';
 const factionLabel=el('label');factionLabel.htmlFor='assetFactionFilter';const faction=el('select');faction.id='assetFactionFilter';
 const variantLabel=el('label');variantLabel.className='check';const variants=el('input');variants.type='checkbox';variants.id='assetVariants';variants.checked=false;const variantText=el('span');variantLabel.append(variants,variantText);
 const count=el('p');count.id='assetResultCount';count.setAttribute('role','status');const results=el('div');results.id='assetResults';
 const nav=el('div');nav.className='actions';const prev=el('button'),next=el('button');prev.type=next.type='button';prev.id='assetPrevious';next.id='assetNext';nav.append(prev,next);
 const clear=el('button');clear.type='button';clear.id='assetUnassign';
 const note=el('p');note.className='hint';
 panel.append(searchLabel,query,typeLabel,type,factionLabel,faction,variantLabel,count,results,nav,clear,note);host.append(summary,panel);select.hidden=true;
 function option(target,value,text){const n=el('option',text);n.value=value;target.append(n);}
 function labels(){const oldType=type.value||'all',oldFaction=faction.value||'all';searchLabel.textContent=t('Search assets');query.placeholder=t('Search name, faction, path or GUID');typeLabel.textContent=t('Asset type');type.replaceChildren();for(const [k,v]of Object.entries(categories))option(type,k,t(v));type.value=oldType;factionLabel.textContent=t('Asset faction');faction.replaceChildren();option(faction,'all',t('All asset factions'));for(const f of [...new Set(rows.map(r=>r.faction))].sort())option(faction,f,f==='unknown'?t('Unspecified'):f);faction.value=[...faction.options].some(o=>o.value===oldFaction)?oldFaction:'all';variantText.textContent=t('Include base templates and damaged variants');prev.textContent=t('Previous');next.textContent=t('Next');clear.textContent=t('Clear asset assignment');note.textContent=t('Types and factions are catalog hints. Native spawn availability still requires validation. Choose an asset, then Apply changes or Place new unit.');}
 function render(){const matches=filter(rows,{query:query.value,kind:type.value,faction:faction.value,variants:variants.checked});page=Math.max(0,Math.min(page,Math.ceil(matches.length/size)-1));results.replaceChildren();const start=page*size;count.textContent=matches.length+' '+t('matching assets')+(matches.length?' · '+(start+1)+'–'+Math.min(start+size,matches.length):'');
 for(const r of matches.slice(start,start+size)){const b=el('button');b.type='button';b.className='asset-result';b.dataset.assetId=r.asset.id;b.setAttribute('aria-pressed',String(r.asset.id===select.value));const title=el('strong',r.title),detail=el('span',t(categories[r.kind])+' · '+(r.faction==='unknown'?t('Unspecified'):r.faction)+(r.variant?' · '+t('Template / variant'):''));const source=el('small',r.asset.resourceReference?.path||r.asset.name);b.append(title,detail,source);b.onclick=()=>{choose(r.asset);render();sync();};results.append(b);}
 if(!matches.length)results.append(el('p',t('No assets match these filters.')));prev.disabled=page===0;next.disabled=(page+1)*size>=matches.length;
 }
 function sync(){const r=rows.find(r=>r.asset.id===select.value);summary.textContent=t('Browse assets')+' · '+(r?.title||t('No asset assigned'));summary.title=r?.asset.resourceReference?.path||'';}
 function refresh(){labels();render();sync();}
 summary.onclick=()=>{panel.hidden=!panel.hidden;summary.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden){render();query.focus();}};
 query.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>{page=0;render();},100);};type.onchange=faction.onchange=variants.onchange=()=>{clearTimeout(timer);page=0;render();};prev.onclick=()=>{page--;render();};next.onclick=()=>{page++;render();};clear.onclick=()=>{choose({id:'none',name:'No asset assigned'});sync();render();};
 globalThis.addEventListener?.('planner-preferences-changed',refresh);
 return {setUnitType(unitType){const link={infantry:'troops',armor:'armor',mechanized:'mechanized',motorized:'motorized',rotary:'rotary',fixed:'fixed',logistics:'logistics',medical:'troops',engineer:'troops',recon:'troops',special:'troops'};type.value=link[unitType]||'all';query.value='';page=0;render();},setItems(items){rows=items.filter(a=>a.id!=='none').map(a=>{if(!cache.has(a))cache.set(a,describe(a));return cache.get(a);});page=0;refresh();},sync};
}
return {describe,filter,categories,attach};
});

