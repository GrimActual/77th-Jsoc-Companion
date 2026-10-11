'use strict';
function createRemote(onState=()=>{}, {fetchImpl=fetch, allowHttp=false, pollMs=2000}={}) {
  let epoch=0, timer, controller, base='', reader='', sequence=0;
  let state={status:'off',mode:'remote',token:'',point:null,received:0};
  const publish=()=>onState({...state});
  async function request(url, options={}) {
    const response=await fetchImpl(url,{...options,redirect:'error',signal:AbortSignal.timeout(5000)});
    if (!response.ok) throw Error('Relay returned HTTP '+response.status);
    return response;
  }
  function stop() {
    epoch++; clearTimeout(timer); controller?.abort();
    const oldBase=base, oldReader=reader; base='';reader='';sequence=0;
    state={status:'off',mode:'remote',token:'',point:null,received:0}; publish();
    if(oldReader) request(oldBase+'session',{method:'DELETE',headers:{Authorization:'Bearer '+oldReader}}).catch(()=>{});
    return {...state};
  }
  async function start(endpoint) {
    stop();
    let url; try {url=new URL(endpoint);} catch {throw Error('Enter the relay HTTPS address.');}
    if ((url.protocol!=='https:' && !(allowHttp && url.protocol==='http:' && url.hostname==='127.0.0.1')) || url.username || url.password || url.search || url.hash || url.pathname!=='/') throw Error('Use an HTTPS relay root address without a path or credentials.');
    const generation=epoch; base=url.href;
    state={...state,status:'starting',endpoint:base};publish();
    let session;
    try {
      session=await (await request(base+'sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).json();
      if(!/^[a-f0-9]{32}$/.test(session.token)||!/^[a-f0-9]{64}$/.test(session.reader))throw Error('Invalid relay response');
    } catch(e) {if(generation===epoch){stop();}throw e;}
    if(generation!==epoch){request(url.href+'session',{method:'DELETE',headers:{Authorization:'Bearer '+session.reader}}).catch(()=>{});return {...state};}
    reader=session.reader;state={...state,status:'waiting',token:session.token};publish();
    async function poll() {
      if(generation!==epoch)return;
      controller=new AbortController();
      try {
        const res=await fetchImpl(base+'session',{headers:{Authorization:'Bearer '+reader},redirect:'error',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(5000)])});
        if(generation!==epoch)return;
        if(res.status===401){stop();return;}
        if(!res.ok)throw Error('Relay unavailable');
        const data=await res.json();
        if(generation!==epoch)return;
        if(!Number.isSafeInteger(data.sequence)||data.sequence<0|| (data.point!==null && (!Number.isFinite(data.point?.x)||!Number.isFinite(data.point?.z)||Math.abs(data.point.x)>13500||Math.abs(data.point.z)>13500)))throw Error('Invalid relay marker');
        sequence=data.sequence;
        state={...state,status:data.point?'connected':sequence?'stale':'waiting',point:data.point,received:sequence};publish();
      } catch {if(generation===epoch){state={...state,status:'reconnecting',point:null};publish();}}
      if(generation===epoch)timer=setTimeout(poll,pollMs);
    }
    timer=setTimeout(poll,0);return {...state};
  }
  return {start,stop,status:()=>({...state})};
}
module.exports={createRemote};
