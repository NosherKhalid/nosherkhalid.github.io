(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  // Cursor spotlight on the page background and on product cards
  addEventListener('pointermove', (e) => {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });
  document.querySelectorAll('.product').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--px', e.clientX - r.left + 'px');
      card.style.setProperty('--py', e.clientY - r.top + 'px');
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Screenshot carousels: rotate only while visible
  const phones = [...document.querySelectorAll('[data-carousel]')];
  const visible = new Set();
  const pio = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target));
  }, { threshold: 0.4 });
  phones.forEach((p, i) => { p.dataset.offset = i % 3; pio.observe(p); });
  if (!reduced) {
    let tick = 0;
    setInterval(() => {
      tick++;
      visible.forEach((p) => {
        if ((tick + +p.dataset.offset) % 2) return; // stagger cards
        const imgs = p.querySelectorAll('img');
        const i = [...imgs].findIndex((im) => im.classList.contains('active'));
        imgs[i].classList.remove('active');
        imgs[(i + 1) % imgs.length].classList.add('active');
      });
    }, 1600);
  }

  // Active tab follows scroll position
  const tabs = [...document.querySelectorAll('.tab')];
  const sections = tabs.map((t) => document.querySelector(t.getAttribute('href')));
  const setActive = () => {
    const y = scrollY + innerHeight * 0.35;
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) idx = sections.length - 1;
    if (tabs[idx].classList.contains('active')) return;
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
    const strip = tabs[idx].parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tabs[idx].offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
    }
  };
  addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
