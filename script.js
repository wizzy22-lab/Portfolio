/* =============================================
   HAEJI WI — PORTFOLIO SCRIPT
   ============================================= */

/* ===========================
   LANGUAGE TOGGLE
   =========================== */
const langBtns = document.querySelectorAll('.lang-pill-btn');
let currentLang = localStorage.getItem('haeji-lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('haeji-lang', lang);

  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.id === 'typingEl' || el.id === 'toastMsg') return;
    const text = el.dataset[lang] || el.dataset.en;
    if (text) el.textContent = text;
  });

  document.querySelectorAll('.lang-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  restartTyping();
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(currentLang);


/* ===========================
   TYPING ANIMATION
   =========================== */
const typingTexts = {
  en: ['Product Designer', 'Brand & Experience Lead'],
  ko: ['프로덕트 디자이너', '브랜드 & 경험 리드'],
};

const typingEl = document.getElementById('typingEl');
let typeIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeTimer = null;

function type() {
  const texts = typingTexts[currentLang] || typingTexts.en;
  const current = texts[typeIdx % texts.length];

  if (isDeleting) {
    typingEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
  } else {
    typingEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && charIdx === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    typeIdx = (typeIdx + 1) % texts.length;
    delay = 400;
  }

  typeTimer = setTimeout(type, delay);
}

function restartTyping() {
  clearTimeout(typeTimer);
  charIdx = 0;
  isDeleting = false;
  typeIdx = 0;
  typingEl.textContent = '';
  type();
}

type();


/* ===========================
   NAVBAR — SCROLL BEHAVIOUR
   =========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ===========================
   HAMBURGER MENU
   =========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ===========================
   SCROLL SPY
   =========================== */
const spySections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('#navLinks a');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      desktopNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

spySections.forEach(s => spyObserver.observe(s));


/* ===========================
   SCROLL FADE-IN
   =========================== */
const fadeTargets = document.querySelectorAll('.fade-in, .section-fade');

const fadeObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(
      entry.target.parentElement.querySelectorAll('.fade-in, .section-fade')
    );
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => {
      entry.target.classList.add('visible');
    }, idx * 70);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

fadeTargets.forEach(el => fadeObserver.observe(el));


/* ===========================
   PROJECTS — ACCORDION
   =========================== */
const accItems = document.querySelectorAll('.acc-item');

accItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    accItems.forEach(i => i.classList.remove('open'));
    item.classList.add('open');
  });
});


/* ===========================
   TIMELINE — SVG WAVY LINE DRAWING
   =========================== */
const timelineEl  = document.querySelector('.timeline');
const pathEl      = document.getElementById('timelinePath');

function buildWavePath(totalHeight, amplitude, wavelength) {
  const amp = amplitude || 10;
  const wl  = wavelength || 80;
  const cx  = 13;
  const points = [];
  for (let y = 0; y <= totalHeight; y += 4) {
    const x = cx + Math.sin((y / wl) * Math.PI * 2) * amp;
    points.push(`${x},${y}`);
  }
  return 'M ' + points.join(' L ');
}

function initWavePath() {
  if (!timelineEl || !pathEl) return;
  const h = timelineEl.offsetHeight;
  pathEl.setAttribute('d', buildWavePath(h));
  const len = pathEl.getTotalLength();
  pathEl.style.strokeDasharray  = len;
  pathEl.style.strokeDashoffset = len;
}

function updateWavePath() {
  if (!timelineEl || !pathEl) return;
  const rect    = timelineEl.getBoundingClientRect();
  const total   = timelineEl.offsetHeight;
  const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.6);
  const pct     = Math.min(scrolled / total, 1);
  const len     = parseFloat(pathEl.style.strokeDasharray) || pathEl.getTotalLength();
  pathEl.style.strokeDashoffset = len * (1 - pct);
}

window.addEventListener('load', initWavePath);
window.addEventListener('resize', initWavePath);
window.addEventListener('scroll', updateWavePath, { passive: true });


/* ===========================
   ABOUT — STAT COUNTER
   =========================== */
const statNums = document.querySelectorAll('.stat-num[data-target]');
let counterDone = false;

function animateCounter(el, target, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + '+';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterDone) {
      counterDone = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1200);
      });
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);


/* ===========================
   TOAST — MESSAGE CLICK
   =========================== */
const messageLink = document.getElementById('messageLink');
const toast       = document.getElementById('toast');
const toastMsg    = document.getElementById('toastMsg');
let toastTimer    = null;

if (messageLink && toast && toastMsg) {
  messageLink.addEventListener('click', () => {
    toastMsg.textContent =
      toastMsg.dataset[currentLang] || toastMsg.dataset.en;

    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4200);
  });
}
