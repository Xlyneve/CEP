// Generate the header's search-only document from Home's authoritative UI and loaders.
// Run after changing Home search: node build-home-search-window.mjs
import fs from 'node:fs';
const home=fs.readFileSync(new URL('home.html',import.meta.url),'utf8');
const scripts=[...home.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const ui=scripts.find(m=>m[2].includes('// ===== UNIVERSAL SITE SEARCH ====='))?.[2];
const loader=scripts.find(m=>m[2].includes('window.CEPSearchWork = searchWork'))?.[2].split("  const qiList = document.getElementById('qiList');")[0];
const start=home.indexOf('<section class="universal-search"');
let depth=0,end=-1;
for(const match of home.slice(start).matchAll(/<\/?section\b[^>]*>/gi)){
 depth+=match[0].startsWith('</')?-1:1;
 if(!depth){end=start+match.index+match[0].length;break;}
}
if(!ui||!loader||start<0||end<0)throw Error('Home search markers changed; update the generator.');
const styles=[...home.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi)].map(m=>m[0]).join('\n');
const out=`<!DOCTYPE html>
<!-- Generated from home.html by build-home-search-window.mjs. Do not edit directly. -->
<html lang="en" data-cep-search-only="true"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Search notes</title>
<script src="auth-guard.js?v=20260826-31"></script><script src="security.js"></script>
<link rel="stylesheet" href="table-theme.css?v=2">
${styles}
<style>
html:root body.cep-search-embed{margin:0!important;min-height:100dvh!important;overflow:hidden!important;}
html:root body.cep-search-embed #universalSearchPanel{position:fixed!important;inset:0!important;width:100%!important;height:100dvh!important;max-height:none!important;transform:none!important;visibility:visible!important;}
</style>
<script src="concept-preview.js?v=20261004-2"></script><script src="concept-markup.js?v=20261004-1"></script>
</head><body class="cep-search-embed">
<button id="universalSearchButton" hidden aria-expanded="false"></button>
${home.slice(start,end)}
<script>document.documentElement.classList.remove('cep-auth-pending');</script>
<script src="page-theme.js?v=20261028-editor-contrast"></script>
<script>${ui}</script>
<script type="module">${loader}</script>
<script src="shared-definitions.js?v=20261007-3"></script><script type="module" src="pn-shared-definitions.js?v=20261007-3"></script>
</body></html>`;
fs.writeFileSync(new URL('home-search-window.html',import.meta.url),out);
console.log('Built Home search-only window without dashboard scripts or subscriptions.');
