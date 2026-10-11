/* Fixed SVG artwork and conservative asset classification. No catalog entries are added here. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AssetTools=api})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const kinds={
 helicopter:'Helicopter',infantry:'Infantry / foot soldiers',lightVehicle:'Light vehicle / Humvee',
 apc:'APC / IFV',tank:'Tank',truck:'Truck / logistics',aircraft:'Fixed-wing aircraft',
 boat:'Boat',mixed:'Mixed mod pack',other:'Unclassified asset',symbol:'Military symbol'
};
const art={
 helicopter:'<path d="M5 5h26M18 5v6M12 12h10c5 0 7 4 7 7H11l-5-4H3v-4h4l5 1ZM22 12v7M13 23h17M16 19v4m10-4v4M3 7v10"/>',
 infantry:'<circle cx="18" cy="6" r="3"/><path d="M13 12h10l-1 9h-7l-2-9ZM14 14l-6 6m15-6 5 6M16 21l-4 9m9-9 3 9M25 10v14" />',
 lightVehicle:'<path d="M4 16h3l4-7h14l5 7h2v9H4v-9ZM10 16h16M17 9v7M5 20h4m18 0h4"/><circle cx="10" cy="25" r="3"/><circle cx="26" cy="25" r="3"/>',
 apc:'<path d="M3 18l5-5h20l5 5v8H3v-8ZM13 13V9h10v4M23 10h10M7 18h22M6 22h24"/><circle cx="9" cy="26" r="3"/><circle cx="18" cy="26" r="3"/><circle cx="27" cy="26" r="3"/>',
 tank:'<path d="M5 18h26l2 4v6H3v-6l2-4ZM11 17l2-8h11l3 8M24 11h10M7 23h22"/><circle cx="9" cy="27" r="2"/><circle cx="18" cy="27" r="2"/><circle cx="27" cy="27" r="2"/>',
 truck:'<path d="M3 8h19v17H3V8ZM22 14h7l4 6v5H22M25 15v6h7"/><circle cx="9" cy="26" r="3"/><circle cx="27" cy="26" r="3"/>',
 aircraft:'<path d="m18 3 3 11 12 7v3l-12-4-1 8 5 3H11l5-3-1-8-12 4v-3l12-7 3-11Z"/>',
 boat:'<path d="M3 20h30l-6 8H9l-6-8ZM10 20V11h12l6 9M16 11V4m0 1h8M3 31q4-4 8 0 4-4 8 0 4-4 8 0 4-4 6 0"/>',
 mixed:'<rect x="4" y="4" width="11" height="11" rx="2"/><rect x="21" y="4" width="11" height="11" rx="2"/><rect x="4" y="21" width="11" height="11" rx="2"/><rect x="21" y="21" width="11" height="11" rx="2"/>',
 other:'<path d="m18 3 14 15-14 15L4 18 14-15Z"/><path d="M15 13a3 3 0 0 1 6 0c0 3-3 3-3 6m0 5v1"/>'
};
function explicit(value){
 if(typeof value!=='string')return null;
 if(Object.hasOwn(kinds,value))return value;
 const v=value.toLowerCase().replace(/[_-]/g,' ').trim();
 const aliases={'helicopters':'helicopter','rotary wing':'helicopter','foot soldiers':'infantry','foot soldier':'infantry','soldier':'infantry','soldiers':'infantry','humvee':'lightVehicle','hmmwv':'lightVehicle','light vehicle':'lightVehicle','light vehicles':'lightVehicle','ifv':'apc','apc / ifv':'apc','apc/ifv':'apc','armored personnel carrier':'apc','armoured personnel carrier':'apc','infantry fighting vehicle':'apc','tanks':'tank','trucks':'truck','fixed wing':'aircraft','fixed wing aircraft':'aircraft','boats':'boat','mixed mod pack':'mixed','other':'other','unclassified':'other','military symbol':'symbol'};
 if(Object.hasOwn(aliases,v))return aliases[v];
 return Object.keys(kinds).find(k=>k.toLowerCase()===v)||null;
}
const patterns=[
 ['helicopter',/\b(helicopters?|black[\s-]?hawks?|uh[\s-]?60|uh[\s-]?1h?|ah[\s-]?64|mi[\s-]?8|chinook)\b/i],
 ['apc',/\b(bradley|apc|ifv|stryker|m113|bmp[\s-]?[123])\b/i],
 ['tank',/\b(tanks?|abrams|m1a[12]|t[\s-]?(72|80|90)|leopard)\b/i],
 ['lightVehicle',/\b(humvees?|hmmwv|m1025|m998|m151|jltv|light vehicles?)\b/i],
 ['infantry',/\b(infantry|foot soldiers?|soldiers?|rifleman|riflemen|squad leader|medic)\b/i],
 ['truck',/\b(trucks?|m923|m939|logistics truck)\b/i],
 ['aircraft',/\b(airplanes?|aeroplanes?|fixed[\s-]wing|jets?|a[\s-]?10|c[\s-]?130)\b/i],
 ['boat',/\b(boats?|rhib|rh ib|watercraft)\b/i]
];
function classify(asset){
 const a=asset||{};
 for(const v of [a.assetKind,a.vehicleType,a.icon]){
  const k=explicit(v);if(k&&k!=='symbol')return {kind:k,label:kinds[k],source:'catalog'};
 }
 for(const v of [a.category,a.type]){
  const k=explicit(v);if(k&&k!=='other'&&k!=='symbol')return {kind:k,label:kinds[k],source:'catalog'};
 }
 const name=String(a.name||'').replace(/[_–—]/g,'-');
 const found=patterns.filter(([,rx])=>rx.test(name)).map(([k])=>k);
 const kind=found.length===1?found[0]:found.length>1?'mixed':'other';
 return {kind,label:kinds[kind],source:found.length?'name':'unknown'};
}
function markerKind(unit){
 const override=explicit(unit.icon);
 if(override)return override;
 if(!unit.asset||unit.asset==='none'){
  const k=explicit(unit.type);return k||'symbol';
 }
 const embedded=unit.assetCatalogItem||{};
 return classify({...embedded,name:embedded.name||unit.assetName||unit.asset}).kind;
}
function svg(kind){
 const key=Object.hasOwn(art,kind)?kind:'other';
 return '<svg class="asset-icon" data-asset-icon="'+key+'" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+art[key]+'</svg>';
}
return {kinds,explicit,classify,markerKind,svg};
});
