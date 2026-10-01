const fs = require("fs");
const path = require("path");
const assert = require("node:assert/strict");
const { chromium } = require("C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });

  await page.route("http://theme.test/**", async (route) => {
    const name = new URL(route.request().url()).pathname.slice(1) || "home.html";
    if (name === "home.html" || name === "biosched1.html" || name === "chatgptx.html") {
      return route.fulfill({
        contentType: "text/html",
        body: name === "chatgptx.html"
          ? `<!doctype html><html><body><main id="chat"><div class="message bot"><div class="chatBubble">Note</div></div></main><script src="page-theme.js"></script></body></html>`
          : `<!doctype html><html class="theme-home-glass"><body class="dashboard-hierarchy-active"><header><h1 class="pageTitle">Dashboard</h1></header><main class="main-content"><h2 class="dashboard-section-heading"><button class="dashboard-section-toggle">Admin</button></h2><section class="card-group section-card-group section-home"><article class="card" style="--card-ink:#fff">Card</article></section></main><script src="page-theme.js"></script></body></html>`
      });
    }
    const file = path.join(process.cwd(), name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return route.abort();
    return route.fulfill({ contentType: name.endsWith(".js") ? "text/javascript" : "text/plain", body: fs.readFileSync(file) });
  });

  await page.addInitScript(() => localStorage.setItem("xlyneve-color-theme", "sculpted"));
  await page.goto("http://theme.test/home.html", { waitUntil: "domcontentloaded" });

  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), "sculpted");
  assert.equal(await page.locator("html").evaluate(element => getComputedStyle(element).getPropertyValue("--theme-ink").trim()), "#39353a");
  const cardStyle = await page.locator(".card").evaluate((element) => {
    const style = getComputedStyle(element);
    return { radius: style.borderRadius, shadow: style.boxShadow };
  });
  assert.equal(cardStyle.radius, "28px");
  assert.match(cardStyle.shadow, /rgba\(/);
  assert.equal(await page.locator(".card").evaluate(element => getComputedStyle(element).color), "rgb(57, 53, 58)");
  assert.equal(await page.locator(".card").evaluate(element => getComputedStyle(element).paddingLeft), "22px");
  assert.equal(await page.locator(".dashboard-section-toggle").evaluate(element => getComputedStyle(element).paddingLeft), "22px");

  await page.getByRole("button", { name: "Choose colour theme" }).click();
  const option = page.locator('.xlyneve-theme-option[data-theme="sculpted"]');
  await option.waitFor();
  assert.equal(await option.getAttribute("aria-pressed"), "true");
  assert.equal((await option.innerText()).trim(), "Sculpted 5D");
  assert.equal(await option.locator(".xlyneve-theme-swatch").count(), 5);

  await page.goto("http://theme.test/chatgptx.html", { waitUntil: "domcontentloaded" });
  await page.locator("html").evaluate(element => element.removeAttribute("data-xlyneve-color-theme"));
  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), null);
  const noteStyle = await page.locator(".chatBubble").evaluate((element) => {
    const style = getComputedStyle(element);
    return { radius: style.borderRadius, shadow: style.boxShadow, blur: style.backdropFilter, background: style.backgroundImage };
  });
  assert.equal(noteStyle.radius, "24px");
  assert.match(noteStyle.shadow, /rgba\(/);
  assert.equal(noteStyle.blur, "none");
  assert.match(noteStyle.background, /rgb\(255, 255, 255\)/);

  await page.goto("http://theme.test/biosched1.html", { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), null);

  console.log("Passed: Sculpted 5D theme loads with depth styling and respects protected pages.");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
