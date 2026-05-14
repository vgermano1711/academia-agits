// ============================================================
// FIO SOB MEDIDA — Marketplace Controller
// ============================================================

import { PRODUCTS, OBJECTIVES } from './data.js';

let currentFilters = {
  category: 'all',
  maxPrice: 200,
  hairType: 'all',
  search: '',
};

let userProfile = null;

export function renderMarketplace(profile) {
  const section = document.getElementById('marketplace-section');
  if (!section) return;

  userProfile = profile;
  section.classList.remove('hidden');
  section.classList.add('visible');

  const container = section.querySelector('.marketplace-content');
  if (!container) return;

  const recommended = getRecommendedProducts(profile);
  const all = PRODUCTS.filter(p => !recommended.find(r => r.id === p.id));

  container.innerHTML = `
    <div class="marketplace-header">
      <h2>Marketplace Capilar</h2>
      <p>Produtos selecionados especialmente para o perfil de <strong>${profile.userName}</strong></p>
    </div>

    <div class="marketplace-filters">
      <div class="filter-group">
        <input
          type="text"
          id="search-input"
          class="filter-input"
          placeholder="🔍 Buscar produto ou marca..."
        />
      </div>
      <div class="filter-group">
        <select id="category-filter" class="filter-select">
          <option value="all">Todas as categorias</option>
          <option value="H">Hidratação</option>
          <option value="N">Nutrição</option>
          <option value="R">Reconstrução</option>
          <option value="AQ">Anti-queda</option>
          <option value="O">Oleosidade</option>
        </select>
      </div>
      <div class="filter-group price-filter">
        <label>Até <span id="price-value">R$ 200</span></label>
        <input
          type="range"
          id="price-range"
          min="20"
          max="200"
          value="200"
          class="price-slider"
        />
      </div>
    </div>

    <div class="marketplace-section-label">
      <span class="label-icon">⭐</span>
      <h3>Recomendados para Você</h3>
      <span class="label-badge">${recommended.length} produtos</span>
    </div>
    <div id="recommended-grid" class="products-grid">
      ${recommended.map(p => renderProductCard(p, true)).join('')}
    </div>

    <div class="marketplace-section-label">
      <span class="label-icon">🛍️</span>
      <h3>Explorar Catálogo</h3>
      <span class="label-badge" id="catalog-count">${all.length} produtos</span>
    </div>
    <div id="catalog-grid" class="products-grid">
      ${all.map(p => renderProductCard(p, false)).join('')}
    </div>

    <div id="empty-state" class="empty-state hidden">
      <div class="empty-icon">🔍</div>
      <p>Nenhum produto encontrado com esses filtros, linda!</p>
      <button class="btn-reset-filters" onclick="resetMarketplaceFilters()">Limpar filtros</button>
    </div>
  `;

  bindFilterEvents(container, profile);
  animateProducts();
}

function getRecommendedProducts(profile) {
  if (!profile) return PRODUCTS.slice(0, 4);

  return PRODUCTS.filter(p => {
    const matchesHair = p.hairTypes.includes(profile.hairType);
    const matchesCondition = p.conditions.includes(profile.condition);
    const matchesObjective = p.objectives.includes(profile.objective);
    return (matchesHair && matchesCondition) || (matchesCondition && matchesObjective) || (matchesHair && matchesObjective);
  }).slice(0, 6);
}

function renderProductCard(product, isRecommended) {
  const stars = renderStars(product.rating);
  const badge = product.badge
    ? `<div class="product-badge" style="background: ${product.badgeColor}">${product.badge}</div>`
    : '';
  const recTag = isRecommended
    ? `<div class="rec-tag">✓ Recomendado para você</div>`
    : '';

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}"
         data-price="${product.price}" data-hairtypes="${product.hairTypes.join(',')}">
      ${badge}
      ${recTag}
      <div class="product-image-wrap">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-image"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%23F4B8C1%22 width=%22400%22 height=%22300%22/><text y=%22160%22 x=%22200%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2260%22>💆</text></svg>'"
        />
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <h4 class="product-name">${product.name}</h4>
        <p class="product-desc">${product.description}</p>
        <div class="product-rating">
          <div class="stars">${stars}</div>
          <span class="rating-num">${product.rating}</span>
          <span class="reviews">(${product.reviews.toLocaleString('pt-BR')})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-label">A partir de</span>
            <span class="price-value">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <a href="${product.affiliateLink}" class="btn-buy" target="_blank" rel="noopener">
            Ver oferta →
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<span class="star full">★</span>';
  if (half) html += '<span class="star half">★</span>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<span class="star empty">☆</span>';
  return html;
}

function bindFilterEvents(container, profile) {
  const searchInput = container.querySelector('#search-input');
  const categoryFilter = container.querySelector('#category-filter');
  const priceRange = container.querySelector('#price-range');
  const priceValue = container.querySelector('#price-value');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentFilters.search = e.target.value.toLowerCase();
      applyFilters(profile);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', e => {
      currentFilters.category = e.target.value;
      applyFilters(profile);
    });
  }

  if (priceRange && priceValue) {
    priceRange.addEventListener('input', e => {
      currentFilters.maxPrice = parseInt(e.target.value);
      priceValue.textContent = `R$ ${currentFilters.maxPrice}`;
      applyFilters(profile);
    });
  }
}

function applyFilters(profile) {
  const allCards = document.querySelectorAll('#catalog-grid .product-card');
  const recCards = document.querySelectorAll('#recommended-grid .product-card');
  const emptyState = document.getElementById('empty-state');
  const catalogCount = document.getElementById('catalog-count');

  let catalogVisible = 0;

  const filterCard = (card) => {
    const id = parseInt(card.dataset.id);
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return false;

    const matchesCategory = currentFilters.category === 'all' || product.category === currentFilters.category;
    const matchesPrice = product.price <= currentFilters.maxPrice;
    const matchesSearch = !currentFilters.search ||
      product.name.toLowerCase().includes(currentFilters.search) ||
      product.brand.toLowerCase().includes(currentFilters.search) ||
      product.description.toLowerCase().includes(currentFilters.search);

    return matchesCategory && matchesPrice && matchesSearch;
  };

  allCards.forEach(card => {
    const visible = filterCard(card);
    card.style.display = visible ? '' : 'none';
    if (visible) catalogVisible++;
  });

  recCards.forEach(card => {
    const visible = filterCard(card);
    card.style.display = visible ? '' : 'none';
  });

  if (catalogCount) catalogCount.textContent = `${catalogVisible} produtos`;

  const totalVisible = [...allCards, ...recCards].filter(c => c.style.display !== 'none').length;
  if (emptyState) {
    emptyState.classList.toggle('hidden', totalVisible > 0);
  }
}

function animateProducts() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

window.resetMarketplaceFilters = function () {
  currentFilters = { category: 'all', maxPrice: 200, hairType: 'all', search: '' };
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  if (searchInput) searchInput.value = '';
  if (categoryFilter) categoryFilter.value = 'all';
  if (priceRange) priceRange.value = 200;
  if (priceValue) priceValue.textContent = 'R$ 200';
  applyFilters(userProfile);
};
