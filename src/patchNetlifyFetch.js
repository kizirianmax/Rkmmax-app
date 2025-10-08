// src/patchNetlifyFetch.js
(function () {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;

  const isVercel = /vercel\.app$/.test(window.location.hostname);
  if (!isVercel) return;        // Netlify → não reescreve nada

  const PREFIX = '/.netlify/functions/';
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith(PREFIX)) {
      const fn = input.slice(PREFIX.length); // ex.: 'status', 'chat'
      return originalFetch(`/api/${fn}`, init);
    }
    return originalFetch(input, init);
  };
})();
