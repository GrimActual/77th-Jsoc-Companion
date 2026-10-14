"use strict";
(()=>{
 const api=window.plannerLocalBridge,nav=document.getElementById('settingsNav'),content=document.getElementById('settingsContent');if(!nav)return;
 const button=document.createElement('button');button.id='localBridgeSettings';button.innerHTML='<strong>Live bridge</strong><small>Connect your game to the planner</small>';nav.append(button);
 const section=document.createElement('section');section.hidden=true;
 section.innerHTML=`<h3>Live bridge</h3><p>Connect your host-controlled character from Reforger, including GeForce NOW. No hosting account or card is needed.</p>
 <button id="freeBridgeStart" type="button">Start free connection</button> <button id="localBridgeStop" type="button">Stop connection</button>
 <p id="localBridgeStatus" role="status" aria-live="polite">Off</p>
 <label>1. Address — paste into the GAME’s first field<input id="bridgeAddress" readonly autocomplete="off" spellcheck="false"></label><button id="bridgeCopyAddress" type="button">Copy address</button>
 <label>2. Pairing code — paste into the GAME’s second field<input id="localBridgeToken" readonly autocomplete="off" spellcheck="false"></label><button id="bridgeCopyCode" type="button">Copy pairing code</button>
 <p id="bridgeCopyStatus" role="status"></p>
 <p>In Reforger, press Escape → COMMAND – HOST PAIRING. Paste the address and code, click CONNECT, resume, and control a soldier. Keep this planner and your PC running.</p>
 <p id="localBridgePoint"></p><button id="localBridgeFit" type="button">Find live marker</button>
 <details><summary>Advanced: existing relay or local Workbench</summary><label>Existing HTTPS relay<input id="remoteBridgeEndpoint" type="url" placeholder="https://your-relay.example/" autocomplete="off" spellcheck="false"></label><button id="remoteBridgeStart" type="button">Connect via relay</button> <button id="localBridgeStart" type="button">Start local receiver</button></details>
 <p>Connection buttons take effect immediately. Closing or reloading the planner stops this connection. Starting again creates a new address and code. Codes expire after one hour. Stale positions disappear; your saved plan and exports are unchanged.</p>`;
 content.append(section);const $=id=>document.getElementById(id);
 button.onclick=()=>{for(const el of content.children)el.hidden=el!==section;for(const b of nav.children)b.setAttribute('aria-current',String(b===button));};
 nav.addEventListener('click',e=>{if(e.target.closest('button')!==button)section.hidden=true;},true);$('settingsGear').addEventListener('click',()=>section.hidden=true);
 const messages={off:'Off — click Start free connection.',starting:'Starting connection… this may take up to a minute.',pairing:'Preparing the public connection…',waiting:'Ready — paste the address and code into Reforger.',connected:'Connected — receiving your character’s position.',stale:'No recent position — resume the game and control a character.',reconnecting:'Connection interrupted — retrying. The stale marker is hidden.',error:'Connection stopped.'};
 function render(s){
  const idle=['off','error'].includes(s.status);
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
 async function command(action,options){try{render(await api.command(action,options));if(action==='copy-address')$('bridgeCopyStatus').textContent='Address copied. Paste into the first field in Reforger.';if(action==='copy-code')$('bridgeCopyStatus').textContent='Code copied. Paste into the second field in Reforger.';}catch(e){$('localBridgeStatus').textContent=e.message;}}
 $('freeBridgeStart').onclick=()=>command('free-start');$('bridgeCopyAddress').onclick=()=>command('copy-address');$('bridgeCopyCode').onclick=()=>command('copy-code');
 $('remoteBridgeStart').onclick=()=>command('remote-start',{endpoint:$('remoteBridgeEndpoint').value.trim()});$('localBridgeStart').onclick=()=>command('start');$('localBridgeStop').onclick=()=>command('stop');
 $('localBridgeFit').onclick=()=>{window.dispatchEvent(new Event('local-bridge-fit'));$('settingsClose').click();};
 if(api){api.subscribe(render);command('status');}else{for(const id of ['freeBridgeStart','remoteBridgeStart','localBridgeStart','bridgeCopyAddress','bridgeCopyCode','localBridgeStop'])$(id).disabled=true;$('localBridgeStatus').textContent='Open the desktop planner EXE to connect.';}
})();
