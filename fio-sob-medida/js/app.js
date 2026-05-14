// ============================================================
// FIO SOB MEDIDA — Main App Controller
// Parallax, Navigation, State Management, Chat Renderer
// ============================================================

import { MarianaBot } from './chatbot.js';
import { renderDashboard } from './dashboard.js';
import { renderMarketplace } from './marketplace.js';
import { HAIR_TYPES, CONDITIONS, OBJECTIVES, TIME_OPTIONS, BRANDS, Storage } from './data.js';

// ── Scroll Progress Bar ───────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrolled / max) * 100}%`;
  }, { passive: true });
}

// ── Multi-Layer Parallax Engine ────────────────────────────
function initParallax() {
  const bg = document.querySelector('.hero-parallax');
  const orbs = document.querySelectorAll('.hero-orb');
  const heroVisual = document.querySelector('.hero-visual-wrap');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      // Background layer — slowest
      if (bg) bg.style.transform = `translateY(${y * 0.55}px)`;

      // Orbs at different speeds
      orbs.forEach((orb, i) => {
        const speeds = [0.25, 0.35, 0.18];
        const dirs = [1, -1, 1];
        orb.style.transform = `translateY(${y * speeds[i] * dirs[i]}px)`;
      });

      // Hero visual — slight inverse parallax for depth
      if (heroVisual && y < window.innerHeight) {
        heroVisual.style.transform = `translateY(${y * -0.08}px)`;
      }

      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Mouse Parallax (cursor tracking on hero) ───────────────
function initMouseParallax() {
  const hero = document.getElementById('hero');
  const tiltTarget = document.getElementById('hero-tilt');
  const floaters = document.querySelectorAll('.float-element');
  if (!hero || !tiltTarget) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
  });

  hero.addEventListener('mouseleave', () => {
    mouseX = 0; mouseY = 0;
  });

  function animateMouse() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    const tiltX = currentY * 14;
    const tiltY = currentX * -14;
    tiltTarget.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${window.scrollY * -0.08}px)`;

    floaters.forEach((el, i) => {
      const strength = (i + 1) * 8;
      const dir = i % 2 === 0 ? 1 : -1;
      el.style.transform = `translate(${currentX * strength * dir}px, ${currentY * strength}px)`;
    });

    requestAnimationFrame(animateMouse);
  }
  animateMouse();
}

// ── Intersection Observer with stagger support ─────────────
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach((el, i) => {
    // Apply stagger delay to sibling groups
    const parent = el.parentElement;
    const siblings = parent ? [...parent.querySelectorAll('.reveal-on-scroll')] : [];
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx < 7) {
      el.classList.add(`stagger-${idx}`);
    }
    observer.observe(el);
  });
}

// ── Navigation ──────────────────────────────────────────────
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky nav on scroll
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');
      if (target?.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          const offset = 80;
          window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
        }
        if (navMenu) navMenu.classList.remove('open');
      }
    });
  });

  // Mobile menu
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });
  }

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    });
  }, { passive: true });
}

// ── Chat Renderer ───────────────────────────────────────────
let bot;

function initChat() {
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const optionsContainer = document.getElementById('chat-options');
  const startBtn = document.getElementById('start-chat-btn');
  const restartBtn = document.getElementById('restart-chat-btn');

  if (!chatWindow) return;

  // Load saved profile
  const savedProfile = Storage.load('profile');
  if (savedProfile?.schedule) {
    showRestorePrompt(savedProfile);
    return;
  }

  bot = new MarianaBot(handleBotUpdate);

  startBtn?.addEventListener('click', () => {
    document.querySelector('.chat-start-overlay')?.remove();
    bot.start();
  });

  restartBtn?.addEventListener('click', () => {
    if (bot) bot.reset();
    chatWindow.innerHTML = '';
    if (optionsContainer) optionsContainer.innerHTML = '';
    initChat();
  });

  sendBtn?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

function showRestorePrompt(savedProfile) {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) return;

  chatWindow.innerHTML = `
    <div class="restore-prompt">
      <div class="restore-avatar">💆‍♀️</div>
      <h3>Bem-vinda de volta, <span>${savedProfile.userName}</span>!</h3>
      <p>Encontrei seu diagnóstico anterior. Deseja continuar de onde parou?</p>
      <div class="restore-buttons">
        <button class="btn-restore" id="btn-continue">Sim, continuar! ✨</button>
        <button class="btn-restore btn-secondary" id="btn-restart">Refazer diagnóstico</button>
      </div>
    </div>
  `;

  document.getElementById('btn-continue')?.addEventListener('click', () => {
    bot = new MarianaBot(handleBotUpdate);
    bot.profile = savedProfile;
    bot.diagnosisGenerated = true;
    bot.state = 'chat';

    chatWindow.innerHTML = '';
    const schedule = Storage.load('schedule');
    appendMessage('mariana', `Que saudade, ${savedProfile.userName}! Seu cronograma está ativo. Posso ajudar com algo mais? 💕`);
    showTextInput();
    renderDashboard(savedProfile, schedule);
    renderMarketplace(savedProfile);
    renderBrands();
  });

  document.getElementById('btn-restart')?.addEventListener('click', () => {
    Storage.clear('profile');
    Storage.clear('schedule');
    chatWindow.innerHTML = '';
    bot = new MarianaBot(handleBotUpdate);
    bot.start();
    showTextInput();
  });
}

function handleBotUpdate(event, data) {
  switch (event) {
    case 'message':
      appendMessage(data.sender, data.content, data.time);
      break;
    case 'typing':
      toggleTypingIndicator(data);
      break;
    case 'show_options':
      renderOptions(data.step);
      break;
    case 'show_text_input':
      showTextInput();
      break;
    case 'diagnosis_complete':
      const schedule = Storage.load('schedule');
      renderDashboard(data, schedule);
      renderMarketplace(data);
      renderBrands();
      scrollToSection('dashboard-section');
      break;
  }
}

function appendMessage(sender, content, time) {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) return;

  removeTypingIndicator();

  const isBot = sender === 'mariana';
  const msgEl = document.createElement('div');
  msgEl.className = `message ${isBot ? 'message-bot' : 'message-user'}`;

  if (typeof content === 'object' && content.type === 'diagnosis_card') {
    msgEl.innerHTML = renderDiagnosisCard(content.data);
  } else {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    const formatted = formatMarkdown(textContent);
    msgEl.innerHTML = `
      ${isBot ? '<div class="bot-avatar"><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana&backgroundColor=F4B8C1" alt="Mariana" /></div>' : ''}
      <div class="message-bubble">
        ${isBot ? '<span class="bot-name">Mariana</span>' : ''}
        <p>${formatted}</p>
        <span class="message-time">${time || ''}</span>
      </div>
    `;
  }

  msgEl.style.opacity = '0';
  msgEl.style.transform = `translateY(10px)`;
  chatWindow.appendChild(msgEl);

  requestAnimationFrame(() => {
    msgEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    msgEl.style.opacity = '1';
    msgEl.style.transform = 'translateY(0)';
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderDiagnosisCard(data) {
  const { hairLabel, condLabel, objLabel, timeLabel, schedule } = data;
  return `
    <div class="bot-avatar"><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana&backgroundColor=F4B8C1" alt="Mariana" /></div>
    <div class="message-bubble diagnosis-bubble">
      <span class="bot-name">Mariana</span>
      <div class="diagnosis-card">
        <div class="diagnosis-header">
          <span class="diagnosis-icon">🔬</span>
          <div>
            <h4>Diagnóstico Capilar</h4>
            <p>${schedule.userName}</p>
          </div>
        </div>
        <div class="diagnosis-chips">
          <span class="chip">💇 ${hairLabel}</span>
          <span class="chip">📊 ${condLabel}</span>
          <span class="chip">🎯 ${objLabel}</span>
          <span class="chip">📅 ${timeLabel}</span>
        </div>
        <div class="diagnosis-protocol">
          <p><strong>Protocolo recomendado:</strong> ${schedule.weeklyGoal}</p>
          <p class="diagnosis-steps-preview">${schedule.steps.length} sessões semanais • ${schedule.steps.reduce((a, s) => a + s.treatments.length, 0)} etapas totais</p>
        </div>
        <div class="diagnosis-actions">
          <button class="btn-view-schedule" onclick="scrollToSection('dashboard-section')">Ver cronograma completo →</button>
          <button class="btn-view-products" onclick="scrollToSection('marketplace-section')">Ver produtos →</button>
        </div>
      </div>
    </div>
  `;
}

function renderOptions(step) {
  const optionsContainer = document.getElementById('chat-options');
  if (!optionsContainer) return;

  const optionMaps = {
    hairType: Object.entries(HAIR_TYPES).map(([k, v]) => ({
      value: k, label: `${v.icon} ${v.label}`, stateKey: 'hairType', desc: v.desc,
    })),
    condition: Object.entries(CONDITIONS).map(([k, v]) => ({
      value: k, label: `${v.icon} ${v.label}`, stateKey: 'condition', desc: v.desc,
    })),
    objective: Object.entries(OBJECTIVES).map(([k, v]) => ({
      value: k, label: `${v.icon} ${v.label}`, stateKey: 'objective', desc: v.desc,
    })),
    time: Object.entries(TIME_OPTIONS).map(([k, v]) => ({
      value: k, label: `${v.icon} ${v.label}`, stateKey: 'time', desc: v.desc,
    })),
  };

  const options = optionMaps[step] || [];
  optionsContainer.innerHTML = `
    <div class="options-grid">
      ${options.map(opt => `
        <button
          class="option-btn"
          data-value="${opt.value}"
          data-label="${opt.label}"
          data-state-key="${opt.stateKey}"
          title="${opt.desc || ''}"
        >
          ${opt.label}
          ${opt.desc ? `<span class="option-desc">${opt.desc}</span>` : ''}
        </button>
      `).join('')}
    </div>
  `;

  optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      optionsContainer.innerHTML = '';
      hideTextInput();
      bot?.handleInput({
        value: btn.dataset.value,
        label: btn.dataset.label,
        stateKey: btn.dataset.stateKey,
      });
    });
  });
}

function showTextInput() {
  const inputArea = document.getElementById('chat-input-area');
  if (inputArea) inputArea.classList.remove('hidden');
  document.getElementById('chat-input')?.focus();
}

function hideTextInput() {
  const inputArea = document.getElementById('chat-input-area');
  if (inputArea) inputArea.classList.add('hidden');
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !bot) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  bot.handleInput(text);
}

function toggleTypingIndicator(show) {
  if (show) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow || chatWindow.querySelector('.typing-indicator')) return;
    const el = document.createElement('div');
    el.className = 'message message-bot typing-indicator';
    el.innerHTML = `
      <div class="bot-avatar"><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mariana&backgroundColor=F4B8C1" alt="Mariana" /></div>
      <div class="message-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } else {
    removeTypingIndicator();
  }
}

