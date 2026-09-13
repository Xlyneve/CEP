const fs=require('fs'),http=require('http'),assert=require('assert/strict'),path=require('path');
const {chromium}=require(process.env.CEP_PLAYWRIGHT_PATH||'C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://x').pathname.slice(1);res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/html');res.end(name?fs.readFileSync(path.join(root,name)):'<section id="search"><main></main></section>');});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await page.goto('http://127.0.0.1:'+server.address().port);
    await page.evaluate(async()=>{
      const {renderSearchCard}=await import('/shared-search-card.js');window.searchClosed=0;
      const panel=document.querySelector('#search');document.addEventListener('click',event=>{if(!event.composedPath().includes(panel))window.searchClosed++;});
      const card=document.createElement('a');card.href='#source';panel.querySelector('main').append(card);
      renderSearchCard(card,{file:'PN.html',title:'Result',record:{data:{note:'<table><tr><td>Cell</td></tr></table>',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aJ1kAAAAASUVORK5CYII='}}},[],(body,html)=>body.innerHTML=html);
    });
    await page.locator('.source-body table').click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Close table'}).click();
    assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.evaluate(()=>window.searchClosed),0);
    await page.locator('.source-image').click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Close image'}).click();
    assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.evaluate(()=>window.searchClosed),0);
    console.log('PASS mobile table/image X closes only popup and leaves search open');
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
