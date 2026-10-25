import {assessATS,ATS_FINDINGS,ATS_TIMES,ATS_SOURCES} from './ats-triage-rules.mjs?v=1';
let dialog,opener;
function create(){
 if(dialog)return;
 dialog=document.createElement('dialog');dialog.id='atsTriageDialog';dialog.setAttribute('aria-labelledby','ats-title');
 dialog.innerHTML=`<form method="dialog" class="ats-shell">
 <div class="ats-heading"><div><h2 id="ats-title">Australasian triage</h2><small>Descriptor guide · prototype</small></div><button type="button" data-close aria-label="Close triage">×</button></div>
 <p class="ats-note">Prototype for review—not validated for clinical use. Confirm ATS through a trained clinician’s full assessment. The most urgent finding takes priority; reassess if the patient changes.</p>
 <div class="ats-row"><label>Patient<select name="group"><option value="">Choose…</option><option value="adult">Adult (18+)</option><option value="child">Child (under 18)</option></select></label><label data-child hidden>Age in months<input name="ageMonths" inputmode="decimal" type="number" min="0" max="215.99" step="any" placeholder="e.g. 6 or 120"></label></div>
 <label class="ats-check"><input name="pregnancy" type="checkbox">Pregnant / recently postpartum</label>
 <div id="ats-result" class="ats-result" role="status" aria-live="polite"></div>
 <fieldset><legend>Symptoms / findings</legend><p class="ats-note">Select every relevant finding, including danger signs, even when the main symptom seems minor.</p><input class="ats-filter" type="search" placeholder="Find a symptom or finding…" aria-label="Filter findings"><div class="ats-findings"></div><p class="ats-note">Filtering only hides options; selected findings still count. Unchecked means not selected, not ruled out.</p></fieldset>
 <div class="ats-row"><label>Breathing<select name="breathing"><option value="">Not assessed</option><option value="none">No distress assessed</option><option value="mild">Mild distress</option><option value="moderate">Moderate distress</option><option value="severe">Severe distress</option><option value="extreme">Extreme distress / hypoventilation</option></select></label>
 <label>Pain<select name="pain"><option value="">Not assessed</option><option value="minimal">Minimal / none</option><option value="moderate">Moderate (not severe)</option><option value="moderatelySevere">Moderately severe</option><option value="verySevere">Very severe</option></select></label></div>
 <p class="ats-note" id="ats-breathing-help"></p>
 <label data-child hidden>Child’s interaction<select name="activity"><option value="">Not assessed</option><option value="usual">Usual interaction</option><option value="moderate">Quiet; eye contact when disturbed</option><option value="severe">No eye contact / reduced tone / repeatedly falls asleep</option></select></label>
 <details><summary>Abnormal vital signs (optional)</summary><p class="ats-note">Enter only the abnormal observations you want considered. Blanks are unknown. No universal paediatric HR/BP or oxygen thresholds are assumed.</p><div class="ats-vitals"></div></details>
 <label class="ats-check ats-confirm"><input name="assessed" type="checkbox">I have completed the overall assessment, including observations, and considered other high-risk features.</label>
 <p class="ats-note">No finding matched? This does not mean ATS 5. This list is not exhaustive. Unlisted symptoms or abnormal observations require clinical assessment.</p>
 <details><summary>Reference & category times</summary><p>1 · Immediate<br>2 · 10 min<br>3 · 30 min<br>4 · 60 min<br>5 · 120 min</p><p class="ats-note">These are maximum times from arrival, not advice to delay care. ATS 1–2 need immediate placement in an appropriate assessment area.</p><a href="${ATS_SOURCES.acem}" target="_blank" rel="noopener">ACEM G24 · v6, November 2023 ↗</a><br><a href="${ATS_SOURCES.children}" target="_blank" rel="noopener">ETEK · children, 2024 ↗</a><br><a href="${ATS_SOURCES.eyes}" target="_blank" rel="noopener">ETEK · eye presentations, 2024 ↗</a></details>
 <div class="ats-footer"><span class="ats-note">Entries stay in this popup only.</span><button type="button" data-reset>Reset</button></div></form>`;
 const list=dialog.querySelector('.ats-findings');
 for(const [id,label] of ATS_FINDINGS){const el=document.createElement('label');el.className='ats-check';el.dataset.finding=id;const input=document.createElement('input');input.type='checkbox';input.name='findings';input.value=id;el.append(input,document.createTextNode(label));list.append(el);}
 const vitals=[['hr','Pulse /min',0,350],['rr','Respirations /min',0,150],['sbp','Systolic BP mmHg',0,300],['spo2','SpO₂ %',0,100],['temp','Temperature °C',25,45],['gcs','GCS',3,15],['bgl','Glucose mmol/L',0,60]];
 for(const [name,label,min,max] of vitals){const el=document.createElement('label');el.textContent=label;const input=document.createElement('input');Object.assign(input,{name,type:'number',min:String(min),max:String(max),step:name==='gcs'?'1':'any',inputMode:'decimal',placeholder:'—'});el.append(input);dialog.querySelector('.ats-vitals').append(el);}
 document.body.append(dialog);
 dialog.querySelector('form').addEventListener('submit',e=>e.preventDefault());
 const changed=e=>{if(e.target.name&&e.target.name!=='assessed')dialog.querySelector('[name=assessed]').checked=false;update();};
 dialog.addEventListener('input',changed);dialog.addEventListener('change',changed);
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();
 dialog.querySelector('[data-reset]').onclick=()=>{dialog.querySelector('form').reset();update();dialog.querySelector('[name=group]').focus();};
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{dialog.querySelector('form').reset();update();opener?.focus();});
 update();
}
function update(){
 const form=dialog.querySelector('form'),data=Object.fromEntries(new FormData(form));data.findings=[...form.querySelectorAll('[name=findings]:checked')].map(e=>e.value);data.assessed=form.elements.assessed.checked;data.pregnancy=form.elements.pregnancy.checked;
 const child=data.group==='child';form.querySelector('#ats-breathing-help').textContent=child?'Child breathing: severe = marked recession/accessory muscle use or acute cyanosis; moderate = moderate recession/accessory use; mild = slight recession with normal perfusion. Hypoventilation or airway obstruction needs immediate response.':'Adult breathing: extreme distress or hypoventilation is an immediate threat; severe and moderate distress have different ATS descriptors. Use overall appearance and work of breathing, not the rate alone.';form.querySelectorAll('[data-child]').forEach(e=>e.hidden=!child);if(!child){data.ageMonths='';data.activity='';}
 const query=form.querySelector('.ats-filter').value.toLowerCase().trim();
 form.querySelectorAll('[data-finding]').forEach(el=>{el.hidden=(el.dataset.finding==='abuse'&&!child)||(!el.textContent.toLowerCase().includes(query));});
 const r=assessATS(data),out=form.querySelector('#ats-result');out.replaceChildren();out.dataset.category=r.category||'';
 const title=document.createElement('strong');title.textContent=r.category?(r.urgent||r.complete?`${r.complete?'Suggested':'Urgent match'} ATS ${r.category} · ${ATS_TIMES[r.category]}`:`Partial descriptor match · ATS ${r.category} (assessment incomplete)`):'Urgency not determined';out.append(title);
 if(r.urgent){const p=document.createElement('p');p.textContent=r.category===1?'Immediate emergency response. Do not wait to finish this form.':'Urgent assessment area now; do not wait for the 10-minute limit.';out.append(p);}
 const reasons=[...r.matches.map(m=>m.reason),...r.errors,...r.warnings];if(r.category&&r.needsAssessment)reasons.push('Partial guide only—complete clinical assessment; a more urgent category may be needed.');
 if(!r.category)reasons.push('No category assigned. Missing or unmatched information cannot establish low urgency.');
 const ul=document.createElement('ul');for(const text of reasons){const li=document.createElement('li');li.textContent=text;ul.append(li);}out.append(ul);
}
window.openATSTriage=function(){create();opener=document.activeElement;if(!dialog.open)dialog.showModal();dialog.querySelector('[name=group]').focus();};
