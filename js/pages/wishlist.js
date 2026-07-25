async function initWishlistPage() {
  initHeader();
  APP.init();
  await renderWishlist();
}

async function renderWishlist() {
  const container = document.getElementById("wishlist-container");
  const items = await WishlistService.getItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <h2>Your wishlist is empty</h2>
        <p>Save products you love to your wishlist for later.</p>
        <a href="shop.html" class="btn btn-primary">Discover Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="section-header">
      <p class="section-label">${items.length} item${items.length !== 1 ? 's' : ''}</p>
      <h2 class="section-title">Your Saved Items</h2>
      <button class="wishlist-clear-btn" id="clear-wishlist-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        Clear All
      </button>
    </div>
    <div class="products-grid" id="wishlist-grid"></div>
  `;

  document.getElementById("wishlist-grid").innerHTML = items.map(product => {
    const discount = product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
    const stars = buildStars(product.rating);
    const imgSrc = product.thumbnail || product.images?.[0] || "";

    return `
      <div class="product-card wishlist-card" data-product-id="${product.id}">
        <div class="product-card-image">
          <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
            <img class="product-card-img" src="${imgSrc}" alt="${product.name}" loading="lazy">
          </a>
          ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
          <div class="product-card-actions">
            <button class="product-action-btn wishlist-remove-btn" aria-label="Remove from wishlist" data-product-id="${product.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <button class="product-action-btn quickview-btn" aria-label="Quick view" data-product-id="${product.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="product-card-info">
          <span class="product-card-category">${getCategoryName(product.categoryId)}</span>
          <h3 class="product-card-name">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>
          <div class="product-card-rating">
            <div class="stars" aria-label="${product.rating} out of 5 stars">${stars}</div>
            <span class="rating-count">(${product.reviewCount})</span>
          </div>
          <div class="product-card-price">
            <span class="price-current">${CONFIG.CURRENCY_SYMBOL}${product.price.toFixed(2)}</span>
            ${product.compareAtPrice ? `<span class="price-compare">${CONFIG.CURRENCY_SYMBOL}${product.compareAtPrice.toFixed(2)}</span>` : ""}
          </div>
          <button class="btn btn-sm btn-add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".wishlist-remove-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.productId;
      await WishlistService.remove(productId);
      showToast("Removed from wishlist");
      await renderWishlist();
      updateWishlistBadge();
    });
  });

  document.getElementById("clear-wishlist-btn")?.addEventListener("click", async () => {
    await WishlistService.clear();
    showToast("Wishlist cleared");
    await renderWishlist();
    updateWishlistBadge();
  });
}

document.addEventListener("DOMContentLoaded", initWishlistPage);
