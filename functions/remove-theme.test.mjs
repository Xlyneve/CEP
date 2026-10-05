import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {removeTheme,pruneCss,themeCatalog} from './remove-theme.mjs';
import {createHandler} from './management-server.mjs';
const source=readFileSync(new URL('../page-theme.js',import.meta.url),'utf8');
const catalog=themeCatalog(source);
for(const entry of catalog.filter(t=>t.value!=='original')) {
 test(`remove ${entry.value} without removing remaining themes`,()=>{
  const out=removeTheme(source,entry.value);
  assert(out.changed);new vm.Script(out.source);
  assert.deepEqual(themeCatalog(out.source),catalog.filter(t=>t.value!==entry.value));
  assert(!out.source.includes(`data-xlyneve-color-theme="${entry.value}"`));
  for(const other of catalog.filter(t=>!['original',entry.value].includes(t.value)))assert(out.source.includes(`data-xlyneve-color-theme="${other.value}"`),other.value);
  assert(!removeTheme(out.source,entry.value).changed);
 });
}
test('shared CSS selector retains other themes and negative selectors remain safe',()=>{
 const output=pruneCss('html:is([data-xlyneve-color-theme="aurora"],[data-xlyneve-color-theme="sculpted"]) .card { color:red } html[data-xlyneve-color-theme="aurora"] { color:blue } html:not([data-xlyneve-color-theme="aurora"]) { color:green }','aurora');
 assert(!output.includes('aurora'));assert(output.includes('sculpted'));assert(output.includes('color:red'));assert(output.includes('color:green'));assert(!output.includes('color:blue'));
});
test('sequential deletions leave Original usable',()=>{
 let remaining=source;for(const entry of catalog.filter(t=>t.value!=='original'))remaining=removeTheme(remaining,entry.value).source;
 assert.deepEqual(themeCatalog(remaining).map(t=>t.value),['original']);new vm.Script(remaining);assert(remaining.includes('originalPalette'));
});
test('Original and unknown names cannot be removed',()=>{assert.throws(()=>removeTheme(source,'original'));assert.throws(()=>removeTheme(source,'invalid'));});
function response(){return{code:200,set(){},status(code){this.code=code;return this},json(value){this.value=value;return this}}}
const req=(body,token='token')=>({method:'POST',body,get:()=>token?'Bearer '+token:undefined});
test('no writes for unauthenticated, unverified, wrong-account, Original or malformed status',async()=>{
 for(const [user,request,code] of [[null,req({},null),401],[{email:'other@example.com',email_verified:true},req({action:'delete',theme:'aurora'}),403],[{email:'xeve06@gmail.com',email_verified:false},req({action:'delete',theme:'aurora'}),403],[{email:'xeve06@gmail.com',email_verified:true},req({action:'delete',theme:'original'}),400],[{email:'xeve06@gmail.com',email_verified:true},req({action:'status',sha:'../main'}),400]]){
 let calls=0;const res=response();await createHandler({verifyToken:async()=>user,github:async()=>{calls++}})(request,res);assert.equal(res.code,code);assert.equal(calls,0);
 }
});
test('authorized deletion commits safely and never force-pushes',async()=>{
 const calls=[];const head='a'.repeat(40),commit='b'.repeat(40);
 const github=async(path,method='GET',body)=>{calls.push({path,method,body});
 if(path==='/git/ref/heads/main')return{object:{sha:head}};
 if(path==='/git/commits/'+head)return{tree:{sha:'tree'}};
 if(path.startsWith('/contents/'))return{content:Buffer.from(source).toString('base64')};
 if(path==='/git/blobs'){assert(!body.content.includes('data-xlyneve-color-theme="aurora"'));return{sha:'blob'}};
 if(path==='/git/trees'){assert(body.tree.some(t=>t.path==='aurora-background.svg'&&t.sha===null));return{sha:'newtree'}};
 if(path==='/git/commits'){assert.deepEqual(body.parents,[head]);return{sha:commit}};
 if(path==='/git/refs/heads/main'){assert.equal(body.force,false);return{}};
 throw new Error('Unexpected request');};
 const res=response();await createHandler({verifyToken:async()=>({email:'xeve06@gmail.com',email_verified:true}),github})(req({action:'delete',theme:'aurora'}),res);
 assert.equal(res.code,200);assert.equal(res.value.sha,commit);assert.equal(calls.at(-1).method,'PATCH');
});
test('failed deployment is reported as failed, never deployed',async()=>{
 const res=response();await createHandler({verifyToken:async()=>({email:'xeve06@gmail.com',email_verified:true}),github:async()=>({workflow_runs:[{status:'completed',conclusion:'failure'}]})})(req({action:'status',sha:'b'.repeat(40)}),res);
 assert.equal(res.value.status,'failed');
});
function renderSelection(script,stored) {
 const root={dataset:{},classList:{add(){}},style:{values:{},setProperty(k,v){this.values[k]=v}}};
 const document={documentElement:root,readyState:'loading',createElement:()=>({}),addEventListener(){}};
 vm.runInNewContext(script,{document,location:{pathname:'/Notes.html'},localStorage:{getItem:()=>stored,removeItem(){}},window:{addEventListener(){}}});
 return {theme:root.dataset.xlyneveColorTheme,header:root.style.values['--page-header-glass']};
}
test('deleted selections fall back to Original; every retained selection keeps its colour',()=>{
 for(const removed of catalog.filter(t=>t.value!=='original')){
  const out=removeTheme(source,removed.value).source;
  assert.equal(renderSelection(out,removed.value).theme,undefined);
  for(const retained of catalog.filter(t=>t.value!==removed.value))assert.deepEqual(renderSelection(out,retained.value),renderSelection(source,retained.value));
 }
});
