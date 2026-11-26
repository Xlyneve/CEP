/* Rich notebook presentation alongside the legacy plain-text field. */
(() => {
  'use strict';
  const escape=text=>String(text||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const html=note=>typeof note.textHtml==='string'?note.textHtml:escape(note.text).replace(/\r\n?/g,'\n').replace(/\n/g,'<br>');
  function plain(root){
    const blocks=new Set(['DIV','P','LI','UL','OL','PRE','BLOCKQUOTE']);
    function read(parent){let text='';for(const node of parent.childNodes){
      if(node.nodeType===3){text+=node.nodeValue;continue;}
      if(node.nodeType!==1||node.matches('script,style'))continue;
      if(node.tagName==='BR'){text+='\n';continue;}
      const block=blocks.has(node.tagName),value=read(node);
      if(block&&text&&!text.endsWith('\n'))text+='\n';text+=value;
      if(block&&(!value||!text.endsWith('\n')))text+='\n';
    }return text;}const text=read(root).replace(/\r\n?/g,'\n').replace(/\u00a0/g,' ');return root.lastChild?.nodeType===1&&blocks.has(root.lastChild.tagName)?text.replace(/\n$/,''):text;
  }
  function render(root,note,filter=''){
    CEPSecurity.setHTML(root,html(note));
    if(!filter.trim())return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    const escaped=filter.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const pattern=new RegExp('('+escaped+')','gi');
    for(const node of nodes){
      if(!node.nodeValue.toLowerCase().includes(filter.trim().toLowerCase()))continue;
      const fragment=document.createDocumentFragment();
      node.nodeValue.split(pattern).forEach((part,index)=>{if(index%2){const span=document.createElement('span');span.className='search-highlight';span.textContent=part;fragment.append(span);}else fragment.append(document.createTextNode(part));});
      node.replaceWith(fragment);
    }
  }
  window.CEPNotebookFormat={html,plain,render,load:(root,note)=>CEPSecurity.setHTML(root,html(note)),save:root=>({text:plain(root),textHtml:CEPSecurity.sanitizeHTML(root.innerHTML)})};
  document.addEventListener('keydown',event=>{
    const editor=event.target.closest?.('.notes-rich-editor[contenteditable="true"]');
    if(!editor||!(event.ctrlKey||event.metaKey)||event.shiftKey||event.altKey)return;
    const key=event.key.toLowerCase();
    if(key!=='b'&&key!=='u')return;
    event.preventDefault();event.stopPropagation();
    document.execCommand(key==='b'?'bold':'underline');
    editor.dispatchEvent(new Event('input',{bubbles:true}));
  },true);
})();
