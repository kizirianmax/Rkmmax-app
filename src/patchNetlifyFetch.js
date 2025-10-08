// src/patchNetlifyFetch.js
import { callFn } from './lib/fnClient';

const originalFetch = window.fetch;

window.fetch = async (input, init) => {
  if (typeof input === 'string' && input.startsWith('/.netlify/functions/')) {
    const path = input.replace('/.netlify/functions', ''); // vira '/status', '/chat', etc.
    return await callFn(path, init);
  }
  return originalFetch(input, init);
};
