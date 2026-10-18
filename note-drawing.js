(() => {
  'use strict';
  const W = 900, H = 500, MAX_POINTS = 6000;
  const editorSelector = '#noteInput, .editableNote';
  const drawingSelector = 'img.cep-note-drawing';
  const style = document.createElement('style');
  style.textContent = `
    #cepDrawingDialog { box-sizing:border-box; width:min(960px,calc(100vw - 20px)); max-height:calc(100dvh - 24px); padding:16px; border:1px solid var(--clinical-edge,#d8d5d1); border-radius:20px; background:linear-gradient(var(--clinical-field,#faf9f7),var(--clinical-field,#faf9f7)),#faf9f7; color:var(--theme-ink,#30383b); box-shadow:var(--note-editor-depth,0 12px 40px #0003); overflow:auto; overscroll-behavior:contain; }
    #cepDrawingDialog::backdrop { background:rgba(20,25,30,.42); }
    #cepDrawingDialog * { box-sizing:border-box; }
    #cepDrawingDialog .cep-drawing-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
    #cepDrawingDialog h2 { font:600 18px system-ui; margin:0; color:inherit; -webkit-text-fill-color:currentColor; }
    #cepDrawingDialog .cep-drawing-tools { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
    #cepDrawingDialog button { min-height:36px; padding:6px 12px; font:500 14px system-ui; cursor:pointer; }
    #cepDrawingDialog button[aria-pressed="true"] { outline:2px solid var(--quick-accent,#9a7d8b); outline-offset:1px; }
    #cepDrawingDialog label { display:flex; align-items:center; gap:6px; font:14px system-ui; }
    #cepDrawingDialog input[type="color"] { width:34px; height:34px; padding:2px; }
    #cepDrawingDialog input[type="range"] { width:80px; }
    #cepDrawingDialog canvas { display:block; width:100%; height:auto; aspect-ratio:9 / 5; background:#fff; border:1px solid #ccc; border-radius:8px; touch-action:none; cursor:crosshair; }
    #cepDrawingDialog .cep-drawing-footer { display:flex; justify-content:flex-end; align-items:center; flex-wrap:wrap; gap:10px; margin-top:12px; }
    #cepDrawingStatus { flex:1; min-width:130px; font:13px system-ui; color:inherit; }
    img.cep-note-drawing { display:block; max-width:100%; height:auto; margin:8px 0; background:transparent; border:0; box-shadow:none; }
    :is(#noteInput,.editableNote) img.cep-note-drawing { cursor:pointer; outline:none; }
    @media(max-width:600px) { #cepDrawingDialog { padding:12px; } #cepDrawingDialog button { padding:6px 9px; } }
  `;
  document.head.append(style);
  const dialog = document.createElement('dialog');
  dialog.id = 'cepDrawingDialog';
  dialog.setAttribute('aria-labelledby', 'cepDrawingTitle');
  dialog.innerHTML = `<div class="cep-drawing-header"><h2 id="cepDrawingTitle">Draw in your note</h2><button type="button" data-action="cancel" aria-label="Close drawing">×</button></div>
    <div class="cep-drawing-tools" role="toolbar" aria-label="Drawing tools">
      <button type="button" data-tool="arrow" aria-pressed="true"><svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 17 17 3M6 3h11v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Arrow</button>
      <button type="button" data-tool="move" aria-pressed="false">Move</button>
      <button type="button" data-tool="pen" aria-pressed="false">✎ Pen</button>
      <button type="button" data-tool="erase" aria-pressed="false">Eraser</button>
      <button type="button" data-action="undo" disabled>Undo</button>
      <label>Colour <input type="color" value="#35424d" aria-label="Drawing colour"></label>
      <label>Width <input type="range" min="2" max="10" value="3" aria-label="Line width"></label>
    </div>
    <canvas width="900" height="500" aria-label="Drawing area. Drag to draw an arrow or a pen stroke."></canvas>
    <div class="cep-drawing-footer"><span id="cepDrawingStatus" role="status">Drag to draw an arrow.</span><button type="button" data-action="cancel">Cancel</button><button type="button" data-action="apply">Add drawing</button></div>`;
  document.body.append(dialog);
  const canvas = dialog.querySelector('canvas'), ctx = canvas.getContext('2d');
  const status = dialog.querySelector('#cepDrawingStatus');
  const apply = dialog.querySelector('[data-action="apply"]');
  const undo = dialog.querySelector('[data-action="undo"]');
  let editor = null, target = null, strokes = [], history = [], active = null, tool = 'arrow', dirty = false, selected = -1, returnRange = null;
  const clone = value => JSON.parse(JSON.stringify(value));
  const pointCount = () => strokes.reduce((n,s) => n + s.points.length, 0);
  function valid(raw) {
    if (!raw || raw.v !== 1 || !Array.isArray(raw.strokes) || raw.strokes.length > 500) return null;
    let count = 0;
    const result = [];
    for (const s of raw.strokes) {
      if (!s || !['arrow','pen'].includes(s.tool) || !/^#[0-9a-f]{6}$/i.test(s.colour) || !Number.isFinite(s.width) || s.width < 2 || s.width > 10 || !Array.isArray(s.points) || !s.points.length) return null;
      const points = [];
      for (const p of s.points) {
        if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite) || p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H || ++count > MAX_POINTS) return null;
        points.push(p);
      }
      if (s.tool === 'arrow' && points.length !== 2) return null;
      result.push({tool:s.tool,colour:s.colour,width:s.width,points});
    }
    return result;
  }
  function paintStroke(s) {
    ctx.strokeStyle = ctx.fillStyle = s.colour;
    ctx.lineWidth = s.width; ctx.lineCap = ctx.lineJoin = 'round';
    const a = s.points[0], end = s.points[s.points.length - 1];
    ctx.beginPath(); ctx.moveTo(...a);
    for (const p of s.points.slice(1)) ctx.lineTo(...p);
    if (s.points.length === 1) ctx.lineTo(a[0] + .1, a[1]);
    ctx.stroke();
    if (s.tool === 'arrow') {
      const angle = Math.atan2(end[1]-a[1], end[0]-a[0]), size = Math.max(14,s.width*4);
      ctx.beginPath();ctx.moveTo(...end);
      ctx.lineTo(end[0]-size*Math.cos(angle-.45),end[1]-size*Math.sin(angle-.45));
      ctx.lineTo(end[0]-size*Math.cos(angle+.45),end[1]-size*Math.sin(angle+.45));ctx.closePath();ctx.fill();
    }
  }
  function render(showSelection=true) {
    ctx.clearRect(0,0,W,H);
    strokes.forEach(paintStroke);
    if (active?.stroke) paintStroke(active.stroke);
    if(showSelection && tool==='move' && strokes[selected]) {
      const s=strokes[selected];ctx.fillStyle='#4384c5';ctx.strokeStyle='#fff';ctx.lineWidth=2;
      for(const p of [s.points[0],s.points.at(-1)]){ctx.beginPath();ctx.arc(p[0],p[1],5,0,Math.PI*2);ctx.fill();ctx.stroke();}
    }
    undo.disabled = !history.length;
    apply.textContent=target?(strokes.length?'Update drawing':'Remove drawing'):'Add drawing';
  }
  function setTool(value) {
    tool = value;selected=-1;canvas.style.cursor=tool==='move'?'grab':'crosshair';
    dialog.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.tool === tool)));
    status.textContent = tool === 'arrow' ? 'Drag to draw an arrow.' : tool === 'pen' ? 'Draw freely with your finger, stylus, or mouse.' : tool==='move' ? 'Drag an arrow or pen stroke to move it.' : 'Touch or drag across a stroke to erase it.';
    render();
  }
  function remember() { history.push(clone(strokes)); if(history.length>30)history.shift(); }
  function position(e) { const r=canvas.getBoundingClientRect();return [Math.round(Math.max(0,Math.min(W,(e.clientX-r.left)*W/r.width))*10)/10,Math.round(Math.max(0,Math.min(H,(e.clientY-r.top)*H/r.height))*10)/10]; }
  function distance(p,a,b) {const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)):0;return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}
  function hit(p) {
    const tolerance=12*W/canvas.getBoundingClientRect().width;
    for(let i=strokes.length-1;i>=0;i--){const s=strokes[i];if(s.points.some((a,j)=>distance(p,a,s.points[j+1]||a)<tolerance+s.width/2))return i;}
    return -1;
  }
  function erase(p) {
    const tolerance = 14*W/canvas.getBoundingClientRect().width;
    const next=strokes.filter(s=>!s.points.some((a,i)=>distance(p,a,s.points[i+1]||a)<tolerance+s.width/2));
    if(next.length!==strokes.length){strokes=next;active.changed=true;render();}
  }
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0 || active)return;
    e.preventDefault(); canvas.setPointerCapture(e.pointerId);
    const p=position(e);
    if(tool==='move'){selected=hit(p);if(selected>=0){active={id:e.pointerId,before:clone(strokes),origin:p,moveIndex:selected,changed:false};canvas.style.cursor='grabbing';}render();return;}
    if(tool==='erase'){active={id:e.pointerId,before:clone(strokes),changed:false};erase(p);return;}
    if(pointCount()+(tool==='arrow'?2:1)>MAX_POINTS||strokes.length>=500){status.textContent='Drawing is full. Remove a stroke or add another section.';return;}
    active={id:e.pointerId,stroke:{tool,colour:dialog.querySelector('[type="color"]').value,width:Number(dialog.querySelector('[type="range"]').value),points:tool==='arrow'?[p,p]:[p]}};render();
  });
  canvas.addEventListener('pointermove',e=>{
    if(active?.id!==e.pointerId)return;e.preventDefault();const p=position(e);
    if(tool==='move'){
      const original=active.before[active.moveIndex],xs=original.points.map(p=>p[0]),ys=original.points.map(p=>p[1]);
      const dx=Math.max(-Math.min(...xs),Math.min(W-Math.max(...xs),p[0]-active.origin[0]));
      const dy=Math.max(-Math.min(...ys),Math.min(H-Math.max(...ys),p[1]-active.origin[1]));
      strokes[active.moveIndex]={...original,points:original.points.map(a=>[Math.round((a[0]+dx)*10)/10,Math.round((a[1]+dy)*10)/10])};
      active.changed=dx!==0||dy!==0;render();return;
    }
    if(tool==='erase'){erase(p);return;}
    const s=active.stroke;
    if(s.tool==='arrow')s.points[1]=p;
    else if(pointCount()+s.points.length<MAX_POINTS&&Math.hypot(p[0]-s.points.at(-1)[0],p[1]-s.points.at(-1)[1])>1.5)s.points.push(p);
    render();
  });
  function finish(e,cancel=false){
    if(active?.id!==e.pointerId)return;
    if(cancel){if(active.before)strokes=active.before;}
    else if(active.stroke){const s=active.stroke;if(s.tool!=='arrow'||Math.hypot(s.points[1][0]-s.points[0][0],s.points[1][1]-s.points[0][1])>4){remember();strokes.push(s);dirty=true;}}
    else if(active.changed){history.push(active.before);if(history.length>30)history.shift();dirty=true;}
    active=null;if(tool==='move')canvas.style.cursor='grab';render();
  }
  canvas.addEventListener('pointerup',e=>finish(e));
  canvas.addEventListener('pointercancel',e=>finish(e,true));
  function close(discard=true) {
    if(discard&&dirty&&!window.confirm('Discard changes to this drawing?'))return;
    dialog.close();const previous=editor,range=returnRange;editor=null;target=null;active=null;returnRange=null;
    if(previous?.isConnected){
      previous.focus({preventScroll:true});
      const caret=range&&previous.contains(range.commonAncestorContainer)?range:document.createRange();
      if(caret!==range){caret.selectNodeContents(previous);caret.collapse(false);}
      const sel=window.getSelection();sel.removeAllRanges();sel.addRange(caret);
      previous.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
    }
  }
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.tool){setTool(button.dataset.tool);return;}
    if(button.dataset.action==='cancel'){close();return;}
    if(button.dataset.action==='undo'){if(history.length){strokes=history.pop();selected=-1;dirty=true;render();}return;}
    if(button.dataset.action==='apply')save();
  });
  function open(host,image=null) {
    if(dialog.open)return;
    editor=host;target=image;returnRange=null;selected=-1;
    const sel=window.getSelection();if(sel?.rangeCount&&host.contains(sel.anchorNode))returnRange=sel.getRangeAt(0).cloneRange();
    strokes=[];
    if(image){try{strokes=valid(JSON.parse(image.getAttribute('data-cep-drawing')))||[];}catch{strokes=[];}}
    history=[];active=null;dirty=false;setTool(image?'move':'arrow');render();
    apply.textContent=image?'Update drawing':'Add drawing';dialog.showModal();
  }
  function save() {
    if(active){status.textContent='Finish the current stroke first.';return;}
    if(!editor?.isConnected){close(false);return;}
    if(!strokes.length){if(target){target.remove();editor.dispatchEvent(new Event('input',{bubbles:true}));dirty=false;close(false);}else status.textContent='Draw an arrow or a pen stroke first.';return;}
    render(false);
    const points=strokes.flatMap(s=>s.points),padding=44;
    const left=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0]))-padding)),top=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1]))-padding));
    const right=Math.min(W,Math.ceil(Math.max(...points.map(p=>p[0]))+padding)),bottom=Math.min(H,Math.ceil(Math.max(...points.map(p=>p[1]))+padding));
    const output=document.createElement('canvas');output.width=right-left;output.height=bottom-top;
    output.getContext('2d').drawImage(canvas,left,top,output.width,output.height,0,0,output.width,output.height);render();
    const image=document.createElement('img');image.className='cep-note-drawing';image.alt='Hand-drawn arrows and flowchart';
    image.src=output.toDataURL('image/png');image.setAttribute('data-cep-drawing',JSON.stringify({v:1,strokes}));
    image.width=output.width;image.height=output.height;image.style.cssText='display:block;max-width:100%;height:auto;margin:8px 0;background:transparent;border:0;';
    const bytes=new TextEncoder().encode(image.outerHTML).length;
    if(bytes>240000||new TextEncoder().encode(editor.innerHTML).length-(target?new TextEncoder().encode(target.outerHTML).length:0)+bytes>800000){status.textContent='This drawing is too large for the note. Undo some strokes and try again.';return;}
    if(target)target.replaceWith(image);
    else {
      // Use a separate block so drawing never covers or reflows typed lines.
      const block=document.createElement('div');block.append(image);
      const paragraph=document.createElement('div');paragraph.append(document.createElement('br'));
      editor.append(block,paragraph);
      returnRange=document.createRange();returnRange.setStart(paragraph,0);returnRange.collapse(true);
    }
    editor.dispatchEvent(new Event('input',{bubbles:true}));dirty=false;close(false);
  }
  const attached=new WeakSet();
  function attach(){
    document.querySelectorAll(editorSelector).forEach(host=>{
      if(attached.has(host))return;
      const actions=host.id==='noteInput'?document.querySelector('.new-note-actions'):host.closest('.note-format-shell')?.nextElementSibling||host.nextElementSibling;
      if(!actions?.classList.contains('note-editor-actions'))return;
      const button=document.createElement('button');button.type='button';button.className='cep-drawing-trigger';button.textContent='✎';button.title='Add drawing section';button.setAttribute('aria-label','Add drawing section');
      button.addEventListener('mousedown',e=>e.preventDefault());button.addEventListener('click',()=>open(host));actions.prepend(button);attached.add(host);
    });
  }
  // Window capture precedes the page's generic image resize controls.
  window.addEventListener('click',e=>{const image=e.target.closest?.(drawingSelector),host=image?.closest(editorSelector);if(!host)return;e.preventDefault();e.stopImmediatePropagation();open(host,image);},true);
  new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});attach();
})();
