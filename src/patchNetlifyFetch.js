// src/patchNetlifyFetch.js
// Só reescreve para /api/* quando estiver rodando no Vercel.
// Na Netlify mantém /.netlify/functions/* como está.

(function () {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;

  const isVercel = /vercel\.app$/.test(window.location.hostname);
  if (!isVercel) {
    // Estamos na Netlify → não faz nada
    return;
  }

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
