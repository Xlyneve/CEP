/* Descriptor-matching prototype. ACEM G24 v6 (Nov 2023), ETEK (2024).
 * These are indicative findings, not a validated automated triage algorithm.
 * Paediatric values are not compared against adult HR/BP thresholds.
 */
export const ATS_SOURCES = {
  acem: 'https://acem.org.au/getmedia/51dc74f7-9ff0-42ce-872a-0437f3db640a/G24_04',
  eyes: 'https://www.safetyandquality.gov.au/sites/default/files/2024-04/emergency_triage_education_kit_-_ophthalmic_presentations_and_triage_categories.pdf',
  children: 'https://www.safetyandquality.gov.au/sites/default/files/resources/additional//emergency_triage_education_kit_-_primary_survey_findings_and_triage_categories_-_children.pdf'
};
// [id, concise clinical label, adult category, child category]
export const ATS_FINDINGS = [
 ['arrest','Cardiac / respiratory arrest',1,1],
 ['airway','Obstructed / immediately threatened airway',1,1],
 ['seizure','Ongoing seizure',1,1],
 ['unresponsive','Unresponsive / pain response only',1,1],
 ['shock','Severe shock',1,1],
 ['airwayRisk','Stridor / drooling with distress',2,2],
 ['perfusion','Poor perfusion / circulatory compromise',2,2],
 ['cardiac','Likely cardiac chest pain',2,2],
 ['stroke','Acute focal neurological deficit',2,2],
 ['sepsisUnstable','Suspected sepsis, unstable',2,2],
 ['feverLethargy','Fever with lethargy',2,2],
 ['neutropenia','Febrile neutropenia',2,2],
 ['toxin','Significant toxic ingestion',2,2],
 ['torsion','Suspected testicular torsion',2,2],
 ['majorTrauma','Major trauma / amputation',2,2],
 ['eyeChemical','Chemical eye injury',2,2],
 ['eyePenetrating','Penetrating eye injury / suspected open globe',2,2],
 ['eyeSevere','Severe eye pain',2,2],
 ['eyeInfection','Pain / red eye / blurred vision after eye procedure',2,2],
 ['eyeVision','Acute visual disturbance',3,3],
 ['eyeMinor','Eye inflammation / foreign body; normal vision',4,4],
 ['highRiskPain','Possible PE / aortic emergency / ectopic',2,2],
 ['sepsisStable','Suspected sepsis, stable',3,3],
 ['vomiting','Persistent vomiting',3,3],
 ['dehydrationSevere','Severe dehydration',null,2],
 ['dehydration','Moderate dehydration',3,3],
 ['seizureAlert','Seizure resolved, now alert',3,3],
 ['headLOC','Head injury, brief LOC, now alert',3,3],
 ['limb','Limb deformity / neurovascular change',3,3],
 ['abuse','Suspected child abuse',null,3],
 ['minorInjury','Minor injury needing intervention',4,4],
 ['gi','Vomiting / diarrhoea, no dehydration',4,4],
 ['review','Routine review / stable minor symptoms',5,5]
];
export const ATS_TIMES = {1:'Immediate',2:'Within 10 minutes',3:'Within 30 minutes',4:'Within 60 minutes',5:'Within 120 minutes'};
export function assessATS(s={}) {
 const matches=[], warnings=[], errors=[];
 const add=(category,reason)=>matches.push({category,reason});
 const child=s.group==='child', known=child||s.group==='adult';
 const value=(key,min,max)=>{
  const raw=s[key];if(raw===undefined||raw===null||String(raw).trim()==='')return null;
  const n=Number(raw);if(!Number.isFinite(n)||n<min||n>max){errors.push('Check '+key+' and its units.');return null;}return n;
 };
 const age=value('ageMonths',0,215.99);
 if(child&&age===null)warnings.push('Enter the child’s age in months.');
 if(child&&age!==null&&age<1)add(3,'Neonate: assess urgently, even if currently stable.');
 for(const id of s.findings||[]){const f=ATS_FINDINGS.find(f=>f[0]===id);if(f){const cat=child?f[3]:f[2];if(cat)add(cat,f[1]);}}
 if(!known)warnings.push('Choose adult or child.');
 const respiratory={adult:{extreme:1,severe:2,moderate:3},child:{extreme:1,severe:1,moderate:2,mild:3}};
 if(known&&respiratory[s.group][s.breathing])add(respiratory[s.group][s.breathing],(child?'Child: ':'')+s.breathing+' breathing difficulty');
 if(s.pain==='verySevere')add(2,'Very severe pain');
 if(s.pain==='moderatelySevere')add(3,'Moderately severe pain');
 if(s.pain==='moderate')add(4,'Moderate pain');
 if(child&&s.activity==='severe')add(2,'Markedly reduced activity / interaction');
 if(child&&s.activity==='moderate')add(3,'Reduced activity, makes eye contact when disturbed');
 const hr=value('hr',0,350),rr=value('rr',0,150),sbp=value('sbp',0,300),gcs=value('gcs',3,15),bgl=value('bgl',0,60),spo2=value('spo2',0,100),temp=value('temp',25,45);
 if(hr===0)add(1,'No pulse recorded: assess for cardiac arrest immediately');
 if(gcs!==null&&!Number.isInteger(gcs))errors.push('GCS must be a whole number.');
 if(gcs!==null&&gcs<9)add(1,'GCS below 9');else if(gcs!==null&&gcs<13)add(2,'GCS below 13');
 if(bgl!==null&&bgl<3)add(2,'Glucose below 3 mmol/L');
 if(rr!==null&&rr<10)add(1,'Respiratory rate below 10/min');
 if(s.group==='adult'){
  if(hr!==null&&(hr<50||hr>150))add(2,'Adult pulse outside 50–150/min');
  if(sbp!==null&&sbp<80)add(1,'Adult systolic BP below 80 mmHg');
 }
 if(child&&age!==null&&age<12&&hr!==null&&hr<60)add(1,'Infant pulse below 60/min');
 // Other entered observations require clinician interpretation, never invented cut-offs.
 const unclassified=(hr!==null&&!(s.group==='adult'&&(hr<50||hr>150))&&!(child&&age!==null&&age<12&&hr<60)) || (rr!==null&&rr>=10) || (sbp!==null&&!(s.group==='adult'&&sbp<80)) || spo2!==null || temp!==null || (bgl!==null&&bgl>=3) || (gcs!==null&&gcs>=13);
 if(unclassified)warnings.push('Interpret the entered observations in context'+(child?' using age-specific paediatric ranges':'')+'. These values do not have an automatic category rule here.');
 if(s.group==='adult'&&(s.findings||[]).includes('dehydrationSevere'))warnings.push('Severe dehydration: assess shock and perfusion; the adult category is not assigned from this label alone.');
 if(s.pregnancy)warnings.push('Pregnancy needs maternal and fetal assessment; this prototype does not cover obstetric triage.');
 matches.sort((a,b)=>a.category-b.category);
 const category=matches[0]?.category??null;
 const blocked=!known||(child&&age===null)||errors.length>0||s.pregnancy||unclassified||(s.group==='adult'&&(s.findings||[]).includes('dehydrationSevere'));
 const assessmentMissing=!s.breathing||!s.pain||(child&&!s.activity);
 if(assessmentMissing)warnings.push('Complete breathing, pain'+(child?' and interaction':'')+' assessment.');
 if(s.group==='adult'&&s.breathing==='mild')warnings.push('Mild breathing difficulty needs contextual assessment; no automatic adult category is assigned here.');
 const needsAssessment=!s.assessed||blocked||assessmentMissing||(s.group==='adult'&&s.breathing==='mild');
 return {category,matches,warnings,errors,needsAssessment,complete:!!category&&!needsAssessment,urgent:category!==null&&category<=2};
}
