const fs=require('fs'),http=require('http'),assert=require('assert/strict'),path=require('path');
const {chromium}=require(process.env.CEP_PLAYWRIGHT_PATH||'C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://x').pathname.slice(1);res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/html');res.end(name?fs.readFileSync(path.join(root,name)):'<main></main>');});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.evaluate(async()=>{
      window.copies=[];window.navigations=0;
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.copies.push({type:'plain',text}),write:async items=>window.copies.push({type:'rich',items})}});
      window.ClipboardItem=class {constructor(data){this.data=data;}};
      const {renderSearchCard}=await import('/shared-search-card.js');
      window.addCard=(id,file,text='<b>Copied</b> content')=>{
        const card=document.createElement('a');card.id=id;card.href='/'+file+'#card';
        card.addEventListener('click',event=>{if(event.detail===0||file==='ECG.html'){event.preventDefault();window.navigations++;}});
        renderSearchCard(card,{file,title:'Result',record:{id,data:file==='PN.html'||file==='recalls.html'?{note:text}:{text}}},[],(element,html)=>element.innerHTML=html);
        document.querySelector('main').append(card);
      };
    });
    for(const file of ['PN.html','info.html','explain.html','recalls.html','practiceN.html']){
      await page.evaluate(file=>{window.copies.length=0;window.navigations=0;window.addCard('single',file);},file);
      await page.locator('#single .source-body').click();await page.waitForTimeout(280);
      const single=await page.evaluate(()=>({copies:window.copies.length,navigations:window.navigations,type:window.copies[0]?.type,text:window.copies[0]?.text}));
      assert.equal(single.copies,1,file+' single click copy');assert.equal(single.navigations,0,file+' single click navigation');
      assert.equal(single.type,file==='explain.html'?'rich':'plain',file+' copy format');
      await page.evaluate(file=>{document.querySelector('main').replaceChildren();window.copies.length=0;window.navigations=0;window.addCard('double',file);},file);
      await page.locator('#double .source-body').dblclick({delay:40});await page.waitForTimeout(280);
      const double=await page.evaluate(()=>({copies:window.copies.length,navigations:window.navigations}));
      assert.equal(double.copies,0,file+' double click must not copy');assert.equal(double.navigations,1,file+' double click navigation');
    }
    await page.evaluate(()=>{document.querySelector('main').replaceChildren();window.copies.length=0;window.navigations=0;window.addCard('ineligible','ECG.html');});
    await page.locator('#ineligible .source-body').click();await page.waitForTimeout(280);
    assert.deepEqual(await page.evaluate(()=>({copies:window.copies.length,navigations:window.navigations})),{copies:0,navigations:1});
    for(const entryPoint of ['home','lightbulb']){
      await page.evaluate(entryPoint=>{document.querySelector('main').replaceChildren();window.copies.length=0;window.navigations=0;window.addCard(entryPoint,'PN.html','Same cached content');},entryPoint);
      await page.locator('#'+entryPoint+' .source-body').click();await page.waitForTimeout(280);
      assert.equal(await page.evaluate(()=>window.copies[0].text),'Same cached content',entryPoint+' shared renderer');
    }
    await page.evaluate(()=>{document.querySelector('main').replaceChildren();window.copies.length=0;window.navigations=0;window.addCard('touch','PN.html','Touch content');});
    await page.locator('#touch .source-body').tap();await page.waitForTimeout(280);assert.equal(await page.evaluate(()=>window.copies[0].text),'Touch content');
    await page.evaluate(()=>{document.querySelector('main').replaceChildren();window.copies.length=0;window.navigations=0;window.addCard('table','PN.html','<table><tr><td>Table content</td></tr></table>');});
    await page.locator('#table table').click();await page.getByRole('dialog').waitFor();assert.equal(await page.evaluate(()=>window.copies.length),0);await page.getByRole('button',{name:'Close table'}).click();
    assert.deepEqual(errors,[]);console.log('PASS eligible single-copy, rich Explain copy, double-navigation without copy, ineligible unchanged, shared Home/lightbulb rendering, mobile viewport, no console errors');
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
