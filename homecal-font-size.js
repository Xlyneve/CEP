/* Home-only display sizing; saved note content is never rewritten. */
(() => {
  'use strict';
  if(new URLSearchParams(location.search).get('homeEmbed')!=='today' || window.parent===window)return;
  let scale=1, frame, lastHeight=0;
  const originals=new WeakMap(), observed=new Set();
  const fields=()=>[...document.querySelectorAll('.day-note-editor,.todo-item textarea,#newTodo')];
  const resizeObserver=new ResizeObserver(()=>schedule());
  const style=document.createElement('style');
  style.textContent=`
    .homecal-font-wrap{position:relative;display:block;min-width:0;width:100%;box-sizing:border-box;}
    .todo-item>.homecal-font-wrap,.add-todo>.homecal-font-wrap{flex:1;min-width:0;}
    html#homecal-embedded-document.homecal-mobile-flow body#homecal-surface{height:auto!important;min-height:0!important;align-items:flex-start!important;overflow:visible!important;}
    html#homecal-embedded-document.homecal-mobile-flow{height:auto!important;overflow:visible!important;}
    html#homecal-embedded-document.homecal-mobile-flow body#homecal-surface :is(.calendar-container,.calendar-scroll-glass,.calendar,.day.embedded-selected-day,#todoPanel,#todoList){height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;}
    html#homecal-embedded-document.homecal-mobile-flow body#homecal-surface :is(.calendar-container,.calendar-scroll-glass,.calendar,.day,.day-header,.todo-container,.todo-list){touch-action:pan-y!important;}
    html#homecal-embedded-document.homecal-mobile-flow #todoResizer{align-self:stretch!important;}
  `;
  document.head.append(style);
  function reportHeight(){
    if(!document.documentElement.classList.contains('homecal-mobile-flow'))return;
    const body=document.body, top=body.getBoundingClientRect().top;
    const bottom=Math.max(...[...body.children].filter(e=>e.matches('.calendar-container,#todoPanel,.todo-resizer')&&e.getClientRects().length).map(e=>e.getBoundingClientRect().bottom));
    if(!Number.isFinite(bottom))return;
    const height=Math.max(80,Math.ceil(bottom-top));
    if(Math.abs(height-lastHeight)>1){lastHeight=height;window.parent.postMessage({type:'homecal-content-height',height},location.origin);}
  }
  function paint(){
    frame=null;
    const elements=fields();
    for(const element of observed)if(!element.isConnected){resizeObserver.unobserve(element);observed.delete(element);}
    for(const element of elements){
      if(!originals.has(element))originals.set(element,{size:parseFloat(getComputedStyle(element).fontSize),font:element.style.getPropertyValue('font-size'),fontPriority:element.style.getPropertyPriority('font-size'),transform:element.style.transform,width:element.style.width,origin:element.style.transformOrigin});
      const original=originals.get(element);
      let wrap=element.parentElement;
      if(!wrap.classList.contains('homecal-font-wrap')){wrap=document.createElement('div');wrap.className='homecal-font-wrap';element.before(wrap);wrap.append(element);}
      // Keep a Safari-safe computed font size and scale the complete text surface,
      // rather than changing the visible text size when focus enters or leaves it.
      element.style.setProperty('font-size',Math.max(16,original.size)+'px','important');
      const factor=scale*original.size/Math.max(16,original.size);
      element.style.transformOrigin='top left';element.style.transform='scale('+factor+')';element.style.width=(100/factor)+'%';
      if(element.tagName==='TEXTAREA'&&element.getClientRects().length){
        element.style.height='auto';
        const css=getComputedStyle(element),border=css.boxSizing==='border-box'?parseFloat(css.borderTopWidth)+parseFloat(css.borderBottomWidth):-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom);
        element.style.height=(element.scrollHeight+border)+'px';
      }
      wrap.style.height=(element.offsetHeight*factor)+'px';
      if(!observed.has(element)){observed.add(element);resizeObserver.observe(element);}
    }
    reportHeight();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  function apply(value){if(Number.isFinite(value)){scale=Math.max(.6,Math.min(1.4,value));paint();}}
  window.setHomeCalendarFontScale=apply;
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==window.parent)return;
    if(event.data?.type==='homecal-set-font-scale')apply(event.data.scale);
    if(event.data?.type==='homecal-set-mobile-flow'){
      document.documentElement.classList.toggle('homecal-mobile-flow',!!event.data.enabled);lastHeight=0;schedule();
    }
  });
  document.addEventListener('input',schedule);
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  resizeObserver.observe(document.body);
  window.addEventListener('resize',schedule);
  window.addEventListener('cep-theme-css-ready',()=>{
    for(const element of fields()){
      const original=originals.get(element);
      if(original){
        if(original.font)element.style.setProperty('font-size',original.font,original.fontPriority);else element.style.removeProperty('font-size');
        element.style.transform=original.transform;element.style.width=original.width;element.style.transformOrigin=original.origin;
      }
      originals.delete(element);
    }
    schedule();
  });
})();
