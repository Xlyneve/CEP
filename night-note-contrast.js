/* Display-only contrast repair for Midnight Glass. Saved note HTML is never changed. */
(() => {
  'use strict';
  if(document.getElementById('cep-night-note-contrast'))return;
  const scopes='.note-card,.note-tile,.chatBubble,.file-item,.vaccine-card,.cep-search-source,.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result,#noteInput,#nurseNote,#noteText,#defBox,#whyBox,.cep-pn-editor';
  const excluded='button,input,select,textarea,script,style,mark,.highlight,.ml-highlight,.gradient-highlight,.highlight-gradient,.note-gradient-highlight,.highlight-hue,.cep-content-highlight,.cep-chosen-highlight,.cep-search-match,.underlineMatch,.search-highlight,.search-hit';
  const style=document.createElement('style');style.id='cep-night-note-contrast';document.head.append(style);
  const fixes=new Map(),pending=new Set();let queued=false,all=true;
  const active=()=>document.documentElement.dataset.xlyneveColorTheme==='midnight-glass';
  function rgb(value){
    if(!value || value==='transparent')return [0,0,0,0];
    const values=value.match(/[\d.]+/g)?.map(Number);
    if(!values || values.length<3)return null;
    if(value.startsWith('color(srgb'))return [values[0]*255,values[1]*255,values[2]*255,values[3]??1];
    return [values[0],values[1],values[2],values[3]??1];
  }
  function luminance(c){const v=c.slice(0,3).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2];}
  const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  function selector(element){
    const parts=[];
    for(let node=element;node&&node!==document.documentElement;node=node.parentElement){
      let index=1;for(let sibling=node.previousElementSibling;sibling;sibling=sibling.previousElementSibling)index++;
      parts.unshift(node.id ? `${node.localName}#${CSS.escape(node.id)}` : `${node.localName}:nth-child(${index})`);
    }
    return 'html:not(#cep-night-unmatched-root):not(#cep-night-unmatched-root-2)'+':root'.repeat(18)+'[data-xlyneve-color-theme="midnight-glass"] > '+parts.join(' > ');
  }
  function protectedText(element){
    if(element.closest(excluded))return true;
    for(let node=element;node;node=node.parentElement){
      if(/^(SPAN|FONT)$/.test(node.tagName)){
        const paint=rgb(node.style.backgroundColor);
        if(paint?.[3]>0 || (node.style.backgroundImage && node.style.backgroundImage!=='none'))return true;
      }
      if(node.matches(scopes))break;
    }
    return false;
  }
  function write(){
    const rules=[];
    for(const [element,colour] of fixes){
      if(!element.isConnected || protectedText(element)){fixes.delete(element);continue;}
      rules.push(`${selector(element)}{color:${colour}!important;-webkit-text-fill-color:${colour}!important;}`);
    }
    const css=rules.join('\n');if(style.textContent!==css)style.textContent=css;
  }
  function scan(){
    queued=false;
    if(!active()){fixes.clear();pending.clear();style.textContent='';all=false;return;}
    let roots=all?[...document.querySelectorAll(scopes)]:[...pending].filter(e=>e.isConnected);
    all=false;pending.clear();
    roots=roots.filter(root=>!roots.some(other=>other!==root&&other.contains(root)));
    for(const element of fixes.keys())if(!element.isConnected||roots.some(root=>root.contains(element)))fixes.delete(element);
    // Remove only dirty rules before reading their original display colours.
    write();
    const computed=new Map(),backgrounds=new Map();
    const css=e=>{if(!computed.has(e))computed.set(e,getComputedStyle(e));return computed.get(e);};
    function background(e){
      if(!e)return [29,33,39,1];
      if(backgrounds.has(e))return backgrounds.get(e);
      const declaration=css(e);let paint=rgb(declaration.backgroundColor)||[0,0,0,0];
      if(paint[3]<.99 && declaration.backgroundImage!=='none'){
        const first=declaration.backgroundImage.match(/rgba?\([^)]*\)|color\(srgb[^)]*\)/)?.[0];
        const gradient=rgb(first);if(gradient?.[3]>.8)paint=gradient;
      }
      let result=paint;
      if(paint[3]<.99){const under=background(e.parentElement);result=paint.slice(0,3).map((n,i)=>n*paint[3]+under[i]*(1-paint[3]));result.push(1);}
      backgrounds.set(e,result);return result;
    }
    const parents=new Set();
    for(const root of roots){
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      while(walker.nextNode())if(walker.currentNode.textContent.trim())parents.add(walker.currentNode.parentElement);
    }
    for(const element of parents){
      if(protectedText(element))continue;
      const declaration=css(element);if(declaration.visibility==='hidden'||declaration.display==='none')continue;
      const ink=rgb(declaration.webkitTextFillColor)||rgb(declaration.color),paper=background(element);
      if(!ink||ink[3]<.2||luminance(paper)>.25||contrast(ink,paper)>=4.5)continue;
      let colour=[233,237,245];
      // Retain the hue of intentional colours; neutral dark text becomes light grey.
      if(Math.max(...ink.slice(0,3))-Math.min(...ink.slice(0,3))>24){
        for(let mix=.1;mix<=1;mix+=.05){const candidate=ink.slice(0,3).map(n=>Math.round(n+(255-n)*mix));if(contrast(candidate,paper)>=4.7){colour=candidate;break;}}
      }
      fixes.set(element,`rgb(${colour.join(',')})`);
    }
    write();
  }
  function enqueue(){if(!queued){queued=true;requestAnimationFrame(scan);}}
  function schedule(root){if(root)pending.add(root);else all=true;enqueue();}
  function dirty(node){
    const element=node.nodeType===1?node:node.parentElement;if(!element)return;
    const root=element.closest(scopes);if(root)schedule(root);
    else element.querySelectorAll?.(scopes).forEach(root=>schedule(root));
  }
  function start(){
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.target===document.documentElement){schedule();continue;}
        if(record.type==='childList'){
          const root=record.target.closest?.(scopes);if(root)schedule(root);
          for(const node of record.addedNodes)dirty(node);
          // Ignore unrelated overlays such as copy feedback; only reindex removed note roots.
          if([...record.removedNodes].some(node=>node.nodeType===1&&(node.matches(scopes)||node.querySelector(scopes))))enqueue();
        }else dirty(record.target);
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style','color']});
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-xlyneve-color-theme']});
    document.addEventListener('input',e=>dirty(e.target),true);
    document.addEventListener('load',e=>{if(e.target.tagName==='LINK')schedule();},true);
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
