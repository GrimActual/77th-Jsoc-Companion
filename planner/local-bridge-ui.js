"use strict";
(()=>{
 const api=window.plannerLocalBridge,nav=document.getElementById('settingsNav'),content=document.getElementById('settingsContent');if(!nav)return;
 const button=document.createElement('button');button.id='localBridgeSettings';button.innerHTML='<strong>Live bridge</strong><small>Connect your game to the planner</small>';nav.append(button);
 const section=document.createElement('section');section.id='liveBridgePanel';section.hidden=true;
 section.innerHTML=`<h3>Live bridge</h3><p>Connect your host-controlled character from Reforger, including GeForce NOW. No hosting account or card is needed.</p>
 <button id="freeBridgeStart" type="button">Start free connection</button> <button id="localBridgeStop" type="button">Stop connection</button>
 <p id="localBridgeStatus" role="status" aria-live="polite">Off</p>
 <label><span id="bridgeAddressLabel">1. Address — paste into the GAME’s first field</span><input id="bridgeAddress" readonly autocomplete="off" spellcheck="false"></label><button id="bridgeCopyAddress" type="button">Copy address</button>
 <label><span id="bridgeCodeLabel">2. Pairing code — paste into the GAME’s second field</span><input id="localBridgeToken" readonly autocomplete="off" spellcheck="false"></label><button id="bridgeCopyCode" type="button">Copy pairing code</button>
 <p id="bridgeCopyStatus" role="status"></p>
 <p id="bridgeInstructions">In Reforger, press Escape → ORBAT PLANNER – HOST PAIRING. Paste the address and code, click CONNECT, resume, and control a soldier. Keep this planner and your PC running.</p>
 <p id="localBridgePoint"></p><button id="localBridgeFit" type="button">Find live marker</button>
 <details id="serverProfiles"><summary>Server profiles / Dedicated server (experimental)</summary>
 <p>Dedicated mode shares one administrator-selected named entity. Requires the v2.9.1 server addon candidate and a v2 relay. Real dedicated-server validation is pending. Gameplay ports cannot be used as relay addresses.</p>
 <label>Saved profile<select id="bridgeProfileSelect"><option value="">New profile</option></select></label>
 <label>Profile name<input id="bridgeProfileName" maxlength="80" placeholder="77th JSOC Operations Server"></label>
 <label>Deployment<select id="bridgeDeployment"><option value="local">Local / player-hosted</option><option value="dedicated">Dedicated server — experimental</option></select></label>
 <label>Connection method<select id="bridgeMethod"><option value="free">Free temporary tunnel on this PC</option><option value="relay">Existing HTTPS relay</option></select></label>
 <label>Relay root address<input id="bridgeProfileEndpoint" type="url" placeholder="https://relay.example/"></label>
 <label>Update / poll interval (seconds)<input id="bridgeInterval" type="number" min="1" max="5" value="2"></label>
 <label>Connection timeout (seconds)<input id="bridgeTimeout" type="number" min="2" max="15" value="5"></label>
 <label><input id="bridgeReconnect" type="checkbox" checked> Automatically retry interruptions (up to five attempts)</label>
 <p>Tracking scope: one authorised entity. Access: read-only. No automatic connection at startup.</p>
 <button id="bridgeProfileSave" type="button">Save profile</button> <button id="bridgeProfileDelete" type="button">Delete profile</button> <button id="bridgeProfileConnect" type="button">Connect profile</button> <button id="bridgeProfileExport" type="button">Export profiles without secrets</button>
 <p id="bridgeProfileFeedback" role="status"></p>
 <p>Dedicated server administrator: after connecting, put the displayed address and pairing code into the server’s private JSOC_ORBAT_Dedicated.json. Do not put this code in a Workshop upload. See DEDICATED-SERVER.md in this release.</p>
 </details>
 <details><summary>Safety &amp; Diagnostics</summary><p id="bridgeLastReceived">No position received</p><p id="bridgeTraffic"></p><pre id="bridgeDiagnostics" style="white-space:pre-wrap"></pre></details>
 <details><summary>Advanced: existing relay or local Workbench</summary><label>Existing HTTPS relay<input id="remoteBridgeEndpoint" type="url" placeholder="https://your-relay.example/" autocomplete="off" spellcheck="false"></label><button id="remoteBridgeStart" type="button">Connect via relay</button> <button id="localBridgeStart" type="button">Start local receiver</button></details>
 <p>Connection buttons take effect immediately. Closing or reloading the planner stops this connection. Start free connection creates a new address and code each time. Public relay codes expire after one hour; the local Workbench receiver lasts until stopped. Stale positions disappear; your saved plan and exports are unchanged.</p>`;
 content.append(section);const $=id=>document.getElementById(id);
 const badge=document.createElement('button');badge.id='liveBridgeBadge';badge.type='button';badge.hidden=true;badge.title='Open live bridge connection settings';document.querySelector('.map-shell').append(badge);
 badge.onclick=()=>{$('settingsGear').click();button.click();};
 const style=document.createElement('style');style.textContent='#liveBridgeBadge{position:absolute;top:56px;left:50%;transform:translateX(-50%);z-index:690;background:#231c0ced;border:1px solid #ffb347;color:#ffe0a6;padding:6px 10px;font-size:11px;max-width:45%}.leaflet-tooltip.live-bridge-label{white-space:nowrap;width:max-content;max-width:none;font-size:11px}';document.head.append(style);
 let previousStatus='',deployment='local';
 function instructions(mode){deployment=mode;const dedicated=mode==='dedicated';$('bridgeAddressLabel').textContent=dedicated?'1. Address — SERVER config endpoint':'1. Address — paste into the GAME’s first field';$('bridgeCodeLabel').textContent=dedicated?'2. Pairing code — SERVER config pairingCode':'2. Pairing code — paste into the GAME’s second field';$('bridgeInstructions').textContent=dedicated?'In the dedicated SERVER’s private profile folder, edit JSOC_ORBAT_Dedicated.json. Paste the ADDRESS into endpoint and the CODE into pairingCode. Set enabled to true and configure the authorised named entity. No game pause-menu pairing is needed.':'In Reforger, press Escape → ORBAT PLANNER – HOST PAIRING. Paste the address and code, click CONNECT, resume, and control a soldier. Keep this planner and your PC running.';}

 button.onclick=()=>{$('settingsFeedback').textContent='Connection controls apply immediately.';for(const el of content.children)el.hidden=el!==section;for(const b of nav.children)b.setAttribute('aria-current',String(b===button));};
 nav.addEventListener('click',e=>{if(e.target.closest('button')!==button)section.hidden=true;},true);$('settingsGear').addEventListener('click',()=>section.hidden=true);
 const messages={off:'Off — click Start free connection.',starting:'Starting the public tunnel… Stop cancels startup.',pairing:'Preparing the public connection…',waiting:'Connected to relay — waiting for live data. Paste the address and code into Reforger. A new public address may take a moment to resolve in the game.',connected:'Connected — receiving your character’s position.',stale:'No recent position — resume the game and control a character.',reconnecting:'Connection interrupted — retrying. The stale marker is hidden.',error:'Connection stopped.'};
 function render(s){
  const idle=['off','error','expired','authentication-failed','security-lockout','unsupported','interrupted'].includes(s.status);
  $('bridgeLastReceived').textContent=s.lastReceived?'Last valid position: '+new Date(s.lastReceived).toLocaleString():'No position received in this session';
  $('bridgeTraffic').textContent=s.traffic?`${s.traffic.requests} requests · ${s.traffic.bytes} response bytes · ${s.retries||0} current retries`:'';
  $('bridgeDiagnostics').textContent=(s.diagnostics||[]).map(x=>`${x.severity}: ${x.message}${x.count>1?' (×'+x.count+')':''}`).join('\n');
  badge.hidden=s.status==='off';
  const badgeLabels={starting:'STARTING',pairing:'STARTING',waiting:'READY',connected:'CONNECTED',stale:'NO POSITION',reconnecting:'RECONNECTING',error:'STOPPED',expired:'EXPIRED','authentication-failed':'AUTH FAILED','security-lockout':'LOCKED',unsupported:'UNSUPPORTED',interrupted:'INTERRUPTED'};
  if(previousStatus!==s.status){badge.textContent='LIVE · '+(badgeLabels[s.status]||'OFF');previousStatus=s.status;}

  $('localBridgeStatus').textContent=(s.error||messages[s.status]||s.status)+(s.received?' · '+s.received+' updates':'');
  $('bridgeAddress').value=s.endpoint||(!idle&&s.mode!=='free'&&s.mode!=='remote'?'http://127.0.0.1:8791/':'');
  $('localBridgeToken').value=s.token||'';
  for(const id of ['freeBridgeStart','remoteBridgeStart','localBridgeStart'])$(id).disabled=!idle;
  $('localBridgeStop').disabled=idle;$('bridgeCopyAddress').disabled=!s.token;$('bridgeCopyCode').disabled=!s.token;
  $('localBridgeFit').disabled=!s.point;
  $('localBridgePoint').textContent=s.point?'Game coordinates: X '+s.point.x.toFixed(2)+' / Z '+s.point.z.toFixed(2)+' · Everon imagery alignment applied':'';
  if(idle)$('bridgeCopyStatus').textContent='';
  window.dispatchEvent(new CustomEvent('local-bridge-state',{detail:s}));
 }
 let commandGeneration=0;
 async function command(action,options){const ticket=++commandGeneration;try{const result=await api.command(action,options);if(ticket!==commandGeneration)return;render(result);if(action==='copy-address')$('bridgeCopyStatus').textContent=deployment==='dedicated'?'Address copied. Paste into endpoint in the SERVER config.':'Address copied. Paste into the first field in Reforger.';if(action==='copy-code')$('bridgeCopyStatus').textContent=deployment==='dedicated'?'Code copied. Paste into pairingCode in the SERVER config.':'Code copied. Paste into the second field in Reforger.';}catch(e){if(ticket===commandGeneration)$('localBridgeStatus').textContent=e.message;}}
 $('freeBridgeStart').onclick=()=>{instructions('local');command('free-start');};$('bridgeCopyAddress').onclick=()=>command('copy-address');$('bridgeCopyCode').onclick=()=>command('copy-code');
 $('remoteBridgeStart').onclick=()=>{instructions('local');command('remote-start',{endpoint:$('remoteBridgeEndpoint').value.trim()});};$('localBridgeStart').onclick=()=>{instructions('local');command('start');};$('localBridgeStop').onclick=()=>command('stop');
 $('localBridgeFit').onclick=()=>{window.dispatchEvent(new Event('local-bridge-fit'));$('settingsClose').click();};

 const store=window.PlannerServerProfiles.createStore(localStorage);
 function profiles(selected=''){const el=$('bridgeProfileSelect');el.replaceChildren(new Option('New profile',''));for(const p of store.list())el.add(new Option(p.name,p.id));el.value=selected;}
 function form(){return {id:$('bridgeProfileSelect').value||crypto.randomUUID(),name:$('bridgeProfileName').value,deployment:$('bridgeDeployment').value,method:$('bridgeMethod').value,endpoint:$('bridgeProfileEndpoint').value.trim(),intervalMs:Number($('bridgeInterval').value)*1000,timeoutMs:Number($('bridgeTimeout').value)*1000,autoReconnect:$('bridgeReconnect').checked,scope:'single-entity',readOnly:true};}
 function feedback(fn){try{fn();}catch(e){$('bridgeProfileFeedback').textContent=e.message;}}
 $('bridgeProfileSelect').onchange=()=>{const p=store.list().find(p=>p.id===$('bridgeProfileSelect').value);$('bridgeProfileName').value=p?.name||'';$('bridgeDeployment').value=p?.deployment||'local';$('bridgeMethod').value=p?.method||'free';$('bridgeProfileEndpoint').value=p?.endpoint||'';$('bridgeInterval').value=(p?.intervalMs||2000)/1000;$('bridgeTimeout').value=(p?.timeoutMs||5000)/1000;$('bridgeReconnect').checked=p?.autoReconnect??true;};
 $('bridgeProfileSave').onclick=()=>feedback(()=>{const p=form();store.save(p);profiles(p.id);$('bridgeProfileFeedback').textContent='Profile saved locally without credentials. Connection settings apply on the next Connect.';});
 $('bridgeProfileDelete').onclick=()=>feedback(()=>{store.remove($('bridgeProfileSelect').value);profiles();$('bridgeProfileSelect').onchange();$('bridgeProfileFeedback').textContent='Profile deleted. Use Stop connection to end any active session.';});
 $('bridgeProfileConnect').onclick=()=>feedback(()=>{const p=PlannerServerProfiles.validate(form());instructions(p.deployment);$('bridgeProfileFeedback').textContent='Starting '+p.name+'. Any previous connection is closed.';command('profile-start',p);});
 $('bridgeProfileExport').onclick=()=>feedback(()=>{const url=URL.createObjectURL(new Blob([store.export()],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ORBAT-server-profiles.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});profiles();

 if(api){const unsubscribe=api.subscribe(render);window.addEventListener('beforeunload',unsubscribe,{once:true});command('status');}else{for(const id of ['freeBridgeStart','remoteBridgeStart','localBridgeStart','bridgeCopyAddress','bridgeCopyCode','localBridgeStop','bridgeProfileConnect'])$(id).disabled=true;$('localBridgeStatus').textContent='Open the desktop planner EXE to connect.';}
})();
