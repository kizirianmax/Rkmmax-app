// menu mobile
const btn = document.getElementById('menuBtn');
const nav = document.getElementById('navLinks');
btn?.addEventListener('click', () => nav.classList.toggle('show'));

// ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// smooth scroll simples
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
      nav?.classList.remove('show');
    }
  });
});
