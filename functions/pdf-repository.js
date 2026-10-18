'use strict';
const { createHash } = require('node:crypto');

const MAX_BYTES = 5 * 1024 * 1024;
const REPOSITORY = 'Xlyneve/CEP';
const HOSTING_ORIGIN = 'https://cepx-f9d2a.firebaseapp.com';

class UploadError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function validateUpload(body) {
  if (!body || typeof body !== 'object' || typeof body.content !== 'string') {
    throw new UploadError(400, 'Choose a PDF to upload.');
  }
  const { content } = body;
  if (!content.length || content.length > Math.ceil(MAX_BYTES / 3) * 4) {
    throw new UploadError(413, 'Choose a PDF no larger than 5 MB.');
  }
  if (content.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(content)) {
    throw new UploadError(400, 'The PDF could not be read. Please select it again.');
  }
  const bytes = Buffer.from(content, 'base64');
  if (bytes.length > MAX_BYTES) throw new UploadError(413, 'Choose a PDF no larger than 5 MB.');
  if (bytes.length < 8 || bytes.subarray(0, 5).toString('ascii') !== '%PDF-' ||
      !bytes.subarray(Math.max(0, bytes.length - 1024)).includes(Buffer.from('%%EOF'))) {
    throw new UploadError(400, 'This file does not appear to be a complete PDF.');
  }
  const fileName = typeof body.fileName === 'string' ? body.fileName.slice(0, 200) : 'Document.pdf';
  const title = (typeof body.title === 'string' ? body.title.trim() : '').slice(0, 200) ||
    fileName.replace(/\.pdf$/i, '') || 'PDF document';
  const note = (typeof body.note === 'string' ? body.note.trim() : '').slice(0, 4000);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const path = `assets/pdfs/${hash}.pdf`;
  return { bytes, hash, path, title, note, fileName, url: `${HOSTING_ORIGIN}/${path}` };
}

async function savePdfToRepository(pdf, token, request = fetch) {
  const endpoint = `https://api.github.com/repos/${REPOSITORY}/contents/${pdf.path}`;
  const headers = {
    Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json'
  };
  const existing = await request(`${endpoint}?ref=main`, { headers, signal: AbortSignal.timeout(20000) });
  if (existing.ok) return { reused: true };
  if (existing.status !== 404) throw new UploadError(502, 'GitHub could not be reached. Please try again later.');
  const response = await request(endpoint, {
    method: 'PUT', headers, signal: AbortSignal.timeout(45000),
    body: JSON.stringify({ message: `Add Information Links PDF ${pdf.hash.slice(0, 12)}`,
      content: pdf.bytes.toString('base64'), branch: 'main' })
  });
  if (!response.ok) {
    // Another simultaneous upload of the same PDF may have created it first.
    if (response.status === 409 || response.status === 422) {
      const check = await request(`${endpoint}?ref=main`, { headers, signal: AbortSignal.timeout(20000) });
      if (check.ok) return { reused: true };
    }
    throw new UploadError(502, 'GitHub could not save the PDF. Please try again later.');
  }
  return { reused: false };
}

module.exports = { MAX_BYTES, UploadError, validateUpload, savePdfToRepository };
