(function () {
  'use strict';
  if (window.CEPSharedDefinitions) return;
  const normalize = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim();
  let records = [], adapter, index = new Map(), scheduled = false;
  function update(items) {
    records = items; index = new Map();
    for (const record of records) if (!record.disabled) index.set(normalize(record.concept || record.id), record);
    for (const record of records) if (!record.disabled) for (const alias of record.aliases || []) if (!index.has(normalize(alias))) index.set(normalize(alias), record);
    schedule();
  }
  const find = term => index.get(normalize(term));
  async function save(term, value, aliases) {
    if (!adapter) throw new Error('Open chatgptx and sign in first to enable shared definitions.');
    const existing = find(term);
    const concept = existing?.concept || term.trim();
    const clean = [...new Set(aliases.map(alias => alias.trim()).filter(Boolean))];
    for (const alias of [concept,...clean]) {
      const conflict = find(alias);
      if (conflict && conflict.id !== existing?.id && normalize(conflict.concept) !== normalize(concept)) throw new Error(`“${alias}” already belongs to “${conflict.concept}”.`);
    }
    await adapter.save(existing?.id || normalize(concept), { concept, value, valueHtml:'', aliases:clean, disabled:false });
  }
  async function remove(term) {
    if (!adapter) throw new Error('Sign in to chatgptx first.');
    const record = find(term); if (record) await adapter.remove(record.id);
  }
  function refresh() {
    scheduled = false;
    const scopes = document.querySelectorAll('.theme-pn .note-title,.note-content,.chatBubble,.universal-search-native-snippet,.cep-source-note-content,.cep-source-rich-content');
    for (const scope of scopes) {
      if (scope.closest('[contenteditable="true"],.editing-note')) continue;
      scope.querySelectorAll('.cep-shared-definition').forEach(word => word.replaceWith(...word.childNodes));
      scope.normalize();
      scope.querySelectorAll('.pn-definition').forEach(word => {
        const record = find(word.textContent);
        if (record) word.dataset.pnDefinition = record.value || plain(record.valueHtml);
        else if(records.some(item=>item.disabled&&[item.concept,...item.aliases||[]].some(term=>normalize(term)===normalize(word.textContent)))) word.replaceWith(...word.childNodes);
      });
      const aliases = [...index.keys()].sort((a,b)=>b.length-a.length);
      if (!aliases.length) continue;
      const escaped = aliases.map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
      const pattern = new RegExp(`(?<![\\p{L}\\p{N}_-])(${escaped.join('|')})(?![\\p{L}\\p{N}_-])`,'giu');
      const walker = document.createTreeWalker(scope,NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      const groups=[]; let group=[], block=null;
      const flush=()=>{if(group.length)groups.push(group);group=[];block=null;};
      while(walker.nextNode()){
        const node=walker.currentNode;
        if(node.nodeType===1){if(node.matches('br,img,hr,button,.pn-definition,script,style,textarea'))flush();continue;}
        const excluded=node.parentElement.closest('button,.pn-definition,script,style,textarea,[contenteditable="true"]');
        const link=node.parentElement.closest('a');
        if(excluded || (link && !link.matches('.universal-search-native-card,.cep-global-search-result') && scope.contains(link))){flush();continue;}
        const currentBlock=node.parentElement.closest('p,div,li,td,th,pre,blockquote')||scope;
        if(block&&block!==currentBlock)flush();block=currentBlock;group.push(node);
      }
      flush();
      for(const nodes of groups){
        const text=nodes.map(node=>node.nodeValue).join('');
        const point=offset=>{for(const node of nodes){if(offset<=node.nodeValue.length)return [node,offset];offset-=node.nodeValue.length;}};
        for(const match of [...text.matchAll(pattern)].reverse()){
          const record=find(match[0]);if(!record||(!record.value&&!record.valueHtml))continue;
          const start=point(match.index),end=point(match.index+match[0].length);if(!start||!end)continue;
          const range=document.createRange();range.setStart(...start);range.setEnd(...end);
          const word=document.createElement('span');word.className='cep-shared-definition';word.tabIndex=0;
          word.dataset.sharedTerm=record.concept;word.setAttribute('aria-label',`${match[0]}: ${record.value||plain(record.valueHtml)}`);
          word.append(range.extractContents());range.insertNode(word);
        }
      }
    }
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{observer.disconnect();refresh();observer.observe(document.body,{childList:true,subtree:true});},0);}
  function plain(html){const node=document.createElement('div');window.CEPSecurity?.setHTML(node,html||'');return node.textContent||'';}
  const style=document.createElement('style');style.textContent='.cep-shared-definition { text-decoration:underline dotted; text-underline-offset:3px; cursor:pointer; } #cep-shared-tip { position:fixed;z-index:2147483646;max-width:min(320px,calc(100vw - 24px));padding:12px;border-radius:12px;background:var(--clinical-panel,#fff);color:var(--theme-ink,#39353a);box-shadow:0 6px 22px #0002;font:12px/1.5 Tahoma,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere; } #cep-shared-tip[hidden]{display:none}';document.head.append(style);
  const tip=document.createElement('div');tip.id='cep-shared-tip';tip.hidden=true;tip.setAttribute('role','tooltip');document.body.append(tip);
  let hideTimer, activeWord;
  function hide(){clearTimeout(hideTimer);tip.hidden=true;activeWord=null;}
  const previewSelector = location.pathname.toLowerCase().endsWith('/pn.html') ? '.cep-shared-definition' : '.cep-shared-definition,.pn-definition[data-pn-definition]';
  function show(word){clearTimeout(hideTimer);const record=find(word.dataset.sharedTerm||word.textContent);const value=record?.value||plain(record?.valueHtml)||word.dataset.pnDefinition;if(!value)return;activeWord=word;tip.textContent=value;tip.hidden=false;const box=word.getBoundingClientRect();tip.style.left=Math.max(12,Math.min(box.left,innerWidth-tip.offsetWidth-12))+'px';tip.style.top=Math.max(12,Math.min(box.bottom+6,innerHeight-tip.offsetHeight-12))+'px';}
  document.addEventListener('mouseover',e=>{const word=e.target.closest(previewSelector);if(word)show(word);},true);
  document.addEventListener('mouseout',e=>{const word=e.target.closest(previewSelector);if(word&&!word.contains(e.relatedTarget)&&!tip.contains(e.relatedTarget)){clearTimeout(hideTimer);hideTimer=setTimeout(hide,200);}},true);
  document.addEventListener('focusin',e=>{if(e.target.matches(previewSelector))show(e.target);});
  document.addEventListener('click',e=>{const word=e.target.closest(previewSelector);if(word){e.preventDefault();e.stopPropagation();show(word);}else if(!tip.contains(e.target))tip.hidden=true;},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')tip.hidden=true;});
  tip.onmouseenter=()=>clearTimeout(hideTimer);tip.onmouseleave=e=>{if(!activeWord?.contains(e.relatedTarget))hide();};
  const observer=new MutationObserver(records=>{if(records.some(record=>!record.target.closest?.('#cep-shared-tip,#pn-definition-tip,#pn-definition-dialog')))schedule();});observer.observe(document.body,{childList:true,subtree:true});
  window.CEPSharedDefinitions={normalize,find,update,save,remove,connect(value){adapter=value;},plain};
})();