function removeTypingIndicator() {
  document.querySelector('.typing-indicator')?.remove();
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ── Brands Section ──────────────────────────────────────────
function renderBrands() {
  const section = document.getElementById('brands-section');
  if (!section) return;
  section.classList.remove('hidden');
  section.classList.add('visible');

  const grid = section.querySelector('.brands-grid');
  if (!grid) return;

  grid.innerHTML = BRANDS.map(brand => `
    <div class="brand-card reveal-on-scroll">
      <div class="brand-logo-wrap">
        <span class="brand-logo">${brand.logo}</span>
      </div>
      <div class="brand-info">
        <h4>${brand.name}</h4>
        <p>${brand.description}</p>
        <div class="brand-specialty">
          ${brand.specialty.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
        </div>
        <span class="brand-partner">Parceira desde ${brand.partnerSince}</span>
      </div>
      <a href="${brand.website}" class="brand-cta" target="_blank">Ver marca →</a>
    </div>
  `).join('');

  initRevealAnimations();
}

// ── Brand Registration Form ─────────────────────────────────
function initBrandForm() {
  const form = document.getElementById('brand-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const successEl = form.querySelector('.form-success');
    const submitBtn = form.querySelector('[type=submit]');

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successEl) {
        successEl.classList.remove('hidden');
        successEl.innerHTML = `
          <div class="success-icon">✅</div>
          <h3>Solicitação recebida!</h3>
          <p>Obrigada, <strong>${data.brandName || 'parceira'}</strong>! Nossa equipe entrará em contato em até 48h para análise da parceria.</p>
        `;
      }
    }, 1200);
  });
}

// ── Scroll helper ───────────────────────────────────────────
window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
  }
};

// ── CTA Buttons ─────────────────────────────────────────────
function initCTA() {
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      scrollToSection(btn.dataset.scrollTo);
    });
  });
}

// ── Counter Animations ──────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || el.textContent);
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString('pt-BR') + (el.dataset.suffix || '');
        if (current >= target) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ── Ripple Effect ────────────────────────────────────────────
function initRipple() {
  const targets = document.querySelectorAll(
    '.btn-primary, .btn-secondary, .nav-cta, #start-chat-btn, .btn-form-submit, #send-btn'
  );
  targets.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top - size / 2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

// ── 3D Tilt on Feature Cards ─────────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initParallax();
  initMouseParallax();
  initRevealAnimations();
  initNavigation();
  initChat();
  initBrandForm();
  initCTA();
  initCounters();
  initRipple();
  initCardTilt();
});
