const fs = require('fs');
const http = require('http');
const assert = require('assert/strict');
const path = require('path');
const { chromium } = require(process.env.CEP_PLAYWRIGHT_PATH || 'C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');

(async () => {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.end(fs.readFileSync(path.join(root, 'home-links-ui.js')));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const url = 'http://127.0.0.1:' + server.address().port;
  const mount = async () => page.evaluate(async () => {
    document.body.innerHTML = '<div class="top-links"><a href="https://healthify.nz/">Healthify</a><a href="https://medsafe.govt.nz/">Medsafe</a><a href="https://immune.org.nz/">IMAC</a></div><button class="cep-sign-out-light">Options</button>';
    const { mountHomeLinks } = await import('/home-links-ui.js');
    window.saved = null;
    mountHomeLinks({ load: async () => window.saved, save: async links => { window.saved = links; }, signOut: () => {} });
    document.querySelector('.cep-sign-out-light').onclick = () => window.CEP_HOME_OPTIONS();
  });
  const names = () => page.locator('.top-links a').allTextContents();

  try {
    await page.goto(url);
    await page.evaluate(() => localStorage.setItem('cep-home-link-usage-v1', JSON.stringify({
      'https://healthify.nz/': 1,
      'https://medsafe.govt.nz/': 3,
      'https://immune.org.nz/': 3
    })));
    await mount();
    await page.waitForFunction(() => document.querySelectorAll('.top-links a[data-home-link-key]').length === 3);
    assert.deepEqual(await names(), ['Medsafe', 'IMAC', 'Healthify']);

    await page.evaluate(() => {
      const link = [...document.querySelectorAll('.top-links a')].find(a => a.textContent === 'Healthify');
      link.addEventListener('click', event => event.preventDefault());
      link.click(); link.click(); link.click();
    });
    assert.deepEqual(await names(), ['Medsafe', 'IMAC', 'Healthify']);

    await page.reload();
    await mount();
    await page.waitForFunction(() => document.querySelectorAll('.top-links a[data-home-link-key]').length === 3);
    assert.deepEqual(await names(), ['Healthify', 'Medsafe', 'IMAC']);

    await page.getByRole('button', { name: 'Home options' }).click();
    await page.getByRole('button', { name: 'Edit links', exact: true }).click();
    await page.getByRole('button', { name: 'Remove Medsafe' }).click();
    await page.getByRole('button', { name: 'Save links' }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    const usage = await page.evaluate(() => JSON.parse(localStorage.getItem('cep-home-link-usage-v1')));
    assert.equal(Object.hasOwn(usage, 'https://medsafe.govt.nz/'), false);
    console.log('PASS local usage ordering, stable click layout, tie order, and deleted-link cleanup');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
