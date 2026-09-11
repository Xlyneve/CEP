/* IMAC adult immunosuppressive therapy factsheet v11, August 2026. */
(function (root) {
  const date = value => value ? new Date(value + 'T00:00:00') : null;
  function add(d, value, unit = 'weeks') {
    const out = new Date(d);
    if (unit === 'months') {
      const day = out.getDate();
      out.setDate(1);
      out.setMonth(out.getMonth() + value);
      const last = new Date(out.getFullYear(), out.getMonth() + 1, 0).getDate();
      out.setDate(Math.min(day, last));
    } else out.setDate(out.getDate() + value * 7);
    return out;
  }
  const age = (dob, at) => at.getFullYear() - dob.getFullYear() - (at.getMonth() < dob.getMonth() || (at.getMonth() === dob.getMonth() && at.getDate() < dob.getDate()) ? 1 : 0);
  const fmt = d => d.toLocaleDateString('en-NZ', {day:'numeric',month:'short',year:'numeric'});
  function configure(vaccines, c) {
    const years = c.dob ? age(date(c.dob), date(c.start)) : null;
    vaccines.forEach(v => {
      if (v.key === 'hepB' || v.key === 'hpv') {
        v.intervals = [{value:v.key === 'hepB' ? 1 : 2,unit:'months'},{value:6,unit:'months'}];
        v.spacingMode = 'fromDose1';
        v.ruleText = v.key === 'hepB' ? 'Complete documented course: 0, 1 and 6 calendar months. Funded.' : '0, 2 and 6 calendar months; recommended through age 45. Funding through age 26.';
        v.funded = v.key === 'hepB' || (years !== null && years < 27) ? 'Funded' : 'Recommended / not funded';
      }
      if (v.key === 'shingrix') {
        v.intervals = [{value:2,unit:'months'}];
        v.ruleText = '2 doses, 2–6 calendar months apart. Funded at age 65 or age 18+ receiving/planning DMARDs for RA, SLE or PMR.';
        v.funded = years !== null && (years === 65 || (years >= 18 && c.dmard === 'yes')) ? 'Funded' : 'Recommended / not funded';
      }
      if (v.key === 'influenza') {
        v.doses = c.phase === 'first' ? 2 : 1;
        v.intervals = [{value:4,unit:'weeks'}];
        v.ruleText = 'Annually. In first year during immunosuppression: 2 doses, 4 weeks apart; second dose not funded and requires prescription.';
      }
      if (v.key === 'menacwy') {
        v.doses = c.phase === 'before' ? 1 : 2;
        v.intervals = [{value:8,unit:'weeks'}];
        v.funded = 'Funded: two primary doses only';
        v.ruleText = 'Before treatment: 1 dose. During treatment: 2 doses, 8 weeks apart; second primary dose requires prescription. Five-yearly booster recalls.';
      }
      if (v.key === 'bexsero') { v.funded = 'Funded: two primary doses only'; v.ruleText = '2 doses, 8 weeks apart. Five-yearly boosters recommended; funding only for certain special groups.'; }
      if (v.key === 'covid19') { v.doses = 0; v.ruleText = 'Clinical review: follow current Immunisation Handbook and available vaccine schedule; additional primary doses may be needed. No automatic single-dose schedule.'; }
      if (v.key === 'mmr') v.ruleText = 'Born 1969 or later: complete 2 documented doses at least 4 weeks apart. Requires live-vaccine eligibility clearance.';
      if (v.key === 'varicella') v.ruleText = 'No clinical infection/vaccination history: 2 doses at least 4 weeks apart. Confirm eligibility and live-vaccine clearance.';
      if (v.key === 'tetanus') {
        v.name = 'Tdap (Boostrix)';
        v.doses = c.tdap === 'primary' ? 3 : 1;
        v.ruleText = 'Unknown/incomplete primary history: complete 3 doses, minimum 4 weeks apart. Completed primary course: booster at 45 if fewer than 4 documented tetanus doses, and at 65.';
      }
      if (v.key === 'pneumovax23') v.ruleText = 'At least 8 weeks after PCV13. Age-specific boosters are calculated from actual/planned dates; record previous doses below.';
    });
  }
  function plan(vaccines, c) {
    const start = date(c.start), dob = date(c.dob), treatment = date(c.treatment);
    const visits = Array.from({length:10}, (_,i) => ({visit:i+1,date:add(start,i*4),items:[]}));
    const notes = [], liveDates = [], actual = new Map();
    const selected = vaccines.filter(v => v.selected);
    if (!start || Number.isNaN(+start) || !dob || Number.isNaN(+dob) || age(dob,start) < 18 || dob > start || c.scope !== 'yes') return {visits,carryOver:['Enter a valid first visit date, adult date of birth and confirm this factsheet applies. Children, stem-cell transplant recipients, and excluded cancer groups need their specific guidance.']};
    if (c.phase === 'before' && treatment && treatment <= start) return {visits,carryOver:['Treatment starts on or before the first visit: select the appropriate during-treatment stage.']};
    const warn = s => { if (!notes.includes(s)) notes.push(s); };
    const allByKey = key => vaccines.find(v => v.key === key);
    const recorded = v => v.doseHistory.slice(0,v.doses).map((done,i) => done ? date(v.doseDates[i]) : null);
    function historyOK(v) {
      let gap = false;
      for (let i=0;i<v.doses;i++) {
        if (!v.doseHistory[i]) { gap = true; continue; }
        const d = date(v.doseDates[i]);
        if (!d || Number.isNaN(+d) || d > start || d < dob || gap) {
          warn(`${v.name}: review missing, future, out-of-order or pre-birth history dates before scheduling.`); return false;
        }
        if (i && v.key !== 'pneumovax23') {
          const base = date(v.doseDates[v.spacingMode === 'fromDose1' ? 0 : i-1]);
          const interval = v.intervals[i-1];
          if (interval && d < add(base,interval.value,interval.unit)) { warn(`${v.name}: recorded interval is shorter than the selected schedule; clinical review required.`); return false; }
        }
      }
      return true;
    }
    let liveHistoryOK = true;
    vaccines.filter(v=>v.type==='live').forEach(v=> {
      if (!historyOK(v)) liveHistoryOK = false;
      recorded(v).filter(Boolean).forEach(d=>liveDates.push(d));
    });
    for (const a of liveDates) for (const b of liveDates) if (+a !== +b && Math.abs(a-b)<28*86400000) {liveHistoryOK=false;warn('Recorded live vaccines less than four weeks apart: clinical review required.');}
    function place(v, n, due) {
      if (!c.includeUnfunded && v.funded.includes('not funded')) {warn(`${v.name}: excluded by funding preference; remains recommended if eligible.`);return null;}
      const slot = visits.find(visit => visit.date >= due && visit.items.length < (c.maxFour ? 4 : Infinity) && (v.type !== 'live' || liveDates.every(d=>+d===+visit.date || Math.abs(visit.date-d)>=28*86400000)));
      if (!slot) { warn(`${v.name} dose ${n}: due ${fmt(due)}; outside available visits.`); return null; }
      if (v.type === 'live' && (!treatment || c.phase !== 'before' || c.liveClear !== 'yes' || !liveHistoryOK || add(slot.date,4)>treatment)) {warn(`${v.name} dose ${n}: not scheduled. Confirm live-vaccine suitability and a treatment start at least four weeks after vaccination.`);return null;}
      if (v.key === 'influenza' && n===2 && !c.includeUnfunded) {warn('Influenza dose 2: excluded by funding preference; prescription required.');return null;}
      let funding = v.funded;
      if (v.key==='influenza' && n===2) funding='Not funded; prescription required';
      if (v.key==='menacwy' && n===2) funding += '; prescription required';
      slot.items.push({name:v.name,doseLabel:`Dose ${n} of ${v.doses}`,type:v.type,funded:funding,isNotFunded:/not funded/i.test(funding),when:fmt(slot.date)});
      if (v.type==='live') liveDates.push(slot.date);
      if (treatment && slot.date >= treatment && v.type!=='live') warn(`${v.name}: vaccination falls during treatment; confirm regimen and expected response with the treating clinician.`);
      return slot.date;
    }
    let lastLive = null;
    for (const v of selected.filter(v=>!['prevenar13','pneumovax23'].includes(v.key)).sort((a,b)=>(b.type==='live')-(a.type==='live') || b.doses-a.doses)) {
      if (v.key==='covid19') {warn('COVID-19: assess current primary/additional/booster schedule using the Immunisation Handbook; no automatic dose generated.');continue;}
      if (v.key==='mmr' && dob.getFullYear()<1969) {warn('MMR: not routinely required for adults born before 1969 under this factsheet.');continue;}
      if (v.key==='varicella' && c.varicella!=='susceptible') {warn('Varicella: confirm no clinical infection or vaccination history before planning.');continue;}
      if (v.key==='hpv' && age(dob,start)>45) {warn('HPV: age outside this factsheet recommendation; review individually.');continue;}
      if (v.key==='tetanus' && c.tdap==='review') {warn('Tdap: select primary catch-up or an eligible age-based booster after reviewing history.');continue;}
      if (v.key==='tetanus' && c.tdap==='booster' && !(age(dob,start)===65 || (age(dob,start)===45 && c.tdapUnderFour==='yes'))) {warn('Tdap booster: confirm age 65, or age 45 with fewer than four documented tetanus-containing doses.');continue;}
      if (!historyOK(v)) continue;
      const dates = recorded(v);
      for (let i=0;i<v.doses;i++) {
        if (dates[i]) continue;
        let due = start;
        if (i) {
          const interval=v.intervals[i-1];
          due=add(dates[v.spacingMode==='fromDose1'?0:i-1],interval.value,interval.unit);
          // Retain a conservative four-month priming-to-booster gap if dose 2 was delayed.
          if(i===2 && v.spacingMode==='fromDose1') due=new Date(Math.max(+due,+add(dates[i-1],4,'months')));
        }
        if (v.type==='live' && c.liveRule==='separate' && lastLive && due<add(lastLive,4)) due=add(lastLive,4);
        dates[i]=place(v,i+1,due);
        if (!dates[i]) break;
      }
      if(v.type==='live') lastLive=dates.filter(Boolean).at(-1) || lastLive;
      actual.set(v.key,dates);
      const last=dates[v.doses-1];
      if (last && ['menacwy','bexsero'].includes(v.key)) warn(`${v.name}: booster recall ${fmt(add(last,60,'months'))}, then every five years; booster funding must be checked${v.key==='bexsero'?' for special-group eligibility':''}.`);
      if (v.key==='influenza') warn('Influenza: annual recall during the funded influenza programme.');
    }
    const pcv=allByKey('prevenar13'), ppv=allByKey('pneumovax23');
    if ((pcv?.selected || ppv?.selected) && historyOK(pcv) && historyOK(ppv)) {
      let pcvDate=recorded(pcv)[0];
      const ppvDates=recorded(ppv);
      const prior=ppvDates.filter(Boolean).at(-1);
      if (pcvDate && prior && pcvDate>prior && pcvDate<add(prior,12,'months')) {warn('Pneumococcal history: PCV13 given less than one year after PPV23; review before scheduling.');return {visits,carryOver:notes};}
      if (!pcvDate && pcv.selected) pcvDate=place(pcv,1,prior?add(prior,12,'months'):start);
      if (ppv.selected) {
        if (!ppvDates[0] && pcvDate) ppvDates[0]=place({...ppv,doses:age(dob,add(pcvDate,8))<60?3:2},1,add(pcvDate,8));
        if (!ppvDates[0]) warn('Pneumovax 23: requires a dated PCV13 dose or clinician review of the prior pneumococcal course.');
        else {
          const total=age(dob,ppvDates[0])<60?3:2;
          for(let i=1;i<total;i++) {
            let due=add(ppvDates[i-1],60,'months');
            if(i===2) due=new Date(Math.max(+due,+add(dob,65*12,'months')));
            if(pcvDate && pcvDate>ppvDates[i-1]) due=new Date(Math.max(+due,+add(pcvDate,8)));
            if(ppvDates[i]) {if(ppvDates[i]<due) {warn('Pneumovax 23: recorded booster is earlier than the age/interval rule; review.');break;} continue;}
            warn(`Pneumovax 23 dose ${i+1}${i===total-1?' (final)':''}: recall ${fmt(due)}.`);
            ppvDates[i]=due;
          }
        }
      }
    }
    if(!treatment && c.phase==='before') warn('Enter the planned treatment date to assess live-vaccine deadlines.');
    return {visits,carryOver:notes};
  }
  const api={add,age,configure,plan};
  if(typeof module!=='undefined') module.exports=api;
  root.BioSchedule=api;
})(typeof window==='undefined'?globalThis:window);
