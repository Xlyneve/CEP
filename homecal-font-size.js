/* Display preference for the calendar embedded on Home; never changes saved notes. */
(() => {
  'use strict';
  if(new URLSearchParams(location.search).get('homeEmbed')!=='today' || window.parent===window)return;
  let scale=1, frame;
  const originals=new WeakMap();
  const mobile=()=>matchMedia('(max-width:760px),(hover:none) and (pointer:coarse)').matches;
  const fields=()=>[...document.querySelectorAll('.day-note-editor,.day-note-editor [style*="font-size"],.todo-item textarea,#newTodo')];
  function paint(){
    frame=null;
    const elements=fields();
    for(const element of elements)if(!originals.has(element))originals.set(element,{size:parseFloat(getComputedStyle(element).fontSize),value:element.style.getPropertyValue('font-size'),priority:element.style.getPropertyPriority('font-size')});
    for(const element of elements){
      const original=originals.get(element);
      const editing=mobile()&&(element===document.activeElement||element.closest('.day-note-editor')===document.activeElement);
      if(scale===1&&!editing){
        if(original.value)element.style.setProperty('font-size',original.value,original.priority);else element.style.removeProperty('font-size');
      }else element.style.setProperty('font-size',Math.max(editing?16:1,original.size*scale)+'px','important');
      if(element.tagName==='TEXTAREA' && element.getClientRects().length){
        element.style.height='auto';
        const style=getComputedStyle(element),border=style.boxSizing==='border-box'?parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth):-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
        element.style.height=(element.scrollHeight+border)+'px';
      }
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  function apply(value){
    if(!Number.isFinite(value))return;
    scale=Math.max(.6,Math.min(1.4,value));paint();
  }
  window.setHomeCalendarFontScale=apply;
  window.addEventListener('message',event=>{
    if(event.origin===location.origin&&event.source===window.parent&&event.data?.type==='homecal-set-font-scale')apply(event.data.scale);
  });
  const prepare=event=>{
    const editor=event.target.closest?.('.day-note-editor,.todo-item textarea,#newTodo');
    if(!editor||!mobile())return;
    if(!originals.has(editor))originals.set(editor,{size:parseFloat(getComputedStyle(editor).fontSize),value:editor.style.getPropertyValue('font-size'),priority:editor.style.getPropertyPriority('font-size')});
    editor.style.setProperty('font-size',Math.max(16,originals.get(editor).size*scale)+'px','important');
    for(const child of editor.querySelectorAll('[style*="font-size"]'))if(originals.has(child))child.style.setProperty('font-size',Math.max(16,originals.get(child).size*scale)+'px','important');
  };
  document.addEventListener('pointerdown',prepare,true);
  document.addEventListener('touchstart',prepare,{capture:true,passive:true});
  document.addEventListener('focusin',event=>{prepare(event);schedule();});
  document.addEventListener('focusout',schedule);
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('cep-theme-css-ready',()=>{
    for(const element of fields()){
      const original=originals.get(element);
      if(original?.value)element.style.setProperty('font-size',original.value,original.priority);else element.style.removeProperty('font-size');
      originals.delete(element);
    }
    schedule();
  });
})();
