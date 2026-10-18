'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const repository = require('./pdf-repository');

function setup(user, options = {}) {
  let handler, saved = 0, written = 0, removed = 0, deleted = 0;
  const order = [];
  const sandbox = { exports: {}, require(name) {
    if (name === 'firebase-functions/v2/https') return { onRequest: (options, fn) => { handler = fn; return fn; } };
    if (name === 'firebase-functions/params') return { defineSecret: () => ({ value: () => 'test-secret' }) };
    if (name === 'firebase-admin/app') return { initializeApp() {} };
    if (name === 'firebase-admin/auth') return { getAuth: () => ({ verifyIdToken: async () => {
      if (user instanceof Error) throw user; return user;
    } }) };
    if (name === 'firebase-admin/firestore') return {
      FieldValue: { serverTimestamp: () => 'timestamp' },
      getFirestore: () => ({ collection: () => ({ doc: id => ({ id,
        get: async () => ({ exists: options.exists !== false, data: () => ({
          pdfPath: options.path || `assets/pdfs/${id.slice(4)}.pdf`
        }) }),
        delete: async () => { order.push('entry'); removed++; }
      }) }),
        runTransaction: async fn => fn({ get: async () => ({ exists: false }), create() { written++; } }) })
    };
    if (name === './pdf-repository') return { ...repository, savePdfToRepository: async () => { saved++; },
      deletePdfFromRepository: async () => {
        if (options.repositoryError) throw new repository.UploadError(502, 'GitHub denied deletion.');
        order.push('repository'); deleted++;
      } };
    throw new Error('Unexpected import: ' + name);
  } };
  vm.runInNewContext(fs.readFileSync(__dirname + '/index.js', 'utf8'), sandbox);
  return { async call({ authorization = 'Bearer firebase-token', origin = 'https://cepx-f9d2a.firebaseapp.com', method = 'POST', body } = {}) {
    let status = 200, result;
    const req = { method, body: body || { content: Buffer.from('%PDF-1.4\nbody\n%%EOF').toString('base64') },
      get: name => name === 'Origin' ? origin : name === 'Authorization' ? authorization : undefined,
      is: () => true };
    const res = { set() {}, status(code) { status = code; return this; }, json(data) { result = data; }, send(data) { result = data; } };
    await handler(req, res);
    return { status, result, saved, written, removed, deleted, order };
  } };
}
test('requires valid approved, verified Firebase identity before any GitHub write', async () => {
  const owner = { email: 'xeve06@gmail.com', email_verified: true };
  assert.equal((await setup(owner).call({ authorization: '' })).status, 401);
  assert.equal((await setup(new Error('revoked')).call()).status, 401);
  for (const user of [{ email: 'other@example.com', email_verified: true },
    { email: owner.email, email_verified: false }]) {
    const result = await setup(user).call();
    assert.equal(result.status, 403); assert.equal(result.saved, 0); assert.equal(result.written, 0);
  }
});
test('rejects unapproved origins and invalid files without repository writes', async () => {
  const app = setup({ email: 'xeve06@gmail.com', email_verified: true });
  assert.equal((await app.call({ origin: 'https://evil.example' })).status, 403);
  const result = await app.call({ body: { content: 'bad' } });
  assert.equal(result.status, 400); assert.equal(result.saved, 0);
});
test('an approved upload creates one link with a public hosted PDF URL', async () => {
  const result = await setup({ email: 'xeve06@gmail.com', email_verified: true }).call();
  assert.equal(result.status, 200); assert.equal(result.saved, 1); assert.equal(result.written, 1);
  assert.match(result.result.url, /^https:\/\/cepx-f9d2a.firebaseapp.com\/assets\/pdfs\/[a-f0-9]{64}\.pdf$/);
});

const owner = { email: 'xeve06@gmail.com', email_verified: true };
const deleteBody = { action: 'delete', id: 'pdf-' + 'a'.repeat(64) };
test('deletion is authenticated and removes GitHub before the saved entry', async () => {
  const denied = await setup({email:'other@example.com',email_verified:true}).call({body:deleteBody});
  assert.equal(denied.status,403); assert.equal(denied.deleted,0);
  const result = await setup(owner).call({body:deleteBody});
  assert.equal(result.status,200); assert.equal(result.result.deleted,true);
  assert.equal(result.removed,1); assert.deepEqual(result.order,['repository','entry']);
});
test('a GitHub deletion failure preserves the saved entry for retry', async () => {
  const result = await setup(owner,{repositoryError:true}).call({body:deleteBody});
  assert.equal(result.status,502); assert.equal(result.removed,0); assert.equal(result.deleted,0);
});
test('rejects path manipulation and handles already removed entries safely', async () => {
  const invalid = await setup(owner).call({body:{action:'delete',id:'../../forms.html'}});
  assert.equal(invalid.status,400); assert.equal(invalid.removed,0);
  const mismatch = await setup(owner,{path:'forms.html'}).call({body:deleteBody});
  assert.equal(mismatch.status,400); assert.equal(mismatch.deleted,0);
  const missing = await setup(owner,{exists:false}).call({body:deleteBody});
  assert.equal(missing.status,200); assert.equal(missing.deleted,0);
});
