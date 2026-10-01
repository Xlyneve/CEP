const fs = require("fs");
const path = require("path");
const assert = require("node:assert/strict");
const { chromium } = require("C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });

  await page.route("http://theme.test/**", async (route) => {
    const name = new URL(route.request().url()).pathname.slice(1) || "home.html";
    if (name === "home.html" || name === "biosched1.html") {
      return route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html class="theme-home-glass"><body><header><h1 class="pageTitle">Dashboard</h1></header><main class="main-content"><section class="card-group section-card-group section-notes"><article class="card">Card</article></section></main><script src="page-theme.js"></script></body></html>`
      });
    }
    const file = path.join(process.cwd(), name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return route.abort();
    return route.fulfill({ contentType: name.endsWith(".js") ? "text/javascript" : "text/plain", body: fs.readFileSync(file) });
  });

  await page.addInitScript(() => localStorage.setItem("xlyneve-color-theme", "liquid-glass"));
  await page.goto("http://theme.test/home.html", { waitUntil: "domcontentloaded" });

  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), "liquid-glass");
  const cardStyle = await page.locator(".card").evaluate((element) => {
    const style = getComputedStyle(element);
    return { radius: style.borderRadius, shadow: style.boxShadow, blur: style.backdropFilter };
  });
  assert.equal(cardStyle.radius, "26px");
  assert.match(cardStyle.shadow, /rgba\(/);
  assert.match(cardStyle.blur, /blur\(30px\)/);

  await page.getByRole("button", { name: "Choose colour theme" }).click();
  const option = page.locator('.xlyneve-theme-option[data-theme="liquid-glass"]');
  await option.waitFor();
  assert.equal(await option.getAttribute("aria-pressed"), "true");
  assert.equal((await option.innerText()).trim(), "Liquid Glass");

  await page.goto("http://theme.test/biosched1.html", { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), null);

  console.log("Passed: Liquid Glass theme loads with blur and glow styling and respects protected pages.");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
