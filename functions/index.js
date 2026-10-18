'use strict';
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { MAX_BYTES, UploadError, validateUpload, savePdfToRepository, deletePdfFromRepository } = require('./pdf-repository');

initializeApp();
const repositoryToken = defineSecret('CEP_PDF_GITHUB_TOKEN');
const origins = new Set(['https://cepx-f9d2a.firebaseapp.com', 'https://cepx-f9d2a.web.app']);

exports.uploadInformationPdf = onRequest({
  region: 'us-central1', memory: '256MiB', timeoutSeconds: 120,
  maxInstances: 1, concurrency: 1, secrets: [repositoryToken], invoker: 'public'
}, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const origin = req.get('Origin');
  if (origin && !origins.has(origin)) return res.status(403).json({ error: 'This origin is not allowed.' });
  if (origin) { res.set('Access-Control-Allow-Origin', origin); res.set('Vary', 'Origin'); }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST to upload a PDF.' });
  try {
    const match = /^Bearer (\S+)$/.exec(req.get('Authorization') || '');
    if (!match) throw new UploadError(401, 'Please sign in before uploading.');
    let user;
    try { user = await getAuth().verifyIdToken(match[1], true); }
    catch { throw new UploadError(401, 'Your session has expired. Please sign in again.'); }
    if (user.email !== 'xeve06@gmail.com' || user.email_verified !== true) {
      throw new UploadError(403, 'This account cannot upload PDFs.');
    }
    if (!req.is('application/json')) throw new UploadError(415, 'Send the PDF as JSON.');
    if (req.rawBody?.length > Math.ceil(MAX_BYTES / 3) * 4 + 16000) {
      throw new UploadError(413, 'Choose a PDF no larger than 5 MB.');
    }
    if (req.body?.action === 'delete') {
      const id = req.body.id;
      if (typeof id !== 'string' || !/^pdf-[a-f0-9]{64}$/.test(id)) {
        throw new UploadError(400, 'Only uploaded Information Links PDFs can be deleted.');
      }
      const doc = getFirestore().collection('urlForms').doc(id);
      const snapshot = await doc.get();
      if (!snapshot.exists) return res.json({ deleted: true, id });
      // Derive the repository path from the saved entry, never a browser-supplied path.
      const path = snapshot.data().pdfPath;
      if (path !== `assets/pdfs/${id.slice(4)}.pdf`) {
        throw new UploadError(400, 'This entry does not identify a valid uploaded PDF.');
      }
      await deletePdfFromRepository(path, repositoryToken.value());
      // Keep the entry on repository errors so the user can retry safely.
      await doc.delete();
      return res.json({ deleted: true, id, publishing: true });
    }
    if (req.body?.action && req.body.action !== 'upload') {
      throw new UploadError(400, 'Unknown PDF action.');
    }
    const pdf = validateUpload(req.body);
    await savePdfToRepository(pdf, repositoryToken.value());
    const doc = getFirestore().collection('urlForms').doc(`pdf-${pdf.hash}`);
    await getFirestore().runTransaction(async transaction => {
      const existing = await transaction.get(doc);
      if (!existing.exists) transaction.create(doc, {
        url: pdf.url, title: pdf.title, note: pdf.note,
        pdfPath: pdf.path, pdfBytes: pdf.bytes.length, pdfFileName: pdf.fileName,
        openCount: 0, createdAt: FieldValue.serverTimestamp()
      });
    });
    return res.json({ id: doc.id, url: pdf.url, title: pdf.title });
  } catch (error) {
    // Never send GitHub response bodies or credentials to the browser/logs.
    const status = error instanceof UploadError ? error.status : 500;
    const message = error instanceof UploadError ? error.message :
      (req.body?.action === 'delete'
        ? 'The PDF could not be deleted completely. Please try again.'
        : 'The PDF upload could not finish. Please try again; the same file will not be duplicated.');
    return res.status(status).json({ error: message });
  }
});
