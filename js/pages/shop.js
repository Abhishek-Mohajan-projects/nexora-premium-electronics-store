let currentFilters = {};

async function initShopPage() {
  initHeader();
  APP.init();

  const categoryParam = getUrlParam("category");
  if (categoryParam) {
    currentFilters.category = categoryParam;
  }

  const sortParam = getUrlParam("sort");
  if (sortParam) {
    currentFilters.sort = sortParam;
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = sortParam;
  }

  const searchParam = getUrlParam("q");
  if (searchParam) {
    currentFilters.search = searchParam;
  }

  renderCategoryFilters();
  renderRatingFilters();
  setupFilterListeners();
  await applyFilters();
}

function renderCategoryFilters() {
  const container = document.getElementById("filter-categories");
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat => {
    const count = PRODUCTS.filter(p => p.categoryId === cat.id).length;
    return `
      <label class="filter-option">
        <input type="radio" name="category" value="${cat.id}" ${currentFilters.category === cat.id ? 'checked' : ''}>
        ${cat.name} (${count})
      </label>
    `;
  }).join("") + `
    <label class="filter-option">
      <input type="radio" name="category" value="" ${!currentFilters.category ? 'checked' : ''}>
      All Categories
    </label>
  `;
}

function renderRatingFilters() {
  const container = document.getElementById("filter-rating");
  if (!container) return;
  container.innerHTML = [4, 3, 2].map(r => `
    <label class="filter-option">
      <input type="radio" name="rating" value="${r}">
      ${'★'.repeat(r)}${'☆'.repeat(5 - r)} & Up
    </label>
  ).join("") + `
    <label class="filter-option">
      <input type="radio" name="rating" value="" checked>
      All Ratings
    </label>
  `;
}

function setupFilterListeners() {
  document.querySelectorAll('input[name="category"]').forEach(input => {
    input.addEventListener("change", async () => {
      currentFilters.category = input.value || undefined;
      await applyFilters();
    });
  });

  document.querySelectorAll('input[name="rating"]').forEach(input => {
    input.addEventListener("change", async () => {
      currentFilters.minRating = input.value ? parseFloat(input.value) : undefined;
      await applyFilters();
    });
  });

  document.getElementById("filter-stock")?.addEventListener("change", async (e) => {
    currentFilters.inStock = e.target.checked || undefined;
    await applyFilters();
  });

  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");

  let priceTimer;
  const handlePrice = () => {
    clearTimeout(priceTimer);
    priceTimer = setTimeout(async () => {
      currentFilters.minPrice = priceMin?.value ? parseFloat(priceMin.value) : undefined;
      currentFilters.maxPrice = priceMax?.value ? parseFloat(priceMax.value) : undefined;
      await applyFilters();
    }, 500);
  };

  priceMin?.addEventListener("input", handlePrice);
  priceMax?.addEventListener("input", handlePrice);

  document.getElementById("sort-select")?.addEventListener("change", async (e) => {
    currentFilters.sort = e.target.value;
    await applyFilters();
  });

  document.getElementById("clear-filters")?.addEventListener("click", async () => {
    currentFilters = {};
    document.querySelectorAll('input[name="category"]').forEach(i => i.checked = false);
    document.querySelector('input[name="category"][value=""]').checked = true;
    document.querySelectorAll('input[name="rating"]').forEach(i => i.checked = false);
    document.querySelector('input[name="rating"][value=""]').checked = true;
    document.getElementById("filter-stock").checked = false;
    if (priceMin) priceMin.value = "";
    if (priceMax) priceMax.value = "";
    document.getElementById("sort-select").value = "featured";
    await applyFilters();
  });
}

async function applyFilters() {
  const products = await ProductService.getProducts(currentFilters);
  const grid = document.getElementById("shop-products");
  const noResults = document.getElementById("no-results");
  const count = document.getElementById("result-count");

  if (count) count.textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;

  if (products.length === 0) {
    grid.innerHTML = "";
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    grid.innerHTML = products.map(renderProductCard).join("");
    initWishlistBadges();
  }
}

document.addEventListener("DOMContentLoaded", initShopPage);
