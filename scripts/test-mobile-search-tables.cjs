const fs=require('fs'),http=require('http'),assert=require('assert/strict'),path=require('path');
const {chromium}=require(process.env.CEP_PLAYWRIGHT_PATH||'C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://x').pathname.slice(1);res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/html');res.end(name?fs.readFileSync(path.join(root,name)):'<main></main>');});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage();
    for(const width of [375,390,430,1280]){
      await page.setViewportSize({width,height:850});await page.goto('http://127.0.0.1:'+server.address().port);
      const result=await page.evaluate(async()=>{
        const {renderSearchCard}=await import('/shared-search-card.js');
        const card=document.createElement('a');card.href='#note';document.querySelector('main').append(card);
        renderSearchCard(card,{file:'chatgptx.html',title:'28 day',record:{data:{content:'<table style="width:1400px;min-width:1400px"><tr><td><mark class="saved-highlight">Fertile</mark> phase</td><td>Day 12</td><td>Rightmost column</td></tr></table>'}}},["phase"],(el,html,terms)=>{if(terms.length)throw Error("Automatic highlighting still enabled");el.innerHTML=html;});
        const shadow=card.firstElementChild.shadowRoot,scroll=shadow.querySelector('.source-table-scroll');
        if(!shadow.querySelector("mark.saved-highlight"))throw Error("Saved highlight lost");
        scroll.scrollLeft=scroll.scrollWidth;
        return {pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,scrollLeft:scroll.scrollLeft,scrollWidth:scroll.scrollWidth,clientWidth:scroll.clientWidth};
      });
      assert(result.pageWidth<=width,JSON.stringify(result));assert(result.scrollLeft>0,JSON.stringify(result));
      await page.locator('table').click();await page.getByRole('dialog').waitFor();
      await page.getByRole('button',{name:'Close table'}).click();assert.equal(await page.getByRole('dialog').count(),0);
      console.log('PASS '+width+'px: wide table scrolls inside card; enlarge and close work');
    }
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
