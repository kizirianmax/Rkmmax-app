// app.js
document.addEventListener('DOMContentLoaded', () => {
  // menu mobile
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');

  if (btn && nav) {
    const toggle = () => {
      const open = nav.classList.toggle('show');
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', toggle);
  }

  // ano no rodapé (sem quebrar se não houver #year)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // smooth scroll simples (ignora href="#")
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
    const hash = a.getAttribute('href') || '';
    a.addEventListener('click', e => {
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('show');
      btn?.setAttribute('aria-expanded', 'false');
    });
  });
});
