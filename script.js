/* =============================================
   HAEJI WI — PORTFOLIO SCRIPT
   ============================================= */

/* ===========================
   LANGUAGE TOGGLE
   =========================== */
const langBtns = document.querySelectorAll('.lang-btn');
let currentLang = localStorage.getItem('haeji-lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('haeji-lang', lang);

  // Update all translatable text nodes (exclude typing element)
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.id === 'typingEl' || el.id === 'toastMsg') return;
    const text = el.dataset[lang] || el.dataset.en;
    if (text) el.textContent = text;
  });

  // Sync all lang-btn active states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Restart typing animation in new language
  restartTyping();
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Apply on load
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

// Close on nav link click
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
    // Stagger siblings inside the same parent
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
   MARQUEE — CLONE CARDS
   =========================== */
const marqueeTrack = document.getElementById('marqueeTrack');

if (marqueeTrack) {
  const originalCards = Array.from(marqueeTrack.querySelectorAll('.project-card'));
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.appendChild(clone);
  });
}


/* ===========================
   TOAST — MESSAGE CLICK
   =========================== */
const messageLink = document.getElementById('messageLink');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer = null;

if (messageLink && toast && toastMsg) {
  messageLink.addEventListener('click', () => {
    // Show message in current language
    toastMsg.textContent =
      toastMsg.dataset[currentLang] || toastMsg.dataset.en;

    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4200);
  });
}
