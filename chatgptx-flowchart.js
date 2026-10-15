(() => {
  'use strict';
  const prefix = 'CEP-FLOWCHART-1:';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  let editor, insertion, original, model, selected, history = [], drag, zoom = 1;
  const attached = new WeakMap();
  const style = document.createElement('style');
  style.textContent = `
  .cep-flow-dialog{box-sizing:border-box;width:min(1050px,96vw);max-height:92dvh;overflow:auto;border:1px solid #fff;border-radius:22px;padding:20px;background:var(--clinical-panel,#eef0f5);color:var(--theme-ink,#303746);font-family:Arial,sans-serif;box-shadow:0 16px 55px #26304440}
  .cep-flow-dialog::backdrop{background:#20263866;backdrop-filter:blur(5px)}
  .cep-flow-dialog h2{margin:0;font-size:22px}.cep-flow-dialog header{display:flex;align-items:center;justify-content:space-between;background:transparent!important;position:static!important;padding:0!important;box-shadow:none!important}
  .cep-flow-dialog button,.cep-flow-dialog input,.cep-flow-dialog select{font:inherit;color:inherit;box-sizing:border-box;min-height:36px;padding:7px 10px;border:1px solid #9ba8bb;border-radius:9px;background:var(--clinical-field,#fafbfe)}
  .cep-flow-tools,.cep-flow-footer{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:14px 0}.cep-flow-footer{justify-content:flex-end}.cep-flow-help{font-size:12px;flex:1;min-width:160px}
  .cep-flow-layout{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:12px}.cep-flow-canvas{min-width:0;border:1px solid #bac6d9;border-radius:14px;overflow:auto;background:#f8faff}
  .cep-flow-canvas svg{display:block;width:var(--cep-flow-zoom,100%);max-width:none;height:auto;user-select:none}.cep-flow-canvas [data-node]{cursor:grab;touch-action:none}.cep-flow-fields{display:flex;flex-direction:column;gap:10px}.cep-flow-fields label{font-size:13px;display:flex;flex-direction:column;gap:4px}.cep-flow-fields input,.cep-flow-fields select{width:100%}
  .cep-flow-status{font-size:13px;min-height:18px}.cep-flow-dialog button:disabled{opacity:.45}.cep-flow-add{font-size:14px!important}img.cep-flowchart{display:block;max-width:100%;height:auto;cursor:pointer;border-radius:12px}
  @media(max-width:600px){.cep-flow-dialog{padding:12px}.cep-flow-layout{grid-template-columns:1fr}.cep-flow-fields{display:grid;grid-template-columns:1fr 1fr}.cep-flow-dialog button{font-size:13px}}
  `;
  document.head.append(style);
  const dialog = document.createElement('dialog');
  dialog.className = 'cep-flow-dialog';
  dialog.setAttribute('aria-label','Flowchart builder');
  dialog.innerHTML = `<header><h2>Flowchart</h2><button type="button" data-action="close" aria-label="Close flowchart">×</button></header>
    <div class="cep-flow-tools"><button type="button" data-action="step">＋ Step</button><button type="button" data-action="decision">◇ Decision</button><button type="button" data-action="undo">↶ Undo</button><button type="button" data-action="delete">Delete selected</button><button type="button" data-action="zoom-in" aria-label="Zoom in">＋ Zoom</button><button type="button" data-action="zoom-out" aria-label="Zoom out">− Zoom</button></div>
    <div class="cep-flow-layout"><div class="cep-flow-canvas"></div><aside class="cep-flow-fields">
      <label>Selected shape<input id="cep-flow-text" maxlength="160" placeholder="Click a shape"></label>
      <label>From<select id="cep-flow-from"></select></label><label>To<select id="cep-flow-to"></select></label>
      <label>Arrow label<input id="cep-flow-label" maxlength="30" placeholder="Yes / No (optional)"></label><button type="button" data-action="connect">Connect / update</button><button type="button" data-action="disconnect">Remove connection</button>
    </aside></div><p class="cep-flow-status" role="status"></p><div class="cep-flow-footer"><span class="cep-flow-help">Drag shapes to arrange · Select a shape to edit its text</span><button type="button" data-action="close">Cancel</button><button type="button" data-action="insert">Insert into note</button></div>`;
  document.body.append(dialog);
  const field = id => dialog.querySelector('#cep-flow-'+id);
  const canvas = dialog.querySelector('.cep-flow-canvas');
  const status = message => { dialog.querySelector('.cep-flow-status').textContent = message; };
  const snapshot = () => { history.push(JSON.stringify(model)); if(history.length>30)history.shift(); };
  function validate(value) {
    if (!value || !Array.isArray(value.nodes) || !Array.isArray(value.edges) || value.nodes.length>40 || value.edges.length>80) throw Error('Invalid flowchart');
    const nodes = value.nodes.map(n => ({id:String(n.id).slice(0,50),type:n.type==='decision'?'decision':'step',text:String(n.text).slice(0,160),x:Math.max(115,Math.min(885,Number(n.x)||500)),y:Math.max(65,Math.min(695,Number(n.y)||100))}));
    if(new Set(nodes.map(n=>n.id)).size!==nodes.length)throw Error('Invalid shapes');
    const edges=value.edges.filter(e=>nodes.some(n=>n.id===e.from)&&nodes.some(n=>n.id===e.to)&&e.from!==e.to).map(e=>({from:e.from,to:e.to,label:String(e.label||'').slice(0,30)}));
    return {nodes,edges};
  }
  function svg() {
    const edges=model.edges.map((e,i)=>{const a=model.nodes.find(n=>n.id===e.from),b=model.nodes.find(n=>n.id===e.to);const horizontal=Math.abs(b.x-a.x)>Math.abs(b.y-a.y);let x1=a.x,y1=a.y,x2=b.x,y2=b.y;
      if(horizontal){x1+=Math.sign(b.x-a.x)*110;x2-=Math.sign(b.x-a.x)*110;}else{y1+=Math.sign(b.y-a.y)*(a.type==='decision'?60:34);y2-=Math.sign(b.y-a.y)*(b.type==='decision'?60:34);}
      const mid=horizontal?(x1+x2)/2:(y1+y2)/2;
      const path=horizontal?`M${x1},${y1} H${mid} V${y2} H${x2}`:`M${x1},${y1} V${mid} H${x2} V${y2}`;
      return `<g><path d="${path}" fill="none" stroke="#455876" stroke-width="2" marker-end="url(#cep-flow-arrow)"/><text x="${(x1+x2)/2}" y="${(y1+y2)/2-9}" text-anchor="middle" font-size="15" fill="#34445e" stroke="#f8faff" stroke-width="4" paint-order="stroke">${esc(e.label)}</text></g>`;}).join('');
    const nodes=model.nodes.map(n=>{const stroke=n.id===selected?'#2563be':n.type==='decision'?'#9d86c0':'#8daecc';const shape=n.type==='decision'?`<polygon points="0,-60 110,0 0,60 -110,0" fill="#eeebf8" stroke="${stroke}" stroke-width="2"/>`:`<rect x="-110" y="-34" width="220" height="68" rx="14" fill="#e6eff8" stroke="${stroke}" stroke-width="2"/>`;
      const words=n.text.split(/\s+/),lines=[''];words.forEach(word=>{let last=lines.length-1;if((lines[last]+' '+word).trim().length>22&&lines[last])lines.push(word);else lines[last]=(lines[last]+' '+word).trim();});const visible=lines.slice(0,4);if(lines.length>4)visible[3]+='…';return `<g data-node="${esc(n.id)}" transform="translate(${n.x} ${n.y})">${shape}<text text-anchor="middle" fill="#293b55" font-family="Arial,sans-serif" font-size="16">${visible.map((line,i)=>`<tspan x="0" y="${(i-(visible.length-1)/2)*18+5}">${esc(line)}</tspan>`).join('')}</text></g>`;}).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 760" width="1000" height="760"><rect width="1000" height="760" fill="#f8faff"/><defs><marker id="cep-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill="#455876"/></marker></defs>${edges}${nodes}</svg>`;
  }
  function render() {
    canvas.innerHTML=svg();
    for(const key of ['from','to']){const previous=field(key).value;field(key).replaceChildren(...model.nodes.map(n=>{const o=document.createElement('option');o.value=n.id;o.textContent=n.text||'Untitled';return o;}));if(model.nodes.some(n=>n.id===previous))field(key).value=previous;}
    const n=model.nodes.find(n=>n.id===selected);field('text').value=n?.text||'';field('text').disabled=!n;
    dialog.querySelector('[data-action="undo"]').disabled=!history.length;
    dialog.querySelector('[data-action="delete"]').disabled=!n;
  }
  function open(target, image=null) {
    editor=target;original=image;insertion=null;const selection=getSelection();if(selection?.rangeCount&&editor.contains(selection.getRangeAt(0).commonAncestorContainer))insertion=selection.getRangeAt(0).cloneRange();
    try{model=image?validate(JSON.parse(image.title.slice(prefix.length))):{nodes:[{id:'start',type:'step',text:'Start',x:500,y:110},{id:'review',type:'step',text:'Review information',x:500,y:280},{id:'question',type:'decision',text:'More information needed?',x:500,y:480}],edges:[{from:'start',to:'review',label:''},{from:'review',to:'question',label:''}]};}catch{alert('This flowchart could not be reopened.');return;}
    selected=null;history=[];zoom=1;canvas.style.setProperty('--cep-flow-zoom','100%');status('');render();dialog.querySelector('[data-action="insert"]').textContent=image?'Update chart':'Insert into note';dialog.showModal();
  }
  field('text').addEventListener('focus',()=>snapshot());
  field('text').addEventListener('input',()=>{const n=model.nodes.find(n=>n.id===selected);if(!n)return;n.text=field('text').value;canvas.innerHTML=svg();});
  field('text').addEventListener('change',render);
  canvas.addEventListener('pointerdown',event=>{const node=event.target.closest('[data-node]');if(!node)return;event.preventDefault();selected=node.dataset.node;const svgEl=canvas.querySelector('svg');const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(svgEl.getScreenCTM().inverse());const n=model.nodes.find(n=>n.id===selected);snapshot();drag={id:selected,dx:point.x-n.x,dy:point.y-n.y};canvas.setPointerCapture(event.pointerId);render();});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(canvas.querySelector('svg').getScreenCTM().inverse());const n=model.nodes.find(n=>n.id===drag.id);n.x=Math.max(115,Math.min(885,point.x-drag.dx));n.y=Math.max(65,Math.min(695,point.y-drag.dy));canvas.innerHTML=svg();});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{drag=null;});
  dialog.addEventListener('click',async event=>{event.stopPropagation();const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;status('');
    if(action==='zoom-in'||action==='zoom-out'){zoom=Math.max(1,Math.min(3,zoom+(action==='zoom-in'?.5:-.5)));canvas.style.setProperty('--cep-flow-zoom',`${zoom*100}%`);return;}
    if(action==='close'){dialog.close();return;}
    if(action==='undo'){if(history.length){model=JSON.parse(history.pop());selected=null;render();}return;}
    if(action==='step'||action==='decision'){if(model.nodes.length>=40){status('Maximum 40 shapes per chart.');return;}snapshot();selected=crypto.randomUUID?.()||`shape-${Date.now()}-${Math.random().toString(36).slice(2)}`;model.nodes.push({id:selected,type:action,text:action==='step'?'New step':'Question?',x:180+(model.nodes.length%3)*310,y:130+(Math.floor(model.nodes.length/3)%4)*165});render();return;}
    if(action==='delete'){snapshot();model.nodes=model.nodes.filter(n=>n.id!==selected);model.edges=model.edges.filter(e=>e.from!==selected&&e.to!==selected);selected=null;render();return;}
    if(action==='disconnect'){snapshot();model.edges=model.edges.filter(e=>e.from!==field('from').value||e.to!==field('to').value);render();return;}
    if(action==='connect'){const from=field('from').value,to=field('to').value;if(!from||!to||from===to){status('Choose two different shapes.');return;}if(model.edges.length>=80){status('Maximum 80 connections.');return;}snapshot();const edge=model.edges.find(e=>e.from===from&&e.to===to);if(edge)edge.label=field('label').value;else model.edges.push({from,to,label:field('label').value});render();return;}
    if(action==='insert'){
      if(!model.nodes.length){status('Add a shape first.');return;}const button=event.target;button.disabled=true;
      try{selected=null;const source=svg();const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(source);});const output=document.createElement('canvas');output.width=1000;output.height=760;output.getContext('2d').drawImage(image,0,0);const src=output.toDataURL('image/png');if(src.length>350000)throw Error('Chart is too large. Please use fewer shapes.');
        if(!editor.isConnected)throw Error('The note editor was closed. Reopen it and try again.');const chart=document.createElement('img');chart.className='cep-flowchart';chart.src=src;chart.alt='Flowchart: '+model.nodes.map(n=>n.text).join(' → ');chart.title=prefix+JSON.stringify(model);chart.style.cssText='max-width:100%;height:auto;display:block';
        if(original?.isConnected)original.replaceWith(chart);else{editor.focus();const range=insertion||document.createRange();if(!insertion){range.selectNodeContents(editor);range.collapse(false);}range.deleteContents();range.insertNode(chart);range.setStartAfter(chart);range.collapse(true);getSelection().removeAllRanges();getSelection().addRange(range);}
        editor.dispatchEvent(new Event('input',{bubbles:true}));dialog.close();editor.focus();
      }catch(error){status(error.message||'Could not create the chart. Please try again.');}finally{button.disabled=false;}
    }
  });
  dialog.addEventListener('cancel',event=>event.stopPropagation());
  // Keep clicks in the modal from reaching page-level image/close handlers.
  dialog.addEventListener('pointerdown',event=>event.stopPropagation());
  function attach() {
    document.querySelectorAll('#noteInput[contenteditable="true"],.editableNote[contenteditable="true"]').forEach(target=>{
      const host=target.closest('.note-format-shell')||target.parentElement;if(attached.get(target)?.isConnected)return;
      const button=document.createElement('button');button.type='button';button.className='cep-flow-add';button.textContent='◇ Flowchart';button.title='Insert a flowchart';
      button.addEventListener('mousedown',event=>event.preventDefault());button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();open(target);});
      attached.set(target,button);
      const toolbar=target.id==='noteInput'?document.querySelector('.new-note-actions'):host.querySelector('.note-icon-actions,.cep-pn-editor-toolbar');(toolbar||host).append(button);
    });
  }
  document.addEventListener('click',event=>{const image=event.target.closest('img.cep-flowchart');if(!image?.title.startsWith(prefix))return;const target=image.closest('#noteInput[contenteditable="true"],.editableNote[contenteditable="true"]');if(!target)return;event.preventDefault();event.stopImmediatePropagation();open(target,image);},true);
  let queued=false;new MutationObserver(records=>{if(records.every(r=>dialog.contains(r.target)))return;if(!queued){queued=true;queueMicrotask(()=>{queued=false;attach();});}}).observe(document.body,{childList:true,subtree:true});attach();
})();
