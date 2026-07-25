let currentFilters = {};

async function initShopPage() {
  initHeader();
  APP.init();

  const categoryParam = getUrlParam("category");
  if (categoryParam) {
    currentFilters.category = categoryParam;
    const catSelect = document.querySelector(".search-category-select");
    if (catSelect) catSelect.value = categoryParam;
  }

  const subcategoryParam = getUrlParam("subcategory");
  if (subcategoryParam) {
    currentFilters.subcategory = subcategoryParam;
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
    const searchInput = document.querySelector(".header-search-input");
    if (searchInput) searchInput.value = searchParam;
  }

  renderCategoryFilters();
  renderRatingFilters();
  setupFilterListeners();
  initMobileFilter();
  await applyFilters();
}

function renderCategoryFilters() {
  const container = document.getElementById("filter-categories");
  if (!container) return;
  container.innerHTML = `
    <label class="filter-option">
      <input type="radio" name="category" value="" ${!currentFilters.category ? 'checked' : ''}>
      All Categories (${PRODUCTS.length})
    </label>
  ` + CATEGORIES.map(cat => {
    const count = PRODUCTS.filter(p => p.categoryId === cat.id).length;
    return `
      <label class="filter-option">
        <input type="radio" name="category" value="${cat.id}" ${currentFilters.category === cat.id ? 'checked' : ''}>
        ${cat.name} (${count})
      </label>
    `;
  }).join("");
}

function renderRatingFilters() {
  const container = document.getElementById("filter-rating");
  if (!container) return;
  container.innerHTML = `
    <label class="filter-option">
      <input type="radio" name="rating" value="" checked>
      All Ratings
    </label>
  ` + [4, 3, 2].map(r => `
    <label class="filter-option">
      <input type="radio" name="rating" value="${r}">
      ${'★'.repeat(r)}${'☆'.repeat(5 - r)} & Up
    </label>
  `).join("");
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

function initMobileFilter() {
  const toggle = document.getElementById("mobile-filter-toggle");
  const sidebar = document.getElementById("shop-sidebar");
  const close = document.getElementById("shop-sidebar-close");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }

  if (close && sidebar) {
    close.addEventListener("click", () => {
      sidebar.classList.remove("open");
      document.body.style.overflow = "";
    });
  }
}

function renderActiveFilters() {
  const container = document.getElementById("active-filters");
  if (!container) return;

  const tags = [];
  if (currentFilters.category) {
    const cat = CATEGORIES.find(c => c.id === currentFilters.category);
    tags.push({ label: cat ? cat.name : currentFilters.category, key: "category" });
  }
  if (currentFilters.subcategory) {
    tags.push({ label: currentFilters.subcategory, key: "subcategory" });
  }
  if (currentFilters.minPrice !== undefined || currentFilters.maxPrice !== undefined) {
    const min = currentFilters.minPrice || 0;
    const max = currentFilters.maxPrice || "∞";
    tags.push({ label: `$${min} - $${max}`, key: "price" });
  }
  if (currentFilters.minRating) {
    tags.push({ label: `${currentFilters.minRating}★ & Up`, key: "minRating" });
  }
  if (currentFilters.inStock) {
    tags.push({ label: "In Stock Only", key: "inStock" });
  }
  if (currentFilters.search) {
    tags.push({ label: `"${currentFilters.search}"`, key: "search" });
  }

  if (tags.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";
  container.innerHTML = tags.map(tag => `
    <span class="active-filter-tag">
      ${tag.label}
      <button class="active-filter-remove" data-filter-key="${tag.key}" aria-label="Remove filter">&times;</button>
    </span>
  `).join("");

  container.querySelectorAll(".active-filter-remove").forEach(btn => {
    btn.addEventListener("click", async () => {
      const key = btn.dataset.filterKey;
      if (key === "price") {
        currentFilters.minPrice = undefined;
        currentFilters.maxPrice = undefined;
        const priceMin = document.getElementById("price-min");
        const priceMax = document.getElementById("price-max");
        if (priceMin) priceMin.value = "";
        if (priceMax) priceMax.value = "";
      } else if (key === "inStock") {
        currentFilters.inStock = undefined;
        document.getElementById("filter-stock").checked = false;
      } else {
        delete currentFilters[key];
        if (key === "category") {
          document.querySelectorAll('input[name="category"]').forEach(i => i.checked = false);
          document.querySelector('input[name="category"][value=""]').checked = true;
        }
        if (key === "minRating") {
          document.querySelectorAll('input[name="rating"]').forEach(i => i.checked = false);
          document.querySelector('input[name="rating"][value=""]').checked = true;
        }
      }
      await applyFilters();
    });
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

  renderActiveFilters();
}

document.addEventListener("DOMContentLoaded", initShopPage);
