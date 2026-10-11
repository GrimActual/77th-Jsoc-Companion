'use strict';
(()=>{
 const $=id=>document.getElementById(id),C=window.PlannerCore,K=window.AssetTools;
 const dialog=$('presentationDialog');let busy=false,cached=null,previewURL=null,brandLogo=null,logoLoading=false,logoRequest=0;const M=window.PlannerExportModel;
 $('presentationOpen').onclick=()=>{if(!window.EveronPlanner)return;const pref=PlannerPreferences.get();$('presentationFormat').value=pref.exportFormat;$('presentationResolution').value=pref.exportWidth;$('presentationQuality').value=pref.exportQuality;$('presentationBackground').checked=pref.exportBackground;$('presentationTitle').checked=pref.exportTitle;$('presentationGrid').checked=EveronPlanner.snapshot().view.layers.grid;$('presentationStatus').textContent='';dialog.showModal()};
 $('presentationClose').onclick=()=>{if(!busy&&!logoLoading)dialog.close()};dialog.addEventListener('cancel',e=>{if(busy||logoLoading)e.preventDefault()});
 function loadImage(src,cors=false){return new Promise((resolve,reject)=>{const img=new Image();if(cors)img.crossOrigin='anonymous';const timer=setTimeout(()=>{img.src='';reject(Error('Image timed out'))},15000);img.onload=()=>{clearTimeout(timer);resolve(img)};img.onerror=()=>{clearTimeout(timer);reject(Error('Image could not be loaded'))};img.src=src})}
 async function terrainTile(coord){const zoom=5-coord.z,parts=2**zoom;const fallback=async()=>{const base={x:Math.floor(coord.x/parts),y:Math.floor(coord.y/parts)};const image=await loadImage(window.presentationDesktop?await presentationDesktop.offlineBase(base):'terrain/everon/'+base.x+'-'+base.y+'.jpg');const c=document.createElement('canvas');c.width=c.height=256;c.getContext('2d').drawImage(image,(coord.x%parts)*image.width/parts,(coord.y%parts)*image.height/parts,image.width/parts,image.height/parts,0,0,256,256);return c};if(PlannerPreferences.get().offlineTerrain||!navigator.onLine)return fallback();try{const src=window.presentationDesktop?await presentationDesktop.tile(coord):`https://reforger.recoil.org/map-tiles/everon/${coord.z}/${coord.x}/${coord.y}/tile.jpg`;return await loadImage(src,!window.presentationDesktop)}catch{return fallback()}}
 function bytes(s){return new TextEncoder().encode(s)}
 function join(parts){const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length}return out}
 // Single-page PDF containing one JPEG XObject. Byte offsets refer to the encoded stream.
 function pdf(jpeg,width,height){const {pageW,pageH,w,h}=M.pdfLayout(width,height);const cmd=`q ${w} 0 0 ${h} ${(pageW-w)/2} ${(pageH-h)/2} cm /Im0 Do Q\n`;const objects=[bytes('<< /Type /Catalog /Pages 2 0 R >>'),bytes('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),bytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`),join([bytes(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),jpeg,bytes('\nendstream')]),bytes(`<< /Length ${bytes(cmd).length} >>\nstream\n${cmd}endstream`)];const parts=[bytes('%PDF-1.4\n')],offsets=[0];let offset=parts[0].length;objects.forEach((obj,i)=>{offsets.push(offset);const p=join([bytes(`${i+1} 0 obj\n`),obj,bytes('\nendobj\n')]);parts.push(p);offset+=p.length});parts.push(bytes(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`));return new Blob(parts,{type:'application/pdf'})}
 const blob=(canvas,type,quality)=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Image encoding failed')),type,quality));
 function context(){return {plan:C.validate(EveronPlanner.snapshot()),view:EveronPlanner.viewport(),selected:EveronPlanner.selected(),locale:PlannerPreferences.get().locale,language:PlannerPreferences.get().language,offlineTerrain:PlannerPreferences.get().offlineTerrain};}
 async function render(settings,source){const {plan}=source,tr=value=>PlannerI18n.t(value,source.language);const {units,routes,areas,bounds}=M.scene(plan,source.view,source.selected,settings.scope);
 const width=settings.width,mapHeight=Math.round(width*(bounds.north-bounds.south)/(bounds.east-bounds.west));if(mapHeight>6000)throw Error('Current view is too tall. Widen the app window or choose full canvas.');const scale=width/(settings.format==='pdf'?1000:1600),header=settings.title?90*scale:0,footer=(settings.title?(settings.format==='pdf'?160:116):settings.background?26:0)*scale;const canvas=settings.format==='svg'?PlannerSVGCanvas():document.createElement('canvas');canvas.width=width;canvas.height=Math.ceil(header+mapHeight+footer);const ctx=canvas.getContext('2d');if(!['png','svg'].includes(settings.format)||settings.background){ctx.fillStyle='#fff';ctx.fillRect(0,0,width,canvas.height)}
 const meter=width/(bounds.east-bounds.west),xy=p=>[(p.lng-bounds.west)*meter,header+(bounds.north-p.lat)*meter];
 const text=(value,x,y,size=16,color='#17241e',max=width-40*scale)=>{ctx.font=`${size*scale}px Arial`;ctx.fillStyle=color;ctx.fillText(String(value),x,y,max)};
 ctx.save();ctx.beginPath();ctx.rect(0,header,width,mapHeight);ctx.clip();
 if(settings.background){ctx.fillStyle='#26352e';ctx.fillRect(0,header,width,mapHeight);$('presentationStatus').textContent='Loading terrain for export…';const zoom=Math.max(0,Math.min(5,Math.ceil(Math.log2(meter*12.501)))),worldScale=2**zoom/12.501;const minX=Math.floor(bounds.west*worldScale/256),maxX=Math.floor(bounds.east*worldScale/256),minY=Math.floor(-bounds.north*worldScale/256),maxY=Math.floor(-bounds.south*worldScale/256);const tasks=[];for(let x=minX;x<=maxX;x++)for(let y=minY;y<=maxY;y++){const tileCount=2**(zoom+2);if(x>=0&&x<tileCount&&y<0&&y>=-tileCount)tasks.push({x,y});}let cursor=0,failed=0,lastError="";await Promise.all(Array.from({length:6},async()=>{while(cursor<tasks.length){const {x,y}=tasks[cursor++];try{const coord={z:5-zoom,x,y:-(y+1)};const img=await terrainTile(coord);const left=(x*256/worldScale-bounds.west)*meter,top=header+(bounds.north+y*256/worldScale)*meter,size=256/worldScale*meter;ctx.drawImage(img,left,top,size+.5,size+.5)}catch(e){failed++;lastError=e.message}}}));if(failed)throw Error(`${failed} terrain tiles could not load. Retry online, or turn off Include terrain background. No incomplete file was exported. ${lastError}`);}
 if(settings.grid){const step=(bounds.east-bounds.west)<3500?100:1000;ctx.lineWidth=scale;ctx.strokeStyle=settings.background?'#ffffff88':'#40574c55';for(let x=Math.ceil(bounds.west/step)*step;x<=bounds.east;x+=step){const px=xy({lng:x,lat:0})[0];ctx.beginPath();ctx.moveTo(px,header);ctx.lineTo(px,header+mapHeight);ctx.stroke();text('E '+C.grid({lng:x,lat:0},plan.view.gridDigits).split('-')[0],px+3*scale,header+18*scale,11,settings.background?'#fff':'#34463b')}for(let y=Math.ceil(bounds.south/step)*step;y<=bounds.north;y+=step){const py=xy({lng:0,lat:y})[1];ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(width,py);ctx.stroke();text('N '+C.grid({lat:y,lng:0},plan.view.gridDigits).split('-')[1],4*scale,py-3*scale,11,settings.background?'#fff':'#34463b')}}
 function draw(d,isArea){ctx.save();const st=d.style;ctx.strokeStyle=st.color;ctx.fillStyle=st.color;ctx.lineWidth=st.width*scale;ctx.lineJoin='round';ctx.lineCap='round';ctx.setLineDash(st.pattern==='dashed'?[10*scale,8*scale]:st.pattern==='dotted'?[scale,9*scale]:[]);ctx.beginPath();let points=d.points?.map(xy);if(d.kind==='circle'){const [x,y]=xy(d.center);ctx.arc(x,y,d.radius*meter,0,Math.PI*2)}else if(d.kind==='rectangle'){const a=points[0],b=points[1];ctx.rect(Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]))}else{points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(isArea)ctx.closePath()}if(isArea){ctx.globalAlpha=st.opacity;ctx.fill();ctx.globalAlpha=1}ctx.stroke();if(st.pattern==='arrow'&&!isArea){ctx.setLineDash([]);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],angle=Math.atan2(b[1]-a[1],b[0]-a[0]),size=Math.min(22*scale,Math.hypot(b[0]-a[0],b[1]-a[1])*.45);ctx.beginPath();ctx.moveTo(b[0]-Math.cos(angle-.5)*size,b[1]-Math.sin(angle-.5)*size);ctx.lineTo(...b);ctx.lineTo(b[0]-Math.cos(angle+.5)*size,b[1]-Math.sin(angle+.5)*size);ctx.stroke()}}ctx.restore()}
 areas.forEach(a=>draw(a,true));routes.forEach(r=>draw(r,false));
 const onMap=units.map(u=>{const [x,y]=xy(u.position);return {id:u.id,x,y:y-header};}).filter(p=>p.x>=0&&p.x<=width&&p.y>=0&&p.y<=mapHeight);
 const placements=new Map((settings.spread?PlannerSymbolLayout.arrange(onMap,width,mapHeight,100*scale*settings.symbolScale,80*scale*settings.symbolScale):[]).map(p=>[p.id,p]));
 const markerScale=scale*settings.symbolScale;{const scale=markerScale;for(const u of units){const actual=xy(u.position),placed=placements.get(u.id);const [x,y]=placed?[placed.x,placed.y+header]:actual;
 if(placed){ctx.save();ctx.strokeStyle='#34463b';ctx.lineWidth=scale;ctx.beginPath();ctx.moveTo(...actual);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#34463b';ctx.fillRect(actual[0]-2*scale,actual[1]-2*scale,4*scale,4*scale);ctx.restore();}if(x<-80*scale||x>width+80*scale||y<header-80*scale||y>header+mapHeight+80*scale)continue;const color=C.markerColor(u);let w=44*scale,h=42*scale,anchor=[w/2,h/2];if(u.symbolMode==='nato'){const symbol=new ms.Symbol(C.sidc(u.unitType,u.side),{size:30*scale,fillColor:color,outlineWidth:2,outlineColor:'#FFFFFF',infoFields:false}),size=symbol.getSize(),a=symbol.getAnchor();w=size.width;h=size.height;anchor=[a.x,a.y];const img=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(symbol.asSVG()));ctx.drawImage(img,x-anchor[0],y-anchor[1],w,h)}else{ctx.fillStyle=color;ctx.strokeStyle='#202e29';ctx.lineWidth=2*scale;ctx.fillRect(x-w/2,y-h/2,w,h);ctx.strokeRect(x-w/2,y-h/2,w,h);if(u.symbolMode==='text'||K.markerKind(u)==='symbol'){ctx.textAlign='center';text(u.symbol,x,y+5*scale,14,'#101714',w-4*scale);ctx.textAlign='left'}else{const svg=K.svg(K.markerKind(u)).replace('<svg ','<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg" ').replaceAll('currentColor','#101714');const img=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));ctx.drawImage(img,x-17*scale,y-17*scale,34*scale,34*scale)}}if(plan.view.layers.labels){const label=u.name||u.type;ctx.font=`14px Arial`;const labelW=Math.min(ctx.measureText(label).width*scale+12*scale,(settings.spread?86:220)*scale);ctx.fillStyle='#fff';ctx.fillRect(x-labelW/2,y+h-anchor[1]+3*scale,labelW,21*scale);ctx.textAlign='center';text(label,x,y+h-anchor[1]+19*scale,14,'#17241e',labelW-8*scale);ctx.textAlign='left'}}
 }
 if(settings.brand.watermark){ctx.save();ctx.globalAlpha=settings.brand.opacity;ctx.textAlign='center';text(settings.brand.watermark,width/2,header+mapHeight/2,56,'#ffffff',width-80*scale);text(settings.brand.watermark,width/2,header+mapHeight/2-2*scale,56,'#17241e',width-80*scale);ctx.restore();}
 if(settings.brand.stamp){ctx.save();const stampWidth=Math.min(width-24*scale,400*scale);ctx.fillStyle='#fff';ctx.globalAlpha=.9;ctx.fillRect((width-stampWidth)/2,header+12*scale,stampWidth,30*scale);ctx.globalAlpha=1;ctx.textAlign='center';text(tr(settings.brand.stamp),width/2,header+33*scale,18,'#8a201c',stampWidth-12*scale);ctx.restore();}
 ctx.restore();
 if(settings.title){ctx.fillStyle='#fff';ctx.fillRect(0,0,width,header);ctx.fillRect(0,header+mapHeight,width,footer);const left=settings.brand.logo?104*scale:24*scale;const titleWidth=width-left-24*scale;text(settings.brand.title||plan.operation.name||'EVERON ORBAT',left,37*scale,28,'#17241e',titleWidth);text(`${settings.brand.community||plan.operation.taskForce} · ${tr(settings.scope==='selected'?'Selected objects':settings.scope==='full'?'Full Everon canvas':'Current view')} · ${settings.brand.date||source.date}`,left,66*scale,14,'#17241e',titleWidth);if(settings.brand.logo){const img=await loadImage(settings.brand.logo);const factor=Math.min(64*scale/img.width,64*scale/img.height);ctx.drawImage(img,24*scale+(64*scale-img.width*factor)/2,12*scale+(64*scale-img.height*factor)/2,img.width*factor,img.height*factor);}const bottom=header+mapHeight;const visiblePhases=[...(plan.view.hiddenPhases.includes('shared')?[]:[tr('Shared')]),...plan.phases.filter(p=>!plan.view.hiddenPhases.includes(p.id)).map(p=>p.name)];text(tr('Phases')+': '+visiblePhases.join(' / '),24*scale,bottom+24*scale,13);const entries=[...new Map(units.map(u=>[u.side+C.markerColor(u),{color:C.markerColor(u),name:C.SIDES[u.side]}])).values()];entries.slice(0,8).forEach((item,i)=>{const columns=settings.format==='pdf'?2:4,col=i%columns,row=Math.floor(i/columns),x=24*scale+col*width/columns,y=bottom+(43+row*22)*scale;ctx.fillStyle=item.color;ctx.fillRect(x,y,12*scale,12*scale);ctx.strokeStyle='#52665a';ctx.lineWidth=scale;ctx.strokeRect(x,y,12*scale,12*scale);text(tr(item.name),x+19*scale,y+11*scale,12,'#17241e',width/columns-50*scale)});text(`${units.length} ${tr('units')} · ${routes.length} ${tr('routes')} · ${areas.length} ${tr('areas')}${entries.length>8?' · '+tr('additional custom colors shown on map'):''} · N ↑ · ${tr('Everon local grid')}`,24*scale,bottom+(settings.format==='pdf'?144:100)*scale,12);}
 if(settings.background)text(tr('Map tiles')+' © Reforger Maps / Bewilderbeest',width-350*scale,canvas.height-7*scale,10,'#37483e',340*scale);
 return canvas;
 }
 function invalidate(message=false){
  cached=null;if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}
  $('presentationPreviewImageElement').removeAttribute('src');$('presentationPreviewFrame').hidden=true;
  if(message)$('presentationStatus').textContent='Preview out of date. Preview again or create a new export.';
 }
 dialog.addEventListener('close',()=>invalidate());
 $('presentationForm').addEventListener('change',()=>invalidate(true));
 $('presentationForm').addEventListener('input',()=>invalidate(true));
 // Community defaults stay outside plan JSON. Titles and dates are never persisted.
 $('brandLogo').addEventListener('change',async()=>{
  const file=$('brandLogo').files[0],request=++logoRequest;brandLogo=null;invalidate(true);
  if(!file){clearLogo();return;}
  logoLoading=true;const buttons=[$('presentationPreview'),$('presentationCreate'),$('brandSave')];buttons.forEach(b=>b.disabled=true);
  try{
   if(!['image/png','image/jpeg'].includes(file.type)||file.size>2*1024*1024)throw Error('Choose a PNG or JPEG no larger than 2 MB.');
   const url=URL.createObjectURL(file);let img;try{img=await loadImage(url);}finally{URL.revokeObjectURL(url);}
   if(img.width>4096||img.height>4096||!img.width||!img.height)throw Error('Logo dimensions must be between 1 and 4096 pixels.');
   const c=document.createElement('canvas'),factor=Math.min(1,512/Math.max(img.width,img.height));c.width=Math.max(1,Math.round(img.width*factor));c.height=Math.max(1,Math.round(img.height*factor));c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   if(request===logoRequest){brandLogo=c.toDataURL('image/png');$('brandLogoStatus').textContent='Logo ready';}
  }catch(err){if(request===logoRequest){$('brandLogo').value='';$('brandLogoStatus').textContent=err.message;}}
  finally{if(request===logoRequest){logoLoading=false;buttons.forEach(b=>b.disabled=false);}}
 });
 function clearLogo(){logoRequest++;logoLoading=false;brandLogo=null;$('brandLogo').value='';$('brandLogoStatus').textContent='No custom logo';$('presentationPreview').disabled=false;$('presentationCreate').disabled=false;$('brandSave').disabled=false;invalidate(true);}
 $('brandLogoClear').onclick=clearLogo;
 $('brandReset').onclick=()=>{for(const id of ['brandTitle','brandCommunity','brandDate','brandWatermark','brandStamp'])$(id).value='';$('brandOpacity').value='0.2';clearLogo();};
 function readSettings(){return {format:$('presentationFormat').value,scope:$('presentationScope').value,background:$('presentationBackground').checked,grid:$('presentationGrid').checked,title:$('presentationTitle').checked,width:Number($('presentationResolution').value),symbolScale:Number(PlannerPreferences.get().exportSymbolScale),spread:$('presentationSpread').checked,quality:Number($('presentationQuality').value),brand:{title:$('brandTitle').value.trim(),community:$('brandCommunity').value.trim(),date:$('brandDate').value,logo:brandLogo,watermark:$('brandWatermark').value.trim(),opacity:Number($('brandOpacity').value),stamp:$('brandStamp').value}};}
 async function prepare(){
  const settings=readSettings(),source=context(),key=JSON.stringify({settings,source});
  if(cached?.key===key)return cached;invalidate();source.date=PlannerPreferences.date();
  $('presentationStatus').textContent='Rendering presentation…';const canvas=await render(settings,source);let file,preview;
  if(settings.format==='svg'){file=new Blob([canvas.toSVG()],{type:'image/svg+xml;charset=utf-8'});preview=file;}else if(settings.format==='pdf'){
   const jpg=await blob(canvas,'image/jpeg',settings.quality);file=pdf(new Uint8Array(await jpg.arrayBuffer()),canvas.width,canvas.height);
   // Preview the actual JPEG embedded in the PDF, positioned using the same A4 layout.
   const layout=M.pdfLayout(canvas.width,canvas.height),page=document.createElement('canvas'),factor=1200/layout.pageW;
   page.width=1200;page.height=Math.round(layout.pageH*factor);const ctx=page.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,page.width,page.height);
   const url=URL.createObjectURL(jpg);try{const img=await loadImage(url);ctx.drawImage(img,layout.x*factor,layout.y*factor,layout.w*factor,layout.h*factor);}finally{URL.revokeObjectURL(url);}
   preview=await blob(page,'image/png');
  }else{file=await blob(canvas,'image/'+settings.format,settings.quality);preview=file;}
  const scene=M.scene(source.plan,source.view,source.selected,settings.scope);
  cached={key,file,preview,settings,name:settings.brand.title||source.plan.operation.name||'everon-orbat',width:canvas.width,height:canvas.height,units:scene.units.length,routes:scene.routes.length,areas:scene.areas.length};return cached;
 }
 function showPreview(result){
  if(previewURL)URL.revokeObjectURL(previewURL);previewURL=URL.createObjectURL(result.preview);
  $('presentationPreviewImageElement').src=previewURL;$('presentationPreviewFrame').hidden=false;
  $('presentationPreviewCaption').textContent=result.settings.format.toUpperCase()+' · '+result.width+' × '+result.height+' px · '+result.units+' '+PlannerI18n.t('units')+' · '+result.routes+' '+PlannerI18n.t('routes')+' · '+result.areas+' '+PlannerI18n.t('areas')+(result.settings.format==='pdf'?' · '+PlannerI18n.t('A4 page preview'):'');
 }
 async function run(download){
  if(busy||logoLoading)return;busy=true;const controls=[...$('presentationForm').querySelectorAll('input,select,button')];controls.forEach(el=>el.disabled=true);
  try{
   const result=await prepare();showPreview(result);
   if(download){
    const a=document.createElement('a');a.download=result.name.replace(/[^a-z0-9_-]/gi,'_')+'-'+result.settings.scope+'-'+Date.now()+'.'+(result.settings.format==='jpeg'?'jpg':result.settings.format);const url=URL.createObjectURL(result.file);a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('presentationStatus').textContent='Export created. Check your downloads. JSON project and map view are unchanged.';
   }else $('presentationStatus').textContent='Preview ready. Create export downloads this result. No file has been downloaded yet.';
  }catch(err){invalidate();$('presentationStatus').textContent='Export failed: '+err.message;}
  finally{busy=false;controls.forEach(el=>el.disabled=false);}
 }
 $('brandSave').onclick=()=>{
  if(busy||logoLoading)return;
  try{PlannerBrandingProfile.save(localStorage,readSettings().brand);$('brandProfileStatus').textContent='Community defaults saved on this device. Operation title and date were not saved.';}
  catch{$('brandProfileStatus').textContent='Could not save community defaults. Your current export still works; check available storage.';}
 };
 $('brandForget').onclick=()=>{
  try{PlannerBrandingProfile.forget(localStorage);$('brandProfileStatus').textContent='Saved community defaults removed. Current export settings are unchanged.';}
  catch{$('brandProfileStatus').textContent='Could not remove saved community defaults. Try again.';}
 };
 async function restoreCommunity(){
  const controls=[...$('presentationBranding').querySelectorAll('input,select,button')],buttons=[$('presentationPreview'),$('presentationCreate')];
  try{
   const saved=PlannerBrandingProfile.load(localStorage);if(!saved)return;
   logoLoading=true;controls.concat(buttons).forEach(el=>el.disabled=true);
   if(saved.logo){const img=await loadImage(saved.logo);if(img.width>512||img.height>512||!img.width||!img.height)throw Error('Invalid saved logo');}
   $('brandCommunity').value=saved.community;$('brandWatermark').value=saved.watermark;$('brandOpacity').value=String(saved.opacity);$('brandStamp').value=saved.stamp;brandLogo=saved.logo;
   $('brandLogoStatus').textContent=brandLogo?'Logo ready':'No custom logo';$('brandProfileStatus').textContent='Saved community defaults loaded. Operation title and date use this session.';
  }catch{$('brandProfileStatus').textContent='Saved community defaults could not be loaded. Current project is unchanged. Save new defaults or forget the saved defaults.';}
  finally{logoLoading=false;controls.concat(buttons).forEach(el=>el.disabled=false);}
 }
 restoreCommunity();
 window.addEventListener('planner-preferences-changed',()=>invalidate());
 $('presentationPreview').onclick=()=>run(false);
 $('presentationForm').onsubmit=e=>{e.preventDefault();run(true);};
})();
