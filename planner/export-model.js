/* Pure export scope and bounds. No project mutation or renderer dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlannerExportModel=api;})(globalThis,()=>{
 'use strict';
 function scene(plan,view,selected,scope){
  if(!['current','full','selected'].includes(scope))throw Error('Unknown export scope.');
  const visible=o=>!plan.view.hiddenPhases.includes(o.phaseId||'shared');
  const selectedKeys=new Set(selected.map(p=>p.kind+':'+String(p.id)));
  const keep=kind=>o=>visible(o)&&(scope!=='selected'||selectedKeys.has(kind+':'+String(o.id)));
  const units=plan.view.layers.units?plan.orderOfBattle.filter(keep('unit')):[];
  const routes=plan.view.layers.routes?plan.routes.filter(keep('route')):[];
  const areas=plan.view.layers.areas?plan.areas.filter(keep('area')):[];
  let bounds={west:view.west,east:view.east,south:view.south,north:view.north};
  if(scope==='full')bounds={west:-500,east:13500,south:-500,north:13500};
  if(scope==='selected'){
   if(!units.length&&!routes.length&&!areas.length)throw Error('Select at least one visible unit, route or area before exporting selected objects.');
   bounds={west:Infinity,east:-Infinity,south:Infinity,north:-Infinity};
   const add=p=>{bounds.west=Math.min(bounds.west,p.lng);bounds.east=Math.max(bounds.east,p.lng);bounds.south=Math.min(bounds.south,p.lat);bounds.north=Math.max(bounds.north,p.lat);};
   units.forEach(u=>add(u.position));routes.forEach(r=>r.points.forEach(add));
   areas.forEach(a=>{if(a.kind==='circle'){add({lng:a.center.lng-a.radius,lat:a.center.lat-a.radius});add({lng:a.center.lng+a.radius,lat:a.center.lat+a.radius});}else a.points.forEach(add);});
   const pad=Math.max(400,Math.max(bounds.east-bounds.west,bounds.north-bounds.south)*.15);
   bounds={west:bounds.west-pad,east:bounds.east+pad,south:bounds.south-pad,north:bounds.north+pad};
  }
  if(!Object.values(bounds).every(Number.isFinite)||bounds.east<=bounds.west||bounds.north<=bounds.south)throw Error('Invalid export bounds.');
  if(scope!=='current'){
   const e=(bounds.east+bounds.west)/2,n=(bounds.north+bounds.south)/2;let w=bounds.east-bounds.west,h=bounds.north-bounds.south;
   if(w/h<.6)w=h*.6;if(w/h>2)h=w/2;
   bounds={west:e-w/2,east:e+w/2,south:n-h/2,north:n+h/2};
  }
  return {units,routes,areas,bounds};
 }
 function pdfLayout(width,height){const pageW=width>=height?841.89:595.28,pageH=width>=height?595.28:841.89,margin=24,scale=Math.min((pageW-margin*2)/width,(pageH-margin*2)/height),w=width*scale,h=height*scale;return {pageW,pageH,w,h,x:(pageW-w)/2,y:(pageH-h)/2};}
 return {scene,pdfLayout};
});
