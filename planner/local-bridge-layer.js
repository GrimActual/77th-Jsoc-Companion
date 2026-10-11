"use strict";
// Tile capture centers are 50 m from the tile corner in each axis.
// Provider: github.com/nickludlam/EnfusionMapMaker/blob/main/Web/reforger-map.js
// Apply only at rendering; keep network/game coordinates and saved plans unchanged.
window.PlannerLocalBridgeLayer={attach(map){
 const layer=L.layerGroup().addTo(map);
 let point=null;
 const displayPosition=p=>[p.z+50,p.x+50];
 window.addEventListener('local-bridge-state',e=>{
  layer.clearLayers();point=e.detail.point;
  if(point){
   const grid=[point.x,point.z].map(v=>String(Math.floor(v/100)).padStart(3,'0')).join('-');
   L.circleMarker(displayPosition(point),{radius:10,color:'#ff9d00',weight:3,fillOpacity:.65,interactive:false})
    .addTo(layer).bindTooltip('LIVE BRIDGE · GRID '+grid+' · alignment check',{permanent:true});
  }
 });
 window.addEventListener('local-bridge-fit',()=>{if(point)map.setView(displayPosition(point),3,{animate:false});});
 window.PlannerLocalBridgeView={count:()=>layer.getLayers().length};
}};
