const ENDPOINT = 'https://us-central1-cepx-f9d2a.cloudfunctions.net/uploadInformationPdf';
const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadInformationPdf(file, { title, note, getToken, onStatus = () => {} }) {
  if (!file || !/\.pdf$/i.test(file.name)) throw new Error('Choose a PDF file.');
  if (!file.size || file.size > MAX_BYTES) throw new Error('Choose a PDF no larger than 5 MB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') throw new Error('This file is not a PDF.');
  onStatus('Uploading PDF to GitHub…');
  const token = await getToken();
  // Encode in small chunks so mobile browsers do not overflow the call stack.
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 16384) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 16384));
  }
  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: btoa(binary), fileName: file.name, title, note })
    });
  } catch {
    throw new Error('The PDF upload service is unavailable. If this is the first upload, complete the one-time backend setup. Your file has not been removed.');
  }
  let result;
  try { result = await response.json(); }
  catch { throw new Error('The PDF upload service is not ready. Complete the one-time backend setup.'); }
  if (!response.ok) throw new Error(result.error || 'The PDF could not be uploaded.');
  onStatus('Saved in GitHub. Publishing to your website…');
  return result;
}

export async function waitForPublishedPdf(url, attempts = 24) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      if (response.ok && response.headers.get('content-type')?.includes('application/pdf')) return true;
    } catch {}
    if (attempt + 1 < attempts) await new Promise(resolve => setTimeout(resolve, 5000));
  }
  return false;
}

export async function deleteInformationPdf(id, getToken) {
  const token = await getToken();
  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
  } catch {
    throw new Error('The PDF deletion service could not be reached. The entry has been kept; please try again.');
  }
  let result;
  try { result = await response.json(); }
  catch { throw new Error('The PDF deletion service is not ready. Please deploy the updated PDF backend.'); }
  if (result.error === 'Choose a PDF to upload.') {
    throw new Error('PDF deletion needs the updated backend. Deploy it first; your PDF and entry have not been deleted.');
  }
  if (!response.ok || result.deleted !== true) throw new Error(result.error || 'The PDF could not be deleted.');
  return result;
}
