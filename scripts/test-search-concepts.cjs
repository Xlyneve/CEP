const fs=require('fs'),http=require('http'),assert=require('assert/strict'),path=require('path');
const {chromium}=require(process.env.CEP_PLAYWRIGHT_PATH||'C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://x').pathname.slice(1);res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/html');res.end(name?fs.readFileSync(path.join(root,name)):'<main></main>');});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    for(const mode of [{name:'desktop',width:1280,touch:false},{name:'mobile',width:390,touch:true}]){
      const context=await browser.newContext({viewport:{width:mode.width,height:844},hasTouch:mode.touch});const page=await context.newPage();
      await page.goto('http://127.0.0.1:'+server.address().port);
      const result=await page.evaluate(async()=>{
        const {renderSearchCard,showSearchConceptPreview}=await import('/shared-search-card.js');
        const output={};
        for(const [name,selector] of [['home','.xgpt-concept-link'],['lightbulb','.cep-xgpt-concept']]){
          const card=document.createElement('a');card.href='#source';document.querySelector('main').append(card);
          renderSearchCard(card,{file:'chatgptx.html',title:'Concept',record:{data:{content:'[[Hypertension]]'}}},[],body=>{
            const link=document.createElement('a');link.href='#';link.className=selector.slice(1)+' has-image';link.textContent='Hypertension';link.dataset.image='data:image/png;base64,iVBORw0KGgo=';link.dataset.caption='Saved definition';body.append(link);
          });
          let previewEvents=0;const onHover=event=>{if(event.composedPath().some(node=>node.matches?.(selector)))previewEvents++;};
          const onClick=event=>showSearchConceptPreview(event,selector);document.addEventListener('mouseover',onHover);document.addEventListener('click',onClick,true);
          const link=card.querySelector('.cep-source-card-host').shadowRoot.querySelector(selector);link.click();
          const linkStyle=getComputedStyle(link),dotStyle=getComputedStyle(link,'::after');
          output[name]={previewEvents,hash:location.hash,indicator:dotStyle.content,dotColour:dotStyle.backgroundColor,dotWidth:dotStyle.width,colour:linkStyle.color,decoration:linkStyle.textDecorationLine,caption:link.dataset.caption};
          document.removeEventListener('mouseover',onHover);document.removeEventListener('click',onClick,true);card.remove();history.replaceState(null,'',location.pathname);
        }
        return output;
      });
      for(const entry of Object.values(result)){assert.equal(entry.previewEvents,1);assert.equal(entry.hash,'');assert.equal(entry.indicator,'""');assert.equal(entry.dotColour,'rgb(255, 176, 0)');assert.equal(entry.dotWidth,'8px');assert.equal(entry.colour,'rgb(154, 63, 0)');assert.equal(entry.decoration,'none');assert.equal(entry.caption,'Saved definition');}
      await context.close();console.log('PASS '+mode.name+' Home and lightbulb concept click reopens cached image/caption preview');
    }
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
