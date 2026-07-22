function renderProductCard(product) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const stars = buildStars(product.rating);
  const imgSrc = product.thumbnail || product.images?.[0] || "";

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card-image">
        <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
          <img class="product-card-img" src="${imgSrc}" alt="${product.name}" loading="lazy">
        </a>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
        <div class="product-card-actions">
          <button class="product-action-btn wishlist-btn" aria-label="Add to wishlist" data-product-id="${product.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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
}

function renderCompactRow(product) {
  const stars = buildStarsSmall(product.rating);
  const imgSrc = product.thumbnail || product.images?.[0] || "";
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return `
    <div class="compact-row" data-product-id="${product.id}">
      <a href="product.html?id=${product.id}" class="compact-row-img" aria-label="View ${product.name}">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
      </a>
      <div class="compact-row-info">
        <span class="compact-row-cat">${getCategoryName(product.categoryId)}</span>
        <h4 class="compact-row-name"><a href="product.html?id=${product.id}">${product.name}</a></h4>
        <div class="compact-row-rating">
          <div class="stars-sm">${stars}</div>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <div class="compact-row-price">
          <span class="price-current">${CONFIG.CURRENCY_SYMBOL}${product.price.toFixed(2)}</span>
          ${product.compareAtPrice ? `<span class="price-compare">${CONFIG.CURRENCY_SYMBOL}${product.compareAtPrice.toFixed(2)}</span>` : ""}
          ${discount > 0 ? `<span class="compact-discount">-${discount}%</span>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderSpecialOfferPanel(product, soldCount) {
  if (!product) return "";
  const imgSrc = product.thumbnail || product.images?.[0] || "";
  const totalStock = product.stock + soldCount;
  const progressPercent = Math.round((soldCount / totalStock) * 100);

  return `
    <div class="special-offer-card">
      <p class="so-eyebrow">Special Offer</p>
      <div class="so-save-badge">
        <span class="so-save-amount">Save $${(product.compareAtPrice - product.price).toFixed(0)}</span>
      </div>
      <div class="so-image">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
      </div>
      <h3 class="so-name">${product.name}</h3>
      <div class="so-prices">
        <span class="so-price-current">${CONFIG.CURRENCY_SYMBOL}${product.price.toFixed(2)}</span>
        ${product.compareAtPrice ? `<span class="so-price-old">${CONFIG.CURRENCY_SYMBOL}${product.compareAtPrice.toFixed(2)}</span>` : ""}
      </div>
      <div class="so-stock">
        <div class="so-stock-info">
          <span>Available: <strong>${product.stock}</strong></span>
          <span>Already Sold: <strong>${soldCount}</strong></span>
        </div>
        <div class="so-progress-bar">
          <div class="so-progress-fill" style="width:${progressPercent}%"></div>
        </div>
      </div>
      <div class="so-countdown">
        <p>Hurry Up! Offer ends in:</p>
        <div class="countdown-timer" id="countdown-timer">
          <div class="cd-block"><span class="cd-num" id="cd-hours">08</span><span class="cd-label">Hours</span></div>
          <div class="cd-sep">:</div>
          <div class="cd-block"><span class="cd-num" id="cd-mins">45</span><span class="cd-label">Mins</span></div>
          <div class="cd-sep">:</div>
          <div class="cd-block"><span class="cd-num" id="cd-secs">30</span><span class="cd-label">Secs</span></div>
        </div>
      </div>
      <a href="product.html?id=${product.id}" class="btn btn-primary btn-full">Shop Now</a>
    </div>
  `;
}

function renderPromoCategoryCard(category) {
  const promoData = {
    "power-charging": { eyebrow: "SMART TECH", desc: "Fast chargers & power banks", img: "assets/laptop.png" },
    "mobile-productivity": { eyebrow: "GET MORE DONE", desc: "Hubs, stands & keyboards", img: "assets/keyboard.png" },
    "audio": { eyebrow: "LISTEN BETTER", desc: "Earbuds, headphones & more", img: "assets/air pods.png" },
    "smart-living": { eyebrow: "LIVE SMARTER", desc: "Smart bulbs, plugs & sensors", img: "assets/smart watch.png" }
  };
  const data = promoData[category.id] || { eyebrow: "EXPLORE", desc: category.description, img: category.image };

  return `
    <a href="shop.html?category=${category.id}" class="promo-card">
      <div class="promo-card-text">
        <p class="promo-card-eyebrow">${data.eyebrow}</p>
        <h4 class="promo-card-title">${category.name}</h4>
        <p class="promo-card-desc">${data.desc}</p>
        <span class="promo-card-cta">Shop Now &rarr;</span>
      </div>
      <div class="promo-card-img">
        <img src="${data.img}" alt="${category.name}" loading="lazy">
      </div>
    </a>
  `;
}

function getCategoryName(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.name : "";
}

function buildStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('<span class="star filled" aria-hidden="true">&#9733;</span>');
    } else if (i - 0.5 <= rating) {
      stars.push('<span class="star half" aria-hidden="true" style="position:relative;display:inline-block;"><span style="position:absolute;overflow:hidden;width:50%;">&#9733;</span><span style="color:var(--border);">&#9733;</span></span>');
    } else {
      stars.push('<span class="star" aria-hidden="true">&#9734;</span>');
    }
  }
  return stars.join("");
}

