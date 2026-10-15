(() => {
  'use strict';
  const PREFIX='CEP-NOTE-ARROW-1:', EDITORS='#noteInput[contenteditable="true"],.editableNote[contenteditable="true"]';
  let selected=null,drag=null,frame=0;
  const style=document.createElement('style');
  style.textContent=`img.cep-note-arrow{display:inline-block!important;vertical-align:middle;max-width:100%;height:auto;cursor:move;user-select:none;touch-action:none} .cep-arrow-tools{position:fixed;inset:0;pointer-events:none;z-index:2147483640} html:root:root:root:root:root:root:root body .cep-arrow-tools:not(#cep-arrow-unused) button{position:absolute;pointer-events:auto;touch-action:none;box-sizing:border-box;width:24px!important;height:24px!important;min-height:0!important;min-width:0!important;padding:0!important;border:2px solid white!important;border-radius:50%!important;background:#507cac!important;color:white!important;-webkit-text-fill-color:white!important;box-shadow:0 0 0 1px #507cac!important;font:16px/20px Arial,sans-serif!important} .cep-arrow-tools svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none} .cep-arrow-help{position:absolute;max-width:260px;padding:5px 8px;border-radius:7px;background:#f5f7fb;color:#33465d;font:12px/1.3 Arial,sans-serif;box-shadow:0 1px 5px #29384c30} .cep-arrow-add{font-size:14px!important}`;
  document.head.append(style);
  const tools=document.createElement('div');tools.className='cep-arrow-tools';tools.hidden=true;
  tools.innerHTML='<svg></svg><button type="button" data-end="start" aria-label="Drag arrow tail to rotate or resize"></button><button type="button" data-end="end" aria-label="Drag arrow tip to rotate or resize"></button><button type="button" data-delete aria-label="Delete arrow">×</button><span class="cep-arrow-help">Drag either dot to rotate or resize · Drag the arrow to move</span>';
  document.body.append(tools);
  function data(img){try{const value=JSON.parse(img.title.slice(PREFIX.length));return{dx:Math.max(-700,Math.min(700,Number.isFinite(Number(value.dx))?Number(value.dx):160)),dy:Math.max(-700,Math.min(700,Number(value.dy)||0))};}catch{return{dx:160,dy:0};}}
  function geometry(vector){return{width:Math.abs(vector.dx)+32,height:Math.abs(vector.dy)+32,x:vector.dx<0?16-vector.dx:16,y:vector.dy<0?16-vector.dy:16};}
  function paint(img,vector){
    const g=geometry(vector),canvas=document.createElement('canvas');canvas.width=Math.ceil(g.width*2);canvas.height=Math.ceil(g.height*2);const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.strokeStyle='#405975';ctx.fillStyle='#405975';ctx.shadowColor='rgba(255,255,255,.9)';ctx.shadowBlur=3;ctx.lineWidth=3;ctx.lineCap='round';
    const x=g.x+vector.dx,y=g.y+vector.dy,angle=Math.atan2(vector.dy,vector.dx);ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(x,y);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-13*Math.cos(angle-.45),y-13*Math.sin(angle-.45));ctx.lineTo(x-13*Math.cos(angle+.45),y-13*Math.sin(angle+.45));ctx.closePath();ctx.fill();
    img.src=canvas.toDataURL('image/png');img.title=PREFIX+JSON.stringify(vector);img.alt='Arrow';img.width=Math.ceil(g.width);img.height=Math.ceil(g.height);img.style.cssText='display:inline-block;vertical-align:middle;max-width:100%;height:auto';img.draggable=false;
  }
  function points(img){const v=data(img),g=geometry(v),r=img.getBoundingClientRect();return{start:{x:r.left+g.x*r.width/g.width,y:r.top+g.y*r.height/g.height},end:{x:r.left+(g.x+v.dx)*r.width/g.width,y:r.top+(g.y+v.dy)*r.height/g.height},scale:r.width/g.width,rect:r};}
  function hide(){selected=null;tools.hidden=true;tools.querySelector('svg').replaceChildren();}
  function position(){if(!selected?.isConnected){hide();return;}const p=points(selected);for(const key of ['start','end']){const b=tools.querySelector(`[data-end="${key}"]`);b.style.left=p[key].x-12+'px';b.style.top=p[key].y-12+'px';}const del=tools.querySelector('[data-delete]');del.style.left=Math.min(innerWidth-28,Math.max(2,p.rect.right+4))+'px';del.style.top=Math.max(2,p.rect.top-10)+'px';const help=tools.querySelector('.cep-arrow-help');help.style.left=Math.max(5,Math.min(innerWidth-265,p.rect.left))+'px';help.style.top=Math.max(5,Math.min(innerHeight-50,p.rect.bottom+14))+'px';tools.hidden=false;}
  function notify(editor){editor?.dispatchEvent(new Event('input',{bubbles:true}));}
  function select(img){selected=img;position();}
  function add(editor,range){const img=document.createElement('img');img.className='cep-note-arrow';paint(img,{dx:160,dy:0});if(range&&editor.contains(range.commonAncestorContainer)){range.deleteContents();range.insertNode(img);}else editor.append(img);notify(editor);select(img);}
  document.addEventListener('pointerdown',event=>{const img=event.target.closest?.('img.cep-note-arrow');if(img?.title.startsWith(PREFIX)&&img.closest(EDITORS)){event.preventDefault();event.stopImmediatePropagation();select(img);drag={kind:'move',img,editor:img.closest(EDITORS),x:event.clientX,y:event.clientY,moved:false};return;}if(!event.target.closest?.('.cep-arrow-tools,.cep-arrow-add'))hide();},true);
  tools.addEventListener('pointerdown',event=>{const button=event.target.closest('[data-end]');if(!button||!selected)return;event.preventDefault();event.stopPropagation();const p=points(selected),end=button.dataset.end;drag={kind:'resize',img:selected,editor:selected.closest(EDITORS),end,anchor:p[end==='end'?'start':'end'],scale:p.scale,start:p.start,finish:p.end};button.setPointerCapture(event.pointerId);});
  document.addEventListener('pointermove',event=>{if(!drag)return;if(drag.kind==='move'){if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>6)drag.moved=true;return;}event.preventDefault();drag.pointer={x:event.clientX,y:event.clientY};if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(!drag?.pointer)return;const a=drag.end==='end'?drag.anchor:drag.pointer,b=drag.end==='end'?drag.pointer:drag.anchor;tools.querySelector('svg').innerHTML=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#507cac" stroke-width="3"/>`;});},{passive:false});
  document.addEventListener('pointerup',event=>{if(!drag)return;const operation=drag;drag=null;
    if(operation.kind==='resize'){const x=(event.clientX-operation.anchor.x)/operation.scale,y=(event.clientY-operation.anchor.y)/operation.scale;let dx=operation.end==='end'?x:-x,dy=operation.end==='end'?y:-y;const length=Math.hypot(dx,dy);if(length>=25){const ratio=Math.min(1,700/length);paint(operation.img,{dx:Math.round(dx*ratio),dy:Math.round(dy*ratio)});notify(operation.editor);}tools.querySelector('svg').replaceChildren();position();return;}
    if(operation.moved){const range=document.caretRangeFromPoint?.(event.clientX,event.clientY)||(()=>{const p=document.caretPositionFromPoint?.(event.clientX,event.clientY);if(!p)return null;const r=document.createRange();r.setStart(p.offsetNode,p.offset);r.collapse(true);return r;})();if(range&&operation.editor.contains(range.startContainer)&&range.startContainer!==operation.img&&!operation.img.contains(range.startContainer)){range.insertNode(operation.img);notify(operation.editor);}position();}
  });
  document.addEventListener('pointercancel',()=>{drag=null;tools.querySelector('svg').replaceChildren();position();});
  tools.querySelector('[data-delete]').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();const editor=selected?.closest(EDITORS);selected?.remove();hide();notify(editor);});
  document.addEventListener('click',event=>{if(event.target.closest?.('img.cep-note-arrow')){event.preventDefault();event.stopImmediatePropagation();}},true);
  tools.addEventListener('click',event=>event.stopPropagation());
  tools.querySelector('[data-delete]').addEventListener('pointerup',event=>{event.preventDefault();event.stopPropagation();const editor=selected?.closest(EDITORS);selected?.remove();hide();notify(editor);});
  window.addEventListener('scroll',()=>{if(selected)position();},true);window.addEventListener('resize',position);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
  window.CEPNoteArrows=Object.freeze({insert(editor){
    if(!editor?.isContentEditable)return;
    const selection=getSelection();
    const range=selection?.rangeCount&&editor.contains(selection.getRangeAt(0).commonAncestorContainer)?selection.getRangeAt(0).cloneRange():null;
    add(editor,range);
    selected?.scrollIntoView({block:'nearest',inline:'nearest'});
    position();
  }});
})();
