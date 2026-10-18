'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateUpload, savePdfToRepository, MAX_BYTES } = require('./pdf-repository');
const content = Buffer.from('%PDF-1.4\nA test PDF body\n%%EOF\n').toString('base64');

test('rejects non-PDF content, malformed base64 and oversized payloads', () => {
  for (const body of [{}, { content: 'not base64' },
    { content: Buffer.from('<html>not a PDF</html>').toString('base64') },
    { content: Buffer.from('%PDF-1.4 incomplete').toString('base64') },
    { content: 'a'.repeat(Math.ceil(MAX_BYTES / 3) * 4 + 4) }]) {
    assert.throws(() => validateUpload(body));
  }
});
test('generates safe content-addressed paths regardless of supplied filenames', () => {
  const pdf = validateUpload({ content, fileName: '../../index.html', title: ' Document ' });
  assert.match(pdf.path, /^assets\/pdfs\/[a-f0-9]{64}\.pdf$/);
  assert.equal(pdf.title, 'Document');
  assert.equal(pdf.hash, validateUpload({ content }).hash);
  assert.equal(pdf.url, 'https://cepx-f9d2a.firebaseapp.com/' + pdf.path);
});
test('commits PDF bytes only to the fixed repository main branch', async () => {
  const calls = [];
  const pdf = validateUpload({ content });
  const result = await savePdfToRepository(pdf, 'test-secret', async (url, options) => {
    calls.push({ url, options });
    return { ok: calls.length === 2, status: calls.length === 1 ? 404 : 201 };
  });
  assert.equal(result.reused, false);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /^https:\/\/api.github.com\/repos\/Xlyneve\/CEP\/contents\/assets\/pdfs\//);
  const body = JSON.parse(calls[1].options.body);
  assert.equal(body.branch, 'main');
  assert.equal(body.content, content);
  assert(!body.message.includes('test-secret'));
});
test('repeated uploads reuse the file without another commit', async () => {
  let calls = 0;
  const result = await savePdfToRepository(validateUpload({ content }), 'secret', async () => {
    calls++; return { ok: true, status: 200 };
  });
  assert.equal(result.reused, true);
  assert.equal(calls, 1);
});
test('handles simultaneous identical uploads and hides GitHub errors', async () => {
  let calls = 0;
  const result = await savePdfToRepository(validateUpload({ content }), 'secret', async () => {
    calls++; return [{ ok: false, status: 404 }, { ok: false, status: 422 }, { ok: true, status: 200 }][calls - 1];
  });
  assert.equal(result.reused, true);
  await assert.rejects(savePdfToRepository(validateUpload({ content }), 'secret', async () =>
    ({ ok: false, status: 403 })), error => error.status === 502 && !error.message.includes('secret'));
});

test('identifies the GitHub client and trims accidental whitespace from the stored token', async () => {
  let headers;
  await savePdfToRepository(validateUpload({ content }), '  test-secret\n', async (url, options) => {
    headers = options.headers; return { ok: true, status: 200 };
  });
  assert.equal(headers['User-Agent'], 'CEP-PDF-Uploads');
  assert.equal(headers.Authorization, 'Bearer test-secret');
});
test('reports safe HTTP diagnostics without exposing credentials or provider response bodies', async () => {
  for (const status of [401, 403, 500]) {
    await assert.rejects(savePdfToRepository(validateUpload({ content }), 'never-print-this', async () =>
      ({ ok: false, status })), error => error.status === 502 &&
        error.message.includes('HTTP ' + status) && !error.message.includes('never-print-this'));
  }
  await assert.rejects(savePdfToRepository(validateUpload({ content }), 'secret', async () =>
    ({ ok: false, status: 403, headers: { get: () => '0' } })), /rate limit reached/);
});
