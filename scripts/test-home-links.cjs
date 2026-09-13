const fs=require('fs'),http=require('http'),assert=require('assert/strict'),path=require('path');
const {chromium}=require(process.env.CEP_PLAYWRIGHT_PATH||'C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(root,'home-links-ui.js')));});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.evaluate(async()=>{
      document.body.innerHTML='<div class="top-links"><a href="https://healthify.nz/">Healthify</a></div><button class="cep-sign-out-light">Options</button>';
      const {mountHomeLinks}=await import('/home-links-ui.js');
      window.saved=null;window.signedOut=false;
      mountHomeLinks({load:async()=>window.saved,save:async links=>{if(window.failSave)throw Error('offline');window.saved=links;},signOut:()=>window.signedOut=true});
      document.querySelector('.cep-sign-out-light').onclick=()=>window.CEP_HOME_OPTIONS();
    });
    await page.addStyleTag({content:[...fs.readFileSync(path.join(root,"home.html"),"utf8").matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join("\n")});
    const open=async()=>{await page.getByRole('button',{name:'Home options'}).click();await page.getByRole('button',{name:'Edit links',exact:true}).click();};
    await open();await page.getByLabel('Name',{exact:true}).fill('Health resources');await page.getByLabel('Website address').fill('healthify.nz/new');
    await page.getByRole('button',{name:'Add link',exact:true}).click();await page.getByLabel('Name',{exact:true}).last().fill('New reference');await page.getByLabel('Website address').last().fill('example.com');
    await page.getByRole('button',{name:'Save links'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});
    assert.equal(await page.locator('.top-links a').count(),2);assert.equal(await page.locator('.top-links a').first().getAttribute('href'),'https://healthify.nz/new');
    await open();await page.getByRole('button',{name:'Remove New reference'}).click();await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('.top-links a').count(),2);
    await open();await page.getByLabel('Website address').first().fill('javascript:alert(1)');await page.getByRole('button',{name:'Save links'}).click();assert.match(await page.locator('.home-links-status').textContent(),/valid/);
    await page.getByLabel('Website address').first().fill('https://healthify.nz/');await page.evaluate(()=>window.failSave=true);await page.getByRole('button',{name:'Save links'}).click();await page.getByText('Could not save links.',{exact:false}).waitFor();
    await page.evaluate(()=>window.failSave=false);await page.getByRole('button',{name:'Remove New reference'}).click();
    const overflow=await page.getByRole('dialog').evaluate(el=>el.scrollWidth>el.clientWidth);assert.equal(overflow,false);
    await page.screenshot({path:path.join(root,'../home-links-mobile.png')});
    await page.getByRole('button',{name:'Save links'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});assert.equal(await page.locator('.top-links a').count(),1);
    await page.getByRole('button',{name:'Home options'}).click();await page.getByRole('button',{name:'Sign out',exact:true}).click();assert.equal(await page.evaluate(()=>window.signedOut),true);
    console.log('PASS mobile add/edit/remove, cancel, URL validation, save failure/retry, no dialog overflow, sign-out menu');
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
