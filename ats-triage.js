import {assessATS,ATS_FINDINGS,ATS_TIMES,ATS_SOURCES} from './ats-triage-rules.mjs?v=3';
let dialog,opener,previousConcern='',previousGroup='';
const vitalNames=['hr','rr','sbp','spo2','temp','gcs','bgl'];
const concerns={
 chest:{label:'Chest pain',questions:[['cardiacHistory','Does the history suggest a cardiac cause?', [['','Choose…'],['cardiac','Likely cardiac'],['chestNonCardiac','Likely non-cardiac, with moderate pain'],['unsure','Uncertain / another pattern']]]]},
 breathing:{label:'Breathing / airway',questions:[['airwayConcern','Any stridor or drooling with distress?', [['','Choose…'],['airwayRisk','Yes'],['none','No'],['unsure','Uncertain']]]]},
 fever:{label:'Fever / infection',questions:[['infection','Is sepsis suspected?', [['','Choose…'],['sepsisUnstable','Yes, physiologically unstable'],['sepsisStable','Yes, currently stable'],['none','No'],['unsure','Uncertain']]],['lethargy','Fever with lethargy?', [['','Choose…'],['feverLethargy','Yes'],['none','No'],['unsure','Uncertain']]],['neutropenia','Febrile neutropenia?', [['','Choose…'],['neutropenia','Yes'],['none','No'],['unsure','Uncertain']]]]},
 injury:{label:'Injury / head injury',questions:[['injuryType','Which finding best describes the injury?', [['','Choose…'],['majorTrauma','Major trauma / amputation'],['limb','Limb deformity or neurovascular change'],['headLOC','Brief loss of consciousness; now alert'],['minorInjury','Minor injury needing intervention'],['review','Small superficial wound, no intervention needed'],['unsure','Other / uncertain']]]]},
 abdominal:{label:'Abdominal / pelvic / testicular pain',questions:[['abdominalRisk','Which finding applies?', [['','Choose…'],['highRiskPain','Possible ectopic / aortic emergency / PE'],['torsion','Possible testicular torsion'],['abdominalUrgent','Moderately severe abdominal pain, or age over 65'],['abdominalMinor','Non-specific abdominal pain, no higher-risk features'],['unsure','Uncertain / not yet assessed']]]]},
 eye:{label:'Eye symptoms',questions:[['eyeFinding','Which eye finding is present?', [['','Choose…'],['eyeChemical','Chemical injury'],['eyePenetrating','Penetrating injury / possible open globe'],['eyeSevere','Severe eye pain'],['eyeInfection','Pain, red eye and blurred vision after an eye procedure'],['eyeVision','Acute visual disturbance'],['eyeMinor','Inflammation / foreign body with normal vision'],['unsure','Other / uncertain']]]]},
 neurological:{label:'Seizure / neurological change',questions:[['neurology','Which finding is present?', [['','Choose…'],['seizure','Ongoing seizure'],['unresponsive','Unresponsive / responds only to pain'],['stroke','New focal neurological deficit'],['seizureAlert','Seizure stopped; now alert'],['unsure','Other / uncertain']]]]},
 vomiting:{label:'Vomiting / diarrhoea / dehydration',questions:[['vomitingPattern','Which pattern applies?', [['','Choose…'],['vomiting','Persistent vomiting'],['gi','Vomiting / diarrhoea without dehydration'],['none','Neither'],['unsure','Uncertain']]],['hydration','Hydration assessment?', [['','Choose…'],['dehydrationSevere','Severe dehydration'],['dehydration','Moderate dehydration'],['none','No dehydration assessed'],['unsure','Uncertain']]]]},
 routine:{label:'Routine review / minor stable symptoms',questions:[['routineReview','Is this a routine review or a minor, stable condition?', [['','Choose…'],['review','Yes, assessed with no acute high-risk features'],['unsure','No / uncertain']]]]},
 other:{label:'Other concern',questions:[]}
};
function addOptions(select,options){for(const [value,label] of options){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}}
function buildQuestions(){
 const form=dialog.querySelector('form'),host=form.querySelector('#ats-questions');host.replaceChildren();
 const config=concerns[form.elements.concern.value];host.hidden=!config;
 if(!config)return;
 for(const [name,text,options] of config.questions){const label=document.createElement('label');label.textContent=text;const select=document.createElement('select');select.name=name;select.dataset.atsAnswer='';addOptions(select,options.map(([value,label])=>[value,form.elements.group.value==='child'&&value==='abdominalUrgent'?'Moderately severe abdominal pain':label]));label.append(select);host.append(label);}
 if(form.elements.concern.value==='other'){const p=document.createElement('p');p.className='ats-note';p.textContent='Use relevant additional findings below. An unlisted concern cannot be assigned a low-urgency category automatically.';host.append(p);}
}
function create(){
 if(dialog)return;
 dialog=document.createElement('dialog');dialog.id='atsTriageDialog';dialog.setAttribute('aria-labelledby','ats-title');
 dialog.innerHTML=`<form class="ats-shell">
 <div class="ats-heading"><div><h2 id="ats-title">Australasian triage</h2><small>Symptom guide · prototype</small></div><button type="button" data-close aria-label="Close triage">×</button></div>
 <p class="ats-note">For review—not validated for clinical use. Confirm the category through full clinical assessment.</p>
 <div id="ats-alert" class="ats-urgent-alert" role="alert" hidden></div>
 <label class="ats-main-label">What is the main concern?<select name="concern"><option value="">Choose a symptom…</option></select></label>
 <div class="ats-row"><label>Patient<select name="group"><option value="">Choose…</option><option value="adult">Adult (18+)</option><option value="child">Child (under 18)</option></select></label><label data-child hidden>Age in months<input name="ageMonths" inputmode="decimal" type="number" min="0" max="215.99" step="any" placeholder="e.g. 6 or 120"></label></div>
 <label>Any immediate danger?<select name="danger"><option value="">Not yet assessed</option><option value="none">None of these found on assessment</option><option value="arrest">Cardiac / respiratory arrest</option><option value="airway">Obstructed / immediately threatened airway</option><option value="seizure">Ongoing seizure</option><option value="unresponsive">Unresponsive / responds only to pain</option><option value="shock">Severe shock</option></select></label>
 <div id="ats-questions" class="ats-questions" hidden></div>
 <div class="ats-row"><label>Breathing<select name="breathing"><option value="">Not assessed</option><option value="none">No distress assessed</option><option value="mild">Mild distress</option><option value="moderate">Moderate distress</option><option value="severe">Severe distress</option><option value="extreme">Extreme distress / hypoventilation</option></select></label><label>Pain<select name="pain"><option value="">Not assessed</option><option value="minimal">Minimal / none</option><option value="moderate">Moderate (not severe)</option><option value="moderatelySevere">Moderately severe</option><option value="verySevere">Very severe</option></select></label></div>
 <label data-child hidden>Child’s interaction<select name="activity"><option value="">Not assessed</option><option value="usual">Usual interaction</option><option value="moderate">Quiet; eye contact when disturbed</option><option value="severe">No eye contact / reduced tone / repeatedly falls asleep</option></select></label>
 <label class="ats-check"><input name="vitalsNormal" type="checkbox">Vital signs assessed and normal for age</label>
 <details id="ats-vital-details"><summary>Enter abnormal vital signs</summary><p class="ats-note">Blanks are unknown. Values without a supported ATS rule need contextual review, including age-specific paediatric ranges.</p><div class="ats-vitals"></div></details>
 <details><summary>Additional findings / another concern</summary><p class="ats-note">Choose any other relevant findings. They still count if you change the main symptom.</p><div class="ats-findings"></div></details>
 <label class="ats-check"><input name="pregnancy" type="checkbox">Pregnant / recently postpartum</label>
 <label class="ats-check ats-confirm"><input name="assessed" type="checkbox">Full assessment reviewed; other high-risk features considered</label>
 <div id="ats-result" class="ats-result" role="status" aria-live="polite"></div>
 <details><summary>How this guide works & references</summary><p class="ats-note">The most urgent finding wins. Normal vital signs do not rule out time-critical illness. No matched finding does not mean ATS 5. Reassess if the patient changes.</p><p class="ats-note" id="ats-breathing-help"></p><p>1 · Immediate<br>2 · 10 min<br>3 · 30 min<br>4 · 60 min<br>5 · 120 min</p><p class="ats-note">Maximum times from arrival, not advice to wait. ATS 1–2 need an appropriate assessment area immediately.</p><a href="${ATS_SOURCES.acem}" target="_blank" rel="noopener">ACEM G24 · v6, November 2023 ↗</a><br><a href="${ATS_SOURCES.children}" target="_blank" rel="noopener">ETEK · children, 2024 ↗</a><br><a href="${ATS_SOURCES.eyes}" target="_blank" rel="noopener">ETEK · eye presentations, 2024 ↗</a></details>
 <div class="ats-footer"><span class="ats-note">Entries clear when closed.</span><button type="button" data-reset>Reset</button></div></form>`;
 addOptions(dialog.querySelector('[name=concern]'),Object.entries(concerns).map(([id,c])=>[id,c.label]));
 const list=dialog.querySelector('.ats-findings');for(const [id,label] of ATS_FINDINGS){const el=document.createElement('label');el.className='ats-check';el.dataset.finding=id;const input=document.createElement('input');input.type='checkbox';input.name='findings';input.value=id;el.append(input,document.createTextNode(label));list.append(el);}
 for(const [name,text,min,max] of [['hr','Pulse /min',0,350],['rr','Respirations /min',0,150],['sbp','Systolic BP mmHg',0,300],['spo2','SpO₂ %',0,100],['temp','Temperature °C',25,45],['gcs','GCS',3,15],['bgl','Glucose mmol/L',0,60]]){const label=document.createElement('label');label.textContent=text;const input=document.createElement('input');Object.assign(input,{name,type:'number',min:String(min),max:String(max),step:name==='gcs'?'1':'any',inputMode:'decimal',placeholder:'—'});label.append(input);dialog.querySelector('.ats-vitals').append(label);}
 document.body.append(dialog);dialog.querySelector('form').addEventListener('submit',e=>e.preventDefault());
 const changed=e=>{const form=dialog.querySelector('form');if([...vitalNames,'group','ageMonths'].includes(e.target.name))form.elements.vitalsNormal.checked=false;if(e.target.name&&e.target.name!=='assessed')form.elements.assessed.checked=false;update();};dialog.addEventListener('input',changed);dialog.addEventListener('change',changed);
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-reset]').onclick=()=>{reset();dialog.querySelector('[name=concern]').focus();dialog.scrollTop=0;};
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{reset();opener?.focus();});update();
}
function reset(){dialog.querySelector('form').reset();previousConcern='';previousGroup='';dialog.querySelectorAll('details').forEach(e=>e.open=false);buildQuestions();update();}
function update(){
 const form=dialog.querySelector('form');
 if(form.elements.concern.value!==previousConcern||form.elements.group.value!==previousGroup){previousConcern=form.elements.concern.value;previousGroup=form.elements.group.value;buildQuestions();}
 const data=Object.fromEntries(new FormData(form));data.findings=[...form.querySelectorAll('[name=findings]:checked')].map(e=>e.value);data.assessed=form.elements.assessed.checked;data.pregnancy=form.elements.pregnancy.checked;data.vitalsNormal=form.elements.vitalsNormal.checked;
 const child=data.group==='child';form.querySelectorAll('[data-child]').forEach(e=>e.hidden=!child);form.querySelectorAll('[data-finding="abuse"]').forEach(e=>e.hidden=!child);if(!child){data.ageMonths='';data.activity='';}
 const followups=[...form.querySelectorAll('[data-ats-answer]')];for(const q of followups)if(ATS_FINDINGS.some(f=>f[0]===q.value))data.findings.push(q.value);
 if(ATS_FINDINGS.some(f=>f[0]===data.danger))data.findings.push(data.danger);data.findings=[...new Set(data.findings)];
 const unanswered=!data.concern||!data.danger||followups.some(q=>!q.value||q.value==='unsure');
 if(unanswered)data.assessed=false;
 const r=assessATS(data);if(unanswered){r.needsAssessment=true;r.complete=false;}
 const alert=form.querySelector('#ats-alert');alert.hidden=!r.urgent;const urgentText=r.urgent?(r.category===1?'ATS 1 match · Immediate emergency response.':'ATS 2 match · Urgent assessment area now.'):'';if(alert.textContent!==urgentText)alert.textContent=urgentText;
 const out=form.querySelector('#ats-result');out.replaceChildren();out.dataset.category=r.category||'';
 const title=document.createElement('strong');title.textContent=r.category?(r.urgent||r.complete?`${r.complete?'Suggested':'Urgent match'} ATS ${r.category} · ${ATS_TIMES[r.category]}`:`Partial match · ATS ${r.category} (assessment incomplete)`):'Complete the questions to guide urgency';out.append(title);
 if(r.urgent){const p=document.createElement('p');p.textContent=r.category===1?'Immediate emergency response. Do not wait to finish this form.':'Urgent assessment area now; do not wait for the 10-minute limit.';out.append(p);}
 const reasons=[...r.matches.map(m=>m.reason),...r.errors,...r.warnings];if(unanswered&&data.concern)reasons.push('Answer the symptom questions and immediate-danger assessment; uncertain answers require clinical review.');
 if(data.vitalsNormal&&!vitalNames.some(k=>data[k]?.trim()))reasons.push('Vital signs confirmed normal for age; urgent symptoms still take priority.');
 if(data.findings.includes('cardiac'))reasons.push('Likely cardiac chest pain is an ATS 2 descriptor even when observations are normal.');
 if(r.category&&r.needsAssessment)reasons.push('Partial guide—complete clinical assessment; a more urgent category may be needed.');if(!r.category)reasons.push('No category assigned. Unknown or unlisted features cannot establish low urgency.');
 const ul=document.createElement('ul');for(const text of reasons){const li=document.createElement('li');li.textContent=text;ul.append(li);}out.append(ul);
 form.querySelector('#ats-breathing-help').textContent=child?'Child breathing: severe = marked recession/accessory muscle use or acute cyanosis; moderate = moderate recession/accessory use; mild = slight recession with normal perfusion. Hypoventilation or airway obstruction needs immediate response.':'Adult breathing: extreme distress or hypoventilation is an immediate threat; severe and moderate distress have different ATS descriptors. Use appearance and work of breathing, not the rate alone.';
}
window.openATSTriage=function(){create();opener=document.activeElement;if(!dialog.open)dialog.showModal();dialog.querySelector('[name=concern]').focus();dialog.scrollTop=0;};
