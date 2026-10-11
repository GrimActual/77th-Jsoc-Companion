'use strict';
// Small SVG recorder for the presentation renderer's deliberately limited Canvas API.
// Geometry and text remain vector; terrain and uploaded logos are embedded images.
(()=>{
 const escape=value=>String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,'\uFFFD').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 window.PlannerSVGCanvas=function(){
  const canvas={width:0,height:0},parts=[],stack=[];let path='',clipId=0;
  const measure=document.createElement('canvas').getContext('2d');
  const ctx={fillStyle:'#000',strokeStyle:'#000',lineWidth:1,lineJoin:'miter',lineCap:'butt',globalAlpha:1,font:'10px Arial',textAlign:'left',dash:[]};
  const keys=Object.keys(ctx),num=v=>{if(!Number.isFinite(v))throw Error('Non-finite export coordinate');return Math.round(v*10000)/10000;};
  const attrs=()=>` opacity="${num(ctx.globalAlpha)}"`;
  const stroke=()=>` fill="none" stroke="${escape(ctx.strokeStyle)}" stroke-width="${num(ctx.lineWidth)}" stroke-linejoin="${escape(ctx.lineJoin)}" stroke-linecap="${escape(ctx.lineCap)}" stroke-dasharray="${ctx.dash.map(num).join(' ')}"${attrs()}`;
  ctx.save=()=>{stack.push({state:Object.fromEntries(keys.map(k=>[k,ctx[k]])),clipped:false});parts.push('<g>');};
  ctx.restore=()=>{const saved=stack.pop();if(!saved)throw Error('Unbalanced SVG state');if(saved.clipped)parts.push('</g>');Object.assign(ctx,saved.state);parts.push('</g>');};
  ctx.beginPath=()=>{path='';};ctx.moveTo=(x,y)=>{path+=`M${num(x)} ${num(y)} `;};ctx.lineTo=(x,y)=>{path+=`L${num(x)} ${num(y)} `;};ctx.closePath=()=>{path+='Z ';};
  ctx.rect=(x,y,w,h)=>{path+=`M${num(x)} ${num(y)}h${num(w)}v${num(h)}h${num(-w)}Z `;};
  ctx.arc=(x,y,r,start,end)=>{if(start!==0||Math.abs(end-Math.PI*2)>1e-8)throw Error('Unsupported SVG arc');path+=`M${num(x+r)} ${num(y)}a${num(r)} ${num(r)} 0 1 0 ${num(-2*r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(2*r)} 0Z `;};
  ctx.fill=()=>parts.push(`<path d="${path}" fill="${escape(ctx.fillStyle)}"${attrs()}/>`);
  ctx.stroke=()=>parts.push(`<path d="${path}"${stroke()}/>`);
  ctx.fillRect=(x,y,w,h)=>parts.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" fill="${escape(ctx.fillStyle)}"${attrs()}/>`);
  ctx.strokeRect=(x,y,w,h)=>parts.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}"${stroke()}/>`);
  ctx.clip=()=>{if(!stack.length||stack.at(-1).clipped)throw Error('Unsupported SVG clipping state');const id='map-clip-'+(++clipId);parts.push(`<defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${id})">`);stack.at(-1).clipped=true;};
  ctx.setLineDash=value=>{ctx.dash=value.slice();};
  ctx.measureText=value=>{measure.font=ctx.font;return measure.measureText(String(value));};
  ctx.fillText=(value,x,y,maxWidth)=>{const actual=ctx.measureText(value).width;const size=parseFloat(ctx.font);parts.push(`<text x="${num(x)}" y="${num(y)}" font-family="Arial, sans-serif" font-size="${num(size)}" text-anchor="${ctx.textAlign==='center'?'middle':ctx.textAlign==='right'?'end':'start'}" fill="${escape(ctx.fillStyle)}"${attrs()}${maxWidth&&actual>maxWidth?` textLength="${num(maxWidth)}" lengthAdjust="spacingAndGlyphs"`:''}>${escape(value)}</text>`);};
  ctx.drawImage=(img,x,y,w,h)=>{
   let uri=img.src;
   if(!uri?.startsWith('data:image/')){const raster=document.createElement('canvas');raster.width=img.width;raster.height=img.height;raster.getContext('2d').drawImage(img,0,0);uri=raster.toDataURL('image/png');}
   if(!/^data:image\/(?:png|jpeg|svg\+xml)[;,]/.test(uri))throw Error('Unsupported embedded image');
   parts.push(`<image x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" preserveAspectRatio="none" href="${escape(uri)}"${attrs()}/>`);
  };
  canvas.getContext=()=>ctx;canvas.toSVG=()=>{if(stack.length)throw Error('Unbalanced SVG export');return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${num(canvas.width)}" height="${num(canvas.height)}" viewBox="0 0 ${num(canvas.width)} ${num(canvas.height)}" role="img"><title>Everon tactical presentation</title>${parts.join('')}</svg>`;};return canvas;
 };
})();
