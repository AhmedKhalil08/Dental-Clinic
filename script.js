document.addEventListener('DOMContentLoaded', () => {

  /* Preloader */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => setTimeout(() => preloader.classList.add('hidden'), 700));

  /* Dark Mode */
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('royal-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('royal-theme', next);
  });

  /* Navbar */
  const navbar = document.querySelector('.navbar');
  const btt = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 50);
    btt.classList.toggle('visible', scrollY > 400);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mobile menu */
  const ham = document.querySelector('.hamburger');
  const mob = document.querySelector('.mobile-menu');
  ham.addEventListener('click', () => {
    ham.classList.toggle('active');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('active'); mob.classList.remove('open'); document.body.style.overflow = '';
  }));

  /* Reveal */
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* Counters — Arabic-Eastern numerals */
  const toAr = n => n.toLocaleString('ar-EG');
  const cObs = new IntersectionObserver(es => {
    es.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.ceil(target / 45);
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = toAr(cur) + suffix;
      }, 30);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => cObs.observe(el));

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
//---------Courasel
// ===== قسم قبل وبعد =====
window.addEventListener('load', () => {
  const track = document.getElementById('baTrack');
  if (!track) return;

  const slides = track.querySelectorAll('.ba-slide');
  const prevBtn = document.getElementById('baPrev');
  const nextBtn = document.getElementById('baNext');
  const dots = document.querySelectorAll('.ba-dot');

  let current = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000;

  const resetCompare = (compare) => {
    if (!compare) return;
    const afterWrap = compare.querySelector('.ba-after-wrap');
    const handle = compare.querySelector('.ba-handle');
    afterWrap.style.clipPath = 'inset(0 0 0 50%)';
    handle.style.left = '50%';
    compare.dataset.pos = 50;
  };

  const goTo = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetCompare(slides[current].querySelector('.ba-compare'));
  };

  const stopAutoplay = () => {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  };
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
  };

  prevBtn.addEventListener('click', () => { goTo(current - 1); stopAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); stopAutoplay(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
      stopAutoplay();
    });
  });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('touchstart', stopAutoplay, { passive: true });

  const setupCompare = (compare) => {
    const afterWrap = compare.querySelector('.ba-after-wrap');
    const handle = compare.querySelector('.ba-handle');
    let dragging = false;

    const updatePosition = (clientX) => {
      const rect = compare.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      afterWrap.style.clipPath = `inset(0 0 0 ${pos}%)`;
      handle.style.left = pos + '%';
    };

    compare.addEventListener('mousedown', (e) => { dragging = true; updatePosition(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', (e) => { if (dragging) updatePosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    compare.addEventListener('touchstart', (e) => { dragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });
    compare.addEventListener('touchmove', (e) => { if (dragging) updatePosition(e.touches[0].clientX); }, { passive: true });
    compare.addEventListener('touchend', () => { dragging = false; });
  };

  document.querySelectorAll('.ba-compare').forEach(setupCompare);
  startAutoplay();
});
//-------------FORM-----------------------------
// ===== Booking Form =====
const form = document.getElementById('form');

if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const message = document.getElementById('formMessage');

  const showMessage = (text, type) => {
    message.textContent = text;
    message.className = 'form-message ' + type;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    formData.append("access_key", "2652addd-80bd-421a-ad78-f2e7a2cf6733");

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "جارٍ الإرسال...";
    submitBtn.disabled = true;
    showMessage('', '');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        showMessage('✓ تم إرسال الحجز بنجاح! سنتواصل معك قريباً.', 'success');
        form.reset();
      } else {
        showMessage('✗ حدث خطأ: ' + data.message, 'error');
      }
    } catch (error) {
      showMessage('✗ حدث خطأ. حاول مرة أخرى.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
//-------------------------------------------------