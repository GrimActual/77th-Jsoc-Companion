(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlannerSymbolLayout=api;})(globalThis,()=>{
 'use strict';
 function arrange(points,width,height,gapX=100,gapY=80){const out=[];const free=(x,y)=>!out.some(q=>Math.abs(x-q.x)<gapX&&Math.abs(y-q.y)<gapY);const cols=Math.floor(width/gapX),rows=Math.floor(height/gapY);
 for(const p of points){let x=Math.max(gapX/2,Math.min(width-gapX/2,p.x)),y=Math.max(gapY/2,Math.min(height-gapY/2,p.y));if(!free(x,y)){let best=null;for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){const xx=(c+.5)*gapX,yy=(r+.5)*gapY,d=(xx-p.x)**2+(yy-p.y)**2;if(free(xx,yy)&&(!best||d<best.d))best={x:xx,y:yy,d};}if(!best)throw Error('Too many units for a clear export. Export a smaller selection.');x=best.x;y=best.y;}out.push({...p,x,y});}return out;}
 return {arrange};
});
