(() => {
  'use strict';
  if (window.CEPInformationLinks?.version === 1) return;
  const externalOnlyHosts = [
    'akohiringa.co.nz',
    'healthify.nz',
    'kidshealth.org.nz'
  ];
  function getFormLinkPresentation(rawUrl, record = {}) {
    try {
      const url = new URL(rawUrl);
      const host = url.hostname.toLowerCase();
      const isPdf = Boolean(record.pdfPath) || /\.pdf$/i.test(url.pathname);
      const knownExternal = externalOnlyHosts.some(domain =>
        host === domain || host.endsWith('.' + domain)) ||
        (isPdf && (host === 'sexualwellbeing.org.nz' || host.endsWith('.sexualwellbeing.org.nz')));
      const external = record.previewMode === 'external' ||
        (record.previewMode !== 'preview' && (record.openExternally === true || knownExternal));
      const previewConfirmed = !external && (record.previewMode === 'preview' || url.origin === location.origin);
      return { isPdf, external, previewConfirmed, isWebsite: ['http:', 'https:'].includes(url.protocol) && !isPdf };
    } catch { return { isPdf: false, external: false, isWebsite: false }; }
  }

  function formLinkBadges(kind) {
    const pdf = kind.isPdf ? '<span class="form-link-marker" title="PDF document"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></svg>PDF</span>' : '';
    const external = kind.external ? '<span class="form-link-marker" title="Opens in a new tab; preview unavailable" role="img" aria-label="Opens in a new tab; preview unavailable"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14"/><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg></span>' : '';
    const preview = kind.isWebsite && !kind.external && kind.previewConfirmed ? '<span class="form-link-marker" title="Preview on this page" role="img" aria-label="Preview on this page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/><path d="M14 9v11"/></svg></span>' : '';
    const unchecked = kind.isWebsite && !kind.external && !kind.previewConfirmed ? '<span class="form-link-marker" title="Website; preview not yet checked" role="img" aria-label="Website; preview not yet checked"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg></span>' : '';
    return pdf || external || preview || unchecked ? '<span class="form-link-badges">' + pdf + external + preview + unchecked + '</span>' : '';
  }


  const titleCollator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, ignorePunctuation: true });
  function compareTitles(left, right) {
    return titleCollator.compare(String(left || 'Untitled').trim(), String(right || 'Untitled').trim());
  }
  function sortResults(matches, getEntry = entry => entry) {
    const isInformationLink = match => String(getEntry(match)?.file || '').toLowerCase() === 'forms.html';
    const links = matches.filter(isInformationLink).sort((left, right) => {
      const a = getEntry(left), b = getEntry(right);
      return compareTitles(a.record?.data?.title || a.title, b.record?.data?.title || b.title);
    });
    let next = 0;
    matches.forEach((match, index) => { if (isInformationLink(match)) matches[index] = links[next++]; });
    return matches;
  }
  window.CEPInformationLinks = Object.freeze({
    version: 1, classify: getFormLinkPresentation, badges: formLinkBadges, compareTitles, sortResults
  });
  const style = document.createElement('style');
  style.id = 'cep-information-link-marker-styles';
  style.textContent = `
    html:root:root:root:root:root:root:root:root:root:root:root:root body .form-link-badges {
      display:inline-flex !important; align-items:center; gap:5px; margin-left:5px; vertical-align:middle;
      white-space:nowrap; background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html:root:root:root:root:root:root:root:root:root:root:root:root body .form-link-marker {
      display:inline-flex !important; align-items:center; gap:2px; font:700 9px/1 Tahoma,sans-serif !important;
      color:inherit !important; -webkit-text-fill-color:currentColor !important;
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html:root:root:root:root:root:root:root:root:root:root:root:root body .form-link-marker svg {
      width:13px !important; height:13px !important; flex:none; vertical-align:middle; color:inherit !important;
    }
  `;

  style.textContent += `
    html:root:root:root:root:root:root:root:root:root:root:root:root body .cep-search-source[data-source-file="forms.html"] .cep-source-form {
      display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important;
      height:100% !important; min-height:72px; padding:14px 16px !important; box-sizing:border-box;
    }
    html:root:root:root:root:root:root:root:root:root:root:root:root body .cep-search-source[data-source-file="forms.html"] .cep-source-card-view {
      width:100% !important; text-align:center !important;
    }
    html:root:root:root:root:root:root:root:root:root:root:root:root body .cep-search-source[data-source-file="forms.html"] .cep-source-card-view > strong {
      display:block !important; width:100%; text-align:center !important;
    }
  `;
  document.head.appendChild(style);
})();
