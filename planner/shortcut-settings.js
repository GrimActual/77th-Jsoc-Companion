'use strict';
(()=>{
 const graphics=document.createElement('p');graphics.id='graphicsStatus';graphics.setAttribute('role','status');document.querySelector('#settingsContent section').append(graphics);document.getElementById('settingsGear').addEventListener('click',async()=>{try{const result=await window.plannerDesktop?.graphicsStatus?.();graphics.textContent=!result?'Graphics acceleration is managed by your browser.':String(result.compositing).startsWith('enabled')?'GPU acceleration active.':'Software rendering is active; graphics acceleration depends on the system and driver.';}catch{graphics.textContent='Graphics status unavailable.';}});
 const S=window.PlannerShortcuts,host=document.getElementById('shortcutFields'),feedback=document.getElementById('shortcutFeedback');
 for(const [id,[label]]of Object.entries(S.definitions)){
  const row=document.createElement('div');const title=document.createElement('label');title.htmlFor='shortcut-'+id;title.textContent=label;
  const input=document.createElement('input');input.id=title.htmlFor;input.dataset.shortcut=id;input.type='text';input.autocomplete='off';input.spellcheck=false;input.maxLength=200;
  row.append(title,input);host.append(row);
 }
 function fill(bindings){for(const input of host.querySelectorAll('input'))input.value=bindings[input.dataset.shortcut]||'';feedback.textContent='';}
 function read(){const draft=Object.fromEntries([...host.querySelectorAll('input')].map(el=>[el.dataset.shortcut,el.value]));try{const result=S.validate(draft);feedback.textContent='';return result;}catch(e){feedback.textContent=PlannerI18n.t('Check shortcut settings: ')+e.message;throw e;}}
 document.getElementById('shortcutReset').onclick=()=>{fill(S.defaults());feedback.textContent='Default shortcuts selected. Save settings to apply.';};
 window.ShortcutSettings={fill,read};fill(PlannerPreferences.get().shortcuts);
 const note=document.createElement('p');note.className='hint';note.textContent='Help describes default keys. View your current bindings in Settings → Keyboard Shortcuts.';document.getElementById('sargeHelpPanel').append(note);document.getElementById('groupTools').after(note.cloneNode(true));
})();
