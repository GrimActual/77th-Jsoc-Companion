/* Bounded session-only draft snapshots. Separate from mission and GM command undo. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompanionDraftHistory=api;})(globalThis,function(){
'use strict';
const MAX_BYTES=2*1024*1024,MAX_DRAFT_BYTES=5*1024*1024;
function create(initial,validate,options={}){
 let limit=options.limit??20;const maxBytes=options.maxBytes??MAX_BYTES;
 if(!Number.isInteger(limit)||limit<1||limit>50||!Number.isInteger(maxBytes)||maxBytes<1||maxBytes>MAX_BYTES||typeof validate!=='function')throw Error('Invalid draft history limits');
 function encode(raw){const clean=JSON.parse(JSON.stringify(raw,(key,value)=>{if(typeof value==='number'&&!Number.isFinite(value))throw Error('Draft contains an invalid number');return value;}));const text=JSON.stringify(validate(clean)),bytes=new TextEncoder().encode(text).length;if(bytes>MAX_DRAFT_BYTES)throw Error('Draft exceeds 5 MB');return {text,bytes};}
 let rows=[encode(initial)],cursor=0,total=rows[0].bytes,trimmed=0;
 function snapshot(){return JSON.parse(rows[cursor].text);}
 function trim(){while(rows.length>limit+1||total-rows[cursor].bytes>maxBytes){if(cursor>0){total-=rows.shift().bytes;cursor--;}else total-=rows.pop().bytes;trimmed++;}}
 function commit(raw){const row=encode(raw);if(row.text===rows[cursor].text)return snapshot();for(const removed of rows.splice(cursor+1))total-=removed.bytes;rows.push(row);total+=row.bytes;cursor=rows.length-1;trim();return snapshot();}
 function travel(delta){const at=cursor+delta;if(at<0||at>=rows.length)throw Error(delta<0?'No draft change to undo':'No draft change to redo');const valid=encode(JSON.parse(rows[at].text));if(valid.text!==rows[at].text)throw Error('Draft history no longer matches its validation context');cursor=at;trim();return snapshot();}
 function reset(raw){const row=encode(raw);rows=[row];cursor=0;total=row.bytes;trimmed=0;return snapshot();}
 return {commit,undo:()=>travel(-1),redo:()=>travel(1),reset,snapshot,setLimit(value){if(!Number.isInteger(value)||value<1||value>50)throw Error('Invalid draft history limit');limit=value;trim();},info:()=>({canUndo:cursor>0,canRedo:cursor<rows.length-1,undos:cursor,redos:rows.length-1-cursor,limit,historyBytes:total-rows[cursor].bytes,currentBytes:rows[cursor].bytes,trimmed})};
}
return {create,MAX_BYTES,MAX_DRAFT_BYTES};
});
