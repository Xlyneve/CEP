const fs = require("fs");
const assert = require("node:assert/strict");
const { chromium } = require("C:/Users/xlyn0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();

  await page.route("**/*", async route => {
    const url = route.request().url();
    if (url === "http://auth.test/PN.html") {
      return route.fulfill({ contentType: "text/html", body: '<!doctype html><html><head><script src="auth-guard.js"></script></head><body>Nurse Notes</body></html>' });
    }
    if (url === "http://auth.test/auth-guard.js") {
      return route.fulfill({ contentType: "text/javascript", body: fs.readFileSync("auth-guard.js") });
    }
    if (url.includes("firebase-app.js")) {
      return route.fulfill({ contentType: "text/javascript", body: 'export const getApps=()=>[]; export const initializeApp=()=>({});' });
    }
    if (url.includes("firebase-auth.js")) {
      return route.fulfill({ contentType: "text/javascript", body: `
        const user={emailVerified:true,email:"xeve06@gmail.com"};
        const auth={currentUser:null,authStateReady:()=>new Promise(resolve=>setTimeout(()=>{auth.currentUser=user;resolve();},30))};
        export const getAuth=()=>auth;
        export const onAuthStateChanged=(auth,callback)=>{queueMicrotask(()=>callback(null));return()=>{}};
        export const signOut=async()=>{};
      ` });
    }
    return route.fulfill({ status: 204, body: "" });
  });

  await page.goto("http://auth.test/PN.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.CEP_AUTH_READY);
  assert.equal(await page.evaluate(() => window.CEP_AUTH_READY), true);
  assert.equal(page.url(), "http://auth.test/PN.html");
  assert.equal(await page.locator("html").evaluate(element => element.classList.contains("cep-auth-pending")), false);
  assert.equal(await page.getByRole("button", { name: "Sign out of XlynEve" }).count(), 1);

  console.log("Passed: protected pages wait for a restored desktop session without redirecting.");
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
