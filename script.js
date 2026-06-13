/* ─────────────────────────────────────────────
   VISHNU PORTFOLIO — script.js
   Handles: loader, cursor, particles, navbar,
   typing, scroll reveal, skill bars, counters,
   modal, hamburger, scroll-to-top, form
───────────────────────────────────────────── */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left  = mouseX + 'px';
  dot.style.top   = mouseY + 'px';
  dot.style.transform = 'translate(-50%, -50%)';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left      = ringX + 'px';
  ring.style.top       = ringY + 'px';
  ring.style.transform = 'translate(-50%, -50%)';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .project-card, .achievement-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── PARTICLE SYSTEM ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.life++;
      const t   = this.life / this.maxLife;
      this.alpha = t < 0.1 ? (t / 0.1) * this.maxAlpha
                 : t > 0.8 ? ((1 - t) / 0.2) * this.maxAlpha
                 : this.maxAlpha;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,94,247,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const a = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,94,247,${a})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNav();
  toggleScrollTop();
});

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV ── */
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';
  sections.forEach(s => {
    const top = s.offsetTop - 100;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

/* ── TYPED TEXT ── */
const phrases = [
  'AI Solutions.',
  'ML Models.',
  'NLP Systems.',
  'Data Pipelines.',
  'Python Apps.',
];
let pIndex = 0, cIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const phrase = phrases[pIndex];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++cIndex);
    if (cIndex === phrase.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --cIndex);
    if (cIndex === 0) {
      deleting = false;
      pIndex   = (pIndex + 1) % phrases.length;
      setTimeout(type, 300);
      return;
    }
  }
  setTimeout(type, deleting ? 55 : 90);
}
setTimeout(type, 1200);

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = Array.from(e.target.parentElement.children).indexOf(e.target) * 80;
      setTimeout(() => e.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        const target = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = target + '%'; }, 300);
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ── ANIMATED COUNTERS ── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const start  = parseInt(el.textContent) || 0;
  const dur    = 1600;
  const step   = (target - start) / (dur / 16);
  let cur      = start;
  const timer  = setInterval(() => {
    cur += step;
    if ((step > 0 && cur >= target) || (step < 0 && cur <= target)) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(cur);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ── SCROLL TO TOP ── */
const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── PROJECT MODALS ── */
const modalData = {
  email: {
    icon: '📧',
    title: 'Email Detection System',
    sub: 'Python · Machine Learning · scikit-learn · Pandas',
    desc: 'A robust machine learning pipeline that classifies email messages as spam or legitimate with high precision. Built end-to-end from raw data ingestion to model deployment.',
    features: [
      'Data preprocessing: tokenization, stop-word removal, TF-IDF vectorization',
      'Trained multiple classifiers: Naive Bayes, SVM, Logistic Regression',
      'Hyperparameter tuning using GridSearchCV for optimal accuracy',
      'Evaluated with precision, recall, F1-score, and confusion matrix',
      'Handles edge cases like HTML email bodies and URL patterns',
    ],
    tags: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'NLP'],
    github: 'https://github.com/vishnuyaduvanshi',
  },
  chatbot: {
    icon: '🤖',
    title: 'AI Chatbot System',
    sub: 'Python · NLP · Intent Recognition · Conversational AI',
    desc: 'An intelligent conversational agent that understands natural language, recognizes user intent, and generates contextually relevant responses — simulating human-like dialogue.',
    features: [
      'Intent classification using pattern matching and NLP techniques',
      'Entity extraction to parse key information from user messages',
      'Context-aware dialogue management for multi-turn conversations',
      'Response generation using pre-defined knowledge base',
      'Extendable architecture for adding new intents and responses',
    ],
    tags: ['Python', 'NLTK', 'JSON', 'Re (Regex)', 'NLP', 'Conversational AI'],
    github: 'https://github.com/vishnuyaduvanshi',
  },
};

function openModal(key) {
  const data    = modalData[key];
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <div class="modal-icon">${data.icon}</div>
    <h2>${data.title}</h2>
    <div class="modal-sub">${data.sub}</div>
    <p>${data.desc}</p>
    <div class="modal-features">
      <ul>
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-tags">
      ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
    <div class="modal-actions">
      <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-outline">View on GitHub</a>
      <button class="btn btn-primary" onclick="closeModal()">Close</button>
    </div>
  `;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── CONTACT FORM ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn     = document.getElementById('submitText');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    success.style.display = 'block';
    document.getElementById('contactForm').reset();
    setTimeout(() => { success.style.display = 'none'; }, 4000);
  }, 1200);
}

/* ── SMOOTH SCROLL for SAME-PAGE LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── HERO PARALLAX (subtle) ── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundPositionY = window.scrollY * 0.3 + 'px';
  }
});
