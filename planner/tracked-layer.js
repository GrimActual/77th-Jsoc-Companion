"use strict";
window.PlannerTrackedLayer={attach(map){const layer=L.layerGroup().addTo(map),markers=new Map();let pending=[],frame=null;
 function draw(){frame=null;const present=new Set();for(const p of pending){present.add(p.id);const grid=[p.x,p.z].map(v=>String(Math.floor(v/100)).padStart(3,'0')).join('-'),label='LIVE · '+p.id+' · '+grid;let old=markers.get(p.id);if(!old){const marker=L.circleMarker([p.z+50,p.x+50],{radius:7,color:'#ff9d00',weight:2,fillOpacity:.65,interactive:false}).addTo(layer).bindTooltip(label,{permanent:false,className:'live-bridge-label'});old={marker,x:p.x,z:p.z,label};markers.set(p.id,old);}else{if(old.x!==p.x||old.z!==p.z)old.marker.setLatLng([p.z+50,p.x+50]);if(old.label!==label)old.marker.setTooltipContent(label);old.x=p.x;old.z=p.z;old.label=label;}}for(const [id,old]of markers)if(!present.has(id)){layer.removeLayer(old.marker);markers.delete(id);}}
 window.addEventListener('local-bridge-state',e=>{const data=e.detail;pending=Array.isArray(data.entities)?data.entities.map(p=>({...p})):[];if(frame===null)frame=requestAnimationFrame(draw);});
 window.addEventListener('local-bridge-fit',()=>{if(pending.length)map.fitBounds(pending.map(p=>[p.z+50,p.x+50]),{padding:[30,30],maxZoom:3,animate:false});});
 window.PlannerTrackedView={count:()=>markers.size};
}};
