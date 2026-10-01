const fs = require("fs");
const path = require("path");
const assert = require("node:assert/strict");
const { chromium } = require("C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const contentType = (file) => {
  if (file.endsWith(".js")) return "text/javascript";
  if (file.endsWith(".css")) return "text/css";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".ttf")) return "font/ttf";
  if (file.endsWith(".otf")) return "font/otf";
  return "text/html";
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });

  await page.route("http://theme.test/**", async (route) => {
    const name = new URL(route.request().url()).pathname.slice(1) || "index.html";
    if (name === "home.html" || name === "biosched1.html") {
      return route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html class="theme-home-glass"><body><main class="main-content"></main><script src="page-theme.js"></script></body></html>`
      });
    }
    const file = path.join(process.cwd(), name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return route.abort();
    return route.fulfill({ contentType: contentType(name), body: fs.readFileSync(file) });
  });

  await page.addInitScript(() => localStorage.setItem("xlyneve-color-theme", "anatomy"));
  await page.goto("http://theme.test/home.html", { waitUntil: "domcontentloaded" });

  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), "anatomy");
  assert.equal(
    await page.locator("html").evaluate((element) => getComputedStyle(element).getPropertyValue("--refresh-stone").trim()),
    "#faf2e8"
  );
  await page.getByRole("button", { name: "Choose colour theme" }).click();
  const option = page.locator('.xlyneve-theme-option[data-theme="anatomy"]');
  await option.waitFor();
  assert.equal(await option.getAttribute("aria-pressed"), "true");
  assert.equal((await option.innerText()).trim(), "Anatomy");

  await page.goto("http://theme.test/biosched1.html", { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").getAttribute("data-xlyneve-color-theme"), null);

  console.log("Passed: Anatomy theme loads, appears selected, and respects protected pages.");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
