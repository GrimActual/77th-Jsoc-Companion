"use strict";
// Tile capture centers are 50 m from the tile corner in each axis.
// Provider: github.com/nickludlam/EnfusionMapMaker/blob/main/Web/reforger-map.js
// Apply only at rendering; keep network/game coordinates and saved plans unchanged.
window.PlannerLocalBridgeLayer={attach(map){
 const layer=L.layerGroup().addTo(map);
 let point=null,marker=null,lastGrid='';
 const displayPosition=p=>[p.z+50,p.x+50];
 window.addEventListener('local-bridge-state',e=>{
  const previous=point;point=e.detail.point;
  if(!point){if(marker)layer.clearLayers();marker=null;lastGrid='';return;}
  if(point){
   const grid=[point.x,point.z].map(v=>String(Math.floor(v/100)).padStart(3,'0')).join('-');
   if(!marker){
    marker=L.circleMarker(displayPosition(point),{radius:10,color:'#ff9d00',weight:3,fillOpacity:.65,interactive:false})
     .addTo(layer).bindTooltip('LIVE · '+grid,{permanent:true,className:'live-bridge-label'});
   }else{
    if(!previous||previous.x!==point.x||previous.z!==point.z)marker.setLatLng(displayPosition(point));
    if(lastGrid!==grid)marker.setTooltipContent('LIVE · '+grid);
   }
   lastGrid=grid;
  }
 });
 window.addEventListener('local-bridge-fit',()=>{if(point)map.setView(displayPosition(point),3,{animate:false});});
 window.PlannerLocalBridgeView={count:()=>layer.getLayers().length};
}};
