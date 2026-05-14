// ============================================================
// FIO SOB MEDIDA — Dashboard / Schedule Controller
// ============================================================

import { HAIR_TYPES, CONDITIONS, OBJECTIVES, TIME_OPTIONS } from './data.js';

const PRIORITY_COLORS = {
  high: '#E8889A',
  medium: '#F4B8C1',
  low: '#C9A96E',
};

const PRIORITY_LABELS = {
  high: 'Essencial',
  medium: 'Recomendado',
  low: 'Complementar',
};

const DAYS_OF_WEEK = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function renderDashboard(profile, schedule) {
  const section = document.getElementById('dashboard-section');
  if (!section || !profile || !schedule) return;

  section.classList.remove('hidden');
  section.classList.add('visible');

  const container = section.querySelector('.dashboard-content');
  if (!container) return;

  const hairInfo = HAIR_TYPES[profile.hairType];
  const condInfo = CONDITIONS[profile.condition];
  const objInfo = OBJECTIVES[profile.objective];
  const timeInfo = TIME_OPTIONS[profile.time];

  container.innerHTML = `
    <div class="dashboard-header">
      <div class="dashboard-greeting">
        <span class="dashboard-wave">👋</span>
        <div>
          <h2>Olá, <span class="name-highlight">${profile.userName}</span>!</h2>
          <p>Seu cronograma personalizado está pronto</p>
        </div>
      </div>
      <div class="profile-badges">
        <div class="profile-badge">
          <span class="badge-icon">${hairInfo?.icon || '💇'}</span>
          <span>${hairInfo?.label || ''}</span>
        </div>
        <div class="profile-badge">
          <span class="badge-icon">${condInfo?.icon || '✨'}</span>
          <span>${condInfo?.label || ''}</span>
        </div>
        <div class="profile-badge">
          <span class="badge-icon">${objInfo?.icon || '🎯'}</span>
          <span>${objInfo?.label || ''}</span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card goal-card">
        <div class="card-icon">🎯</div>
        <h3>Meta da Semana</h3>
        <p>${schedule.weeklyGoal}</p>
        <div class="goal-meta">
          <span>📅 ${timeInfo?.label || ''}</span>
          <span>📍 Iniciado em ${schedule.generatedAt}</span>
        </div>
      </div>

      <div class="dashboard-card stats-card">
        <div class="card-icon">📊</div>
        <h3>Resumo</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">${schedule.steps.length}</span>
            <span class="stat-label">Dias de tratamento</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${schedule.steps.reduce((a, s) => a + s.treatments.length, 0)}</span>
            <span class="stat-label">Etapas totais</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${schedule.steps.filter(s => s.priority === 'high').length}</span>
            <span class="stat-label">Sessões essenciais</span>
          </div>
        </div>
      </div>
    </div>

    <div class="schedule-section">
      <h3 class="section-subtitle">📅 Cronograma Semanal</h3>
      <div class="schedule-grid">
        ${renderWeekCalendar(schedule.steps)}
      </div>
    </div>

    <div class="schedule-steps">
      ${schedule.steps.map((step, i) => renderScheduleStep(step, i)).join('')}
    </div>

    <div class="tips-section">
      <h3 class="section-subtitle">💡 Dicas Personalizadas da Mariana</h3>
      <div class="tips-grid">
        ${schedule.tips.map(tip => `
          <div class="tip-card">
            <span class="tip-icon">✦</span>
            <p>${tip}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  animateIn(container.querySelectorAll('.dashboard-card, .schedule-step, .tip-card'));
}

function renderWeekCalendar(steps) {
  const activeDays = steps.map(s => s.day);
  const shortDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const fullDays = DAYS_OF_WEEK;

  return shortDays.map((short, i) => {
    const isActive = activeDays.includes(fullDays[i]);
    const step = steps.find(s => s.day === fullDays[i]);
    const priorityColor = step ? PRIORITY_COLORS[step.priority] : null;

    return `
      <div class="calendar-day ${isActive ? 'active' : ''}"
           ${isActive ? `style="--day-color: ${priorityColor}"` : ''}>
        <span class="day-short">${short}</span>
        ${isActive ? `
          <span class="day-dot"></span>
          <span class="day-label">${PRIORITY_LABELS[step.priority]}</span>
        ` : '<span class="day-rest">Descanso</span>'}
      </div>
    `;
  }).join('');
}

function renderScheduleStep(step, index) {
  const priorityColor = PRIORITY_COLORS[step.priority];
  const priorityLabel = PRIORITY_LABELS[step.priority];

  return `
    <div class="schedule-step" style="--step-color: ${priorityColor}" data-index="${index}">
      <div class="step-header">
        <div class="step-day-badge" style="background: ${priorityColor}20; border-color: ${priorityColor}">
          <span class="step-day">${step.day}</span>
          <span class="step-priority" style="color: ${priorityColor}">${priorityLabel}</span>
        </div>
        <div class="step-duration">
          <span>⏱️ ${step.duration}</span>
        </div>
      </div>
      <div class="step-treatments">
        ${step.treatments.map((t, ti) => `
          <div class="treatment-item" style="animation-delay: ${ti * 0.1}s">
            <span class="treatment-num" style="background: ${priorityColor}">${ti + 1}</span>
            <span class="treatment-name">${t}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function animateIn(elements) {
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 80);
  });
}
