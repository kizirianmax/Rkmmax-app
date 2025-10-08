// src/patchNetlifyFetch.js
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;

  const isNF = (u) => typeof u === 'string' && u.startsWith('/.netlify/functions/');

  window.fetch = async (input, init) => {
    if (!isNF(input)) return originalFetch(input, init);

    // 1) Tenta Netlify (seu caso atual)
    try {
      const res = await originalFetch(input, init);
      if (res && res.status !== 404) return res;
    } catch (_) {}

    // 2) Fallback p/ Vercel (se um dia mudar)
    const vercelPath = input.replace('/.netlify/functions', '/api');
    return originalFetch(vercelPath, init);
  };
}