function buildStarsSmall(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push('<span class="star-sm filled" aria-hidden="true">&#9733;</span>');
    } else {
      stars.push('<span class="star-sm" aria-hidden="true">&#9734;</span>');
    }
  }
  return stars.join("");
}

function initProductCardListeners() {
  document.addEventListener("click", async (e) => {
    const wishlistBtn = e.target.closest(".wishlist-btn");
    if (wishlistBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = wishlistBtn.dataset.productId;
      const result = await WishlistService.toggle(productId);
      wishlistBtn.classList.toggle("active", result.added);
      showToast(result.added ? "Added to wishlist" : "Removed from wishlist");
      return;
    }

    const addBtn = e.target.closest(".btn-add-to-cart");
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = addBtn.dataset.productId;
      const result = await CartService.addItem(productId, 1);
      if (result.success) {
        showToast("Added to cart");
        updateCartBadge();
      } else {
        showToast(result.message, "error");
      }
      return;
    }

    const quickviewBtn = e.target.closest(".quickview-btn");
    if (quickviewBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = quickviewBtn.dataset.productId;
      const product = await ProductService.getProductById(productId);
      if (product) openQuickView(product);
      return;
    }
  });
}

async function openQuickView(product) {
  const isWishlisted = await WishlistService.has(product.id);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const imgSrc = product.thumbnail || product.images?.[0] || "";

  const content = `
    <div class="quickview">
      <div class="quickview-image">
        <img class="quickview-img" src="${imgSrc}" alt="${product.name}">
        ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
      </div>
      <div class="quickview-info">
        <span class="product-card-category">${getCategoryName(product.categoryId)}</span>
        <h2 class="quickview-name">${product.name}</h2>
        <div class="product-card-rating">
          <div class="stars" aria-label="${product.rating} out of 5 stars">
            ${buildStars(product.rating)}
          </div>
          <span class="rating-count">(${product.reviewCount} reviews)</span>
        </div>
        <p class="quickview-desc">${product.description}</p>
        <div class="product-card-price">
          <span class="price-current large">${CONFIG.CURRENCY_SYMBOL}${product.price.toFixed(2)}</span>
          ${product.compareAtPrice ? `<span class="price-compare">${CONFIG.CURRENCY_SYMBOL}${product.compareAtPrice.toFixed(2)}</span>` : ""}
        </div>
        <div class="quickview-actions">
          <div class="quantity-control">
            <button class="qty-btn qty-minus" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-value" data-qty="1">1</span>
            <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-primary btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
          <button class="btn btn-icon wishlist-toggle ${isWishlisted ? 'active' : ''}" data-product-id="${product.id}" aria-label="Toggle wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <a href="product.html?id=${product.id}" class="btn btn-outline btn-full">View Full Details</a>
      </div>
    </div>
  `;

  openModal(content);

  const modal = document.querySelector(".modal");
  if (modal) {
    let qty = 1;
    const qtyValue = modal.querySelector(".qty-value");
    const maxQty = product.stock;

    modal.querySelector(".qty-minus")?.addEventListener("click", () => {
      if (qty > 1) { qty--; qtyValue.textContent = qty; qtyValue.dataset.qty = qty; }
    });
    modal.querySelector(".qty-plus")?.addEventListener("click", () => {
      if (qty < maxQty) { qty++; qtyValue.textContent = qty; qtyValue.dataset.qty = qty; }
    });

    modal.querySelector(".btn-add-to-cart")?.addEventListener("click", async () => {
      const result = await CartService.addItem(product.id, qty);
      if (result.success) {
        showToast(`${qty} item${qty > 1 ? 's' : ''} added to cart`);
        updateCartBadge();
        closeModal();
      } else {
        showToast(result.message, "error");
      }
    });

    modal.querySelector(".wishlist-toggle")?.addEventListener("click", async (e) => {
      const result = await WishlistService.toggle(product.id);
      e.currentTarget.classList.toggle("active", result.added);
      showToast(result.added ? "Added to wishlist" : "Removed from wishlist");
    });
  }
}
