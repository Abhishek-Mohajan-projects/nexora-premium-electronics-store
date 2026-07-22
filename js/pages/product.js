async function initProductPage() {
  initHeader();
  APP.init();

  const productId = getUrlParam("id");
  if (!productId) {
    window.location.href = "shop.html";
    return;
  }

  const product = await ProductService.getProductById(productId);
  if (!product) {
    window.location.href = "404.html";
    return;
  }

  document.title = `${product.name} - NEXORA`;

  const isWishlisted = await WishlistService.has(product.id);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const stars = buildStars(product.rating);

  const category = CATEGORIES.find(c => c.id === product.categoryId);

  const related = await ProductService.getRelatedProducts(product.id, 4);

  const container = document.getElementById("product-detail");
  container.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a>
      <span aria-hidden="true">/</span>
      <a href="shop.html">Shop</a>
      <span aria-hidden="true">/</span>
      ${category ? `<a href="shop.html?category=${category.id}">${category.name}</a><span aria-hidden="true">/</span>` : ""}
      <span>${product.name}</span>
    </nav>

    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="product-main-image" id="main-image">
          <img src="${product.images[0] || product.thumbnail || ''}" alt="${escapeHtml(product.name)}" loading="eager">
        </div>
        ${product.images.length > 1 ? `
          <div class="product-thumbnails">
            ${product.images.map((img, i) => `
              <div class="product-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" data-src="${img}" role="button" tabindex="0" aria-label="View image ${i + 1}">
                <img src="${img}" alt="${escapeHtml(product.name)} image ${i + 1}" loading="lazy">
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>

      <div class="product-info">
        <span class="product-info-category">${category ? category.name : ""}</span>
        <h1>${product.name}</h1>
        <div class="product-info-rating">
          <div class="stars">${stars}</div>
          <span class="rating-count">${product.rating} (${product.reviewCount} reviews)</span>
        </div>

        <div class="product-info-price">
          <span class="price-current large">${CONFIG.CURRENCY_SYMBOL}${product.price.toFixed(2)}</span>
          ${product.compareAtPrice ? `<span class="price-compare">${CONFIG.CURRENCY_SYMBOL}${product.compareAtPrice.toFixed(2)}</span>` : ""}
          ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
        </div>

        <p class="product-info-desc">${product.description}</p>

        ${product.features ? `
          <div class="product-info-features">
            <h3>Key Features</h3>
            <ul>
              ${product.features.map(f => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <div class="stock-info ${product.stock < 10 ? 'low' : ''}">
          ${product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left in stock` : "In Stock") : "Out of Stock"}
        </div>

        <div class="product-actions">
          <div class="quantity-control">
            <button class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
            <span class="qty-value" id="qty-display">1</span>
            <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-primary" id="add-to-cart-btn" data-product-id="${product.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Cart
          </button>
          <button class="btn btn-outline" id="buy-now-btn" data-product-id="${product.id}">Buy Now</button>
          <button class="btn btn-icon ${isWishlisted ? 'active' : ''}" id="wishlist-btn" data-product-id="${product.id}" aria-label="Toggle wishlist" style="border:1px solid var(--border);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="product-tabs">
      <div class="tabs-nav" role="tablist">
        <button class="tab-btn active" data-tab="description" role="tab" aria-selected="true">Description</button>
        <button class="tab-btn" data-tab="specifications" role="tab" aria-selected="false">Specifications</button>
        <button class="tab-btn" data-tab="shipping" role="tab" aria-selected="false">Shipping</button>
        <button class="tab-btn" data-tab="returns" role="tab" aria-selected="false">Returns</button>
      </div>

      <div class="tab-content active" id="tab-description" role="tabpanel">
        <p style="color:var(--text-muted);line-height:1.8;">${product.description}</p>
        ${product.features ? `
          <div class="product-info-features mt-24">
            <h3>What's Included</h3>
            <ul>
              ${product.features.map(f => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
      </div>

      <div class="tab-content" id="tab-specifications" role="tabpanel">
        ${product.specifications ? `
          <table class="specs-table">
            ${Object.entries(product.specifications).map(([key, val]) => `
              <tr><td>${key}</td><td>${val}</td></tr>
            `).join("")}
          </table>
        ` : "<p>No specifications available.</p>"}
      </div>

      <div class="tab-content" id="tab-shipping" role="tabpanel">
        <div class="shipping-info">
          <div class="shipping-item">
            <div class="shipping-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div class="shipping-text">
              <h4>Free Standard Shipping</h4>
              <p>On orders over ${CONFIG.CURRENCY_SYMBOL}${CONFIG.FREE_SHIPPING_THRESHOLD}. Estimated delivery in 3-5 business days.</p>
            </div>
          </div>
          <div class="shipping-item">
            <div class="shipping-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="shipping-text">
              <h4>Express Shipping</h4>
              <p>Available at checkout. 1-2 business day delivery for ${CONFIG.CURRENCY_SYMBOL}9.99.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-content" id="tab-returns" role="tabpanel">
        <div class="return-info">
          <div class="return-item">
            <div class="return-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </div>
            <div class="return-text">
              <h4>30-Day Returns</h4>
              <p>Not satisfied? Return within 30 days for a full refund. No questions asked.</p>
            </div>
          </div>
          <div class="return-item">
            <div class="return-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="return-text">
              <h4>Warranty</h4>
              <p>All products come with a 1-year manufacturer warranty against defects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${related.length > 0 ? `
      <section class="section-sm">
        <div class="section-header">
          <p class="section-label">You May Also Like</p>
          <h2 class="section-title">Related Products</h2>
        </div>
        <div class="products-grid" id="related-products"></div>
      </section>
    ` : ""}
  `;

  let qty = 1;
  const maxQty = product.stock;
  const qtyDisplay = document.getElementById("qty-display");

  document.querySelector(".qty-minus")?.addEventListener("click", () => {
    if (qty > 1) { qty--; qtyDisplay.textContent = qty; }
  });

  document.querySelector(".qty-plus")?.addEventListener("click", () => {
    if (qty < maxQty) { qty++; qtyDisplay.textContent = qty; }
  });

  document.getElementById("add-to-cart-btn")?.addEventListener("click", async () => {
    const result = await CartService.addItem(product.id, qty);
    if (result.success) {
      showToast(`${qty} item${qty > 1 ? 's' : ''} added to cart`);
      updateCartBadge();
    } else {
      showToast(result.message, "error");
    }
  });

  document.getElementById("buy-now-btn")?.addEventListener("click", async () => {
    await CartService.addItem(product.id, qty);
    window.location.href = "cart.html";
  });

  document.getElementById("wishlist-btn")?.addEventListener("click", async (e) => {
    const result = await WishlistService.toggle(product.id);
    e.currentTarget.classList.toggle("active", result.added);
    const svg = e.currentTarget.querySelector("svg");
    svg.setAttribute("fill", result.added ? "currentColor" : "none");
    showToast(result.added ? "Added to wishlist" : "Removed from wishlist");
    updateWishlistBadge();
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  document.querySelectorAll(".product-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      const src = thumb.dataset.src;
      const mainImg = document.querySelector("#main-image img");
      if (mainImg && src) {
        mainImg.src = src;
        mainImg.alt = product.name;
      }
      document.querySelectorAll(".product-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        thumb.click();
      }
    });
  });

  if (related.length > 0) {
    document.getElementById("related-products").innerHTML = related.map(renderProductCard).join("");
    initWishlistBadges();
  }
}

document.addEventListener("DOMContentLoaded", initProductPage);
