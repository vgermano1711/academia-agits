// ============================================================
// FIO SOB MEDIDA — Advanced Animations Module
// Particle Canvas · Typewriter · Testimonial Slider
// ============================================================

// ── Particle Canvas System ────────────────────────────────
function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let animId;

  const COLORS = [
    'rgba(244,184,193,',
    'rgba(232,136,154,',
    'rgba(201,169,110,',
    'rgba(212, 96,122,',
    'rgba(255,255,255,',
  ];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 3 + 1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = -(Math.random() * 0.8 + 0.3);
      this.life = 0;
      this.maxLife = 200 + Math.random() * 150;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const progress = this.life / this.maxLife;
      const fade = progress < 0.1 ? progress * 10 : progress > 0.85 ? (1 - progress) * 6.67 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${(this.alpha * fade).toFixed(2)})`;
      ctx.fill();
    }
  }

  function resize() {
    const hero = document.getElementById('hero');
    W = canvas.width = hero ? hero.offsetWidth : window.innerWidth;
    H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  const resizeObs = new ResizeObserver(resize);
  const hero = document.getElementById('hero');
  if (hero) resizeObs.observe(hero);
  window.addEventListener('resize', resize);

  init();
  loop();

  // Pause when tab hidden for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
}

// ── Typewriter Effect ────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter-target');
  if (!el) return;

  const phrases = [
    'sob medida',
    'personalizado',
    'único como você',
    'com a Mariana',
    'sob medida',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pausing = false;

  function type() {
    const current = phrases[phraseIdx];

    if (pausing) return;

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        pausing = true;
        setTimeout(() => { pausing = false; deleting = true; }, 2200);
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
  }

  // Start after a brief delay (after page load)
  setTimeout(() => {
    setInterval(type, deleting ? 55 : 100);
  }, 1800);

  // Simpler: use separate intervals for typing/deleting
  let typingInterval;
  function startTyping() {
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = false;
          clearInterval(typingInterval);
          setTimeout(startDeleting, 2400);
        }
      }
    }, 90);
  }

  function startDeleting() {
    deleting = true;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
      const current = phrases[phraseIdx];
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        clearInterval(typingInterval);
        setTimeout(startTyping, 400);
      }
    }, 50);
  }

  // Initialize
  el.textContent = phrases[0];
  charIdx = phrases[0].length;
  setTimeout(startDeleting, 2600);
}

// ── Testimonials Slider ───────────────────────────────────
function initTestimonialsSlider() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  const dotsWrap = document.getElementById('t-dots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = [...track.querySelectorAll('.testimonial-card')];
  if (!cards.length) return;

  const perView = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  let current = 0;
  const total = () => Math.ceil(cards.length / perView());

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total(); i++) {
      const dot = document.createElement('button');
      dot.className = `t-dot${i === current ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap?.querySelectorAll('.t-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total() - 1));
    const pv = perView();
    const startCard = current * pv;

    cards.forEach((card, i) => {
      const inView = i >= startCard && i < startCard + pv;
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = inView ? '1' : '0.3';
      card.style.transform = inView ? 'scale(1)' : 'scale(0.95)';
      card.style.display = '';
    });

    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoTimer = setInterval(() => goTo((current + 1) % total()), 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo((current + 1) % total()), 5000);
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
  });

  buildDots();
  goTo(0);
}

// ── Hero Entry Animation (staggered) ─────────────────────
function initHeroEntry() {
  const elements = [
    document.querySelector('.hero-tag'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-subtitle'),
    document.querySelector('.hero-actions'),
    document.querySelector('.hero-stats'),
  ].filter(Boolean);

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 130);
  });

  const visual = document.querySelector('.hero-visual-wrap');
  if (visual) {
    visual.style.opacity = '0';
    visual.style.transform = 'translateX(40px) scale(0.95)';
    setTimeout(() => {
      visual.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
      visual.style.opacity = '1';
      visual.style.transform = 'translateX(0) scale(1)';
    }, 500);
  }
}

// ── Gradient text animation on section titles ─────────────
function initGradientTitles() {
  document.querySelectorAll('.section-title em, .hero-title em').forEach(el => {
    el.style.backgroundImage = 'linear-gradient(90deg, var(--rose-mid), var(--rose-deep), var(--gold), var(--rose-mid))';
    el.style.backgroundSize = '200% auto';
    el.style.webkitBackgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.backgroundClip = 'text';
    el.style.animation = 'gradient-shift 4s linear infinite';
  });

  // Inject keyframes
  if (!document.getElementById('gradient-kf')) {
    const style = document.createElement('style');
    style.id = 'gradient-kf';
    style.textContent = `
      @keyframes gradient-shift {
        0%   { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ── Magnetic effect on primary CTA ───────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initHeroEntry();
  initGradientTitles();
  initMagneticButtons();

  // Testimonials slider — init after a tick so DOM is ready
  requestAnimationFrame(initTestimonialsSlider);
});
