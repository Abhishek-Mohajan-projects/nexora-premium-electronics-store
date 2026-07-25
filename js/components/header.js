async function updateCartBadge() {
  const count = await CartService.getItemCount();
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
  const totalEl = document.querySelector(".header-cart-total");
  if (totalEl) {
    const subtotal = await CartService.getSubtotal();
    totalEl.textContent = CONFIG.CURRENCY_SYMBOL + subtotal.toFixed(2);
  }
}

async function updateWishlistBadge() {
  const count = await WishlistService.getItemCount();
  document.querySelectorAll(".wishlist-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function getMegaMenuPanels() {
  const shopCategories = CATEGORIES;
  const featuredProducts = PRODUCTS.filter(p => p.tags.includes("featured")).slice(0, 3);

  const categoryColumns = shopCategories.map(cat => {
    const subs = (cat.subcategories || []).map(sub =>
      `<a href="shop.html?category=${cat.id}&subcategory=${sub.id}" class="mega-menu-link">${sub.name}</a>`
    ).join("");
    return `
      <div class="mega-menu-col">
        <a href="shop.html?category=${cat.id}" class="mega-menu-col-heading">${cat.name}</a>
        <div class="mega-menu-col-links">
          <a href="shop.html?category=${cat.id}" class="mega-menu-link mega-menu-link--viewall">View All</a>
          ${subs}
        </div>
      </div>
    `;
  }).join("");

  const promoHTML = `
    <div class="mega-menu-promo">
      <p class="mega-menu-promo-badge">Featured</p>
      <p class="mega-menu-promo-title">Top Picks For You</p>
      <div class="mega-menu-promo-products">
        ${featuredProducts.map(p => `
          <a href="product.html?id=${p.id}" class="mega-menu-promo-item">
            <img src="${p.thumbnail}" alt="${p.name}" loading="lazy">
            <div class="mega-menu-promo-info">
              <span class="mega-menu-promo-name">${p.name}</span>
              <span class="mega-menu-promo-price">${CONFIG.CURRENCY_SYMBOL}${p.price.toFixed(2)}</span>
            </div>
          </a>
        `).join("")}
      </div>
      <a href="shop.html" class="mega-menu-promo-cta">Shop All Products</a>
    </div>
  `;

  const shopPanel = `
    <div class="mega-menu-panel" data-mega-panel="shop" aria-hidden="true">
      <div class="mega-menu-inner">
        <div class="mega-menu-nav">
          <a href="shop.html" class="mega-menu-nav-item mega-menu-nav-item--all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            All Products
          </a>
          ${shopCategories.map(cat => `
            <a href="shop.html?category=${cat.id}" class="mega-menu-nav-item">
              <img src="${cat.image}" alt="" class="mega-menu-nav-icon" loading="lazy">
              ${cat.name}
            </a>
          `).join("")}
        </div>
        <div class="mega-menu-columns">
          ${categoryColumns}
        </div>
        ${promoHTML}
      </div>
    </div>
  `;

  const categoriesPanel = `
    <div class="mega-menu-panel" data-mega-panel="categories" aria-hidden="true">
      <div class="mega-menu-inner">
        <div class="mega-menu-nav">
          <a href="categories.html" class="mega-menu-nav-item mega-menu-nav-item--all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            All Categories
          </a>
          ${shopCategories.map(cat => `
            <a href="shop.html?category=${cat.id}" class="mega-menu-nav-item">
              <img src="${cat.image}" alt="" class="mega-menu-nav-icon" loading="lazy">
              ${cat.name}
            </a>
          `).join("")}
        </div>
        <div class="mega-menu-columns">
          ${categoryColumns}
        </div>
        ${promoHTML}
      </div>
    </div>
  `;

  return shopPanel + categoriesPanel;
}

function renderHeader() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const navLinks = [
    { href: "index.html", label: "Home" },
    { href: "shop.html", label: "Shop", mega: "shop" },
    { href: "categories.html", label: "Categories", mega: "categories" },
    { href: "new-arrivals.html", label: "New Arrivals" },
    { href: "deals.html", label: "Deals" },
    { href: "about.html", label: "About" }
  ];

  const navHTML = navLinks.map(link => {
    const isActive = currentPage === link.href || (currentPage === "" && link.href === "index.html");
    if (link.mega) {
      return `<a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}" data-mega-trigger="${link.mega}">${link.label}</a>`;
    }
    return `<a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">${link.label}</a>`;
  }).join("");

  const deptCategories = CATEGORIES.map(cat => {
    const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
    if (hasSubcategories) {
      return `
        <div class="dept-menu-item dept-menu-item--has-sub" data-category="${cat.id}">
          <a href="shop.html?category=${cat.id}" class="dept-menu-item-link">
            <div class="dept-menu-icon">
              <img src="${cat.image}" alt="${cat.name}" loading="lazy">
            </div>
            <span>${cat.name}</span>
            <svg class="dept-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <div class="dept-sub-menu">
            <a href="shop.html?category=${cat.id}" class="dept-sub-menu-item dept-sub-menu-item--all">View All ${cat.name}</a>
            ${cat.subcategories.map(sub => `
              <a href="shop.html?category=${cat.id}&subcategory=${sub.id}" class="dept-sub-menu-item">${sub.name}</a>
            `).join("")}
          </div>
        </div>
      `;
    }
    return `
      <a href="shop.html?category=${cat.id}" class="dept-menu-item">
        <div class="dept-menu-icon">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy">
        </div>
        <span>${cat.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    `;
  }).join("");

  return `
    <div class="utility-bar">
      <div class="container utility-bar-inner">
        <p class="utility-welcome">Welcome to <strong>${CONFIG.STORE_NAME}</strong></p>
        <div class="utility-links">
          <a href="#" class="utility-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Store Locator
          </a>
          <a href="#" class="utility-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Track Your Order
          </a>
          <span class="utility-sep">|</span>
          <a href="#" class="utility-link">Register</a>
          <a href="#" class="utility-link">Sign In</a>
        </div>
      </div>
    </div>

    <header class="header">
      <div class="container header-inner">
        <button class="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <a href="index.html" class="logo" aria-label="${CONFIG.STORE_NAME} Home">
          <span class="logo-text">${CONFIG.STORE_NAME}</span>
        </a>
        <div class="header-search">
          <select class="search-category-select" aria-label="Category">
            <option value="">All Categories</option>
            ${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
          </select>
          <input type="search" class="header-search-input" placeholder="Search for products..." aria-label="Search products" autocomplete="off">
          <button class="header-search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
        <div class="header-actions">
          <a href="shop.html" class="header-action-link mobile-search-link" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>
          <a href="wishlist.html" class="header-action-link" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="badge wishlist-count" style="display:none">0</span>
            <span class="header-action-label">Wishlist</span>
          </a>
          <a href="cart.html" class="header-action-link cart-action" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="badge cart-count" style="display:none">0</span>
            <span class="header-action-label">Cart</span>
            <span class="header-cart-total">$0.00</span>
          </a>
        </div>
      </div>

      <div class="search-results-dropdown" id="search-results-dropdown" aria-hidden="true"></div>

      <div class="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-overlay" data-close-menu></div>
        <div class="mobile-drawer">
          <div class="mobile-drawer-header">
            <a href="index.html" class="logo">
              <span class="logo-text">${CONFIG.STORE_NAME}</span>
            </a>
            <button class="mobile-drawer-close" data-close-menu aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="mobile-drawer-body">
            <nav class="mobile-drawer-nav">
              <a href="deals.html" class="mobile-drawer-link mobile-drawer-link--highlight">Value of the Day</a>
              <a href="deals.html" class="mobile-drawer-link mobile-drawer-link--highlight">Top 100 Offers</a>
              <a href="new-arrivals.html" class="mobile-drawer-link mobile-drawer-link--highlight">New Arrivals</a>
            </nav>
            <div class="mobile-drawer-sep"></div>
            <div class="mobile-drawer-cats">
              ${CATEGORIES.map((cat, i) => `
                <div class="mobile-drawer-cat" data-accordion>
                  <button class="mobile-drawer-cat-btn" data-accordion-trigger>
                    <span>${cat.name}</span>
                    <svg class="mobile-drawer-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                  <div class="mobile-drawer-sub" data-accordion-content>
                    <a href="shop.html?category=${cat.id}" class="mobile-drawer-sub-link">View All ${cat.name}</a>
                    ${cat.subcategories ? cat.subcategories.map(sub => `
                      <a href="shop.html?category=${cat.id}&subcategory=${sub.id}" class="mobile-drawer-sub-link">${sub.name}</a>
                    `).join("") : ''}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="mobile-drawer-footer">
            <svg class="mobile-drawer-wave" viewBox="0 0 320 30" preserveAspectRatio="none"><path d="M0,30 C80,0 240,0 320,30 Z" fill="#F5C518"/></svg>
            <div class="mobile-drawer-dots">
              <span class="mobile-drawer-dot mobile-drawer-dot--red"></span>
              <span class="mobile-drawer-dot mobile-drawer-dot--green"></span>
              <span class="mobile-drawer-dot mobile-drawer-dot--yellow"></span>
            </div>
            <div class="mobile-drawer-footer-links">
              <a href="#" class="mobile-drawer-footer-link">Privacy</a>
              <a href="#" class="mobile-drawer-footer-link">Terms</a>
              <a href="#" class="mobile-drawer-footer-link">Info</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <nav class="nav-bar" aria-label="Main navigation">
      <div class="container nav-bar-inner">
        <div class="dept-dropdown-wrap">
          <button class="dept-trigger" aria-label="All Departments" aria-expanded="false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            All Departments
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dept-menu" aria-hidden="true">
            <a href="shop.html" class="dept-menu-item dept-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>All Products</span>
            </a>
            ${deptCategories}
          </div>
        </div>
        <nav class="main-nav" aria-label="Main navigation">
          ${navHTML}
        </nav>
        <div class="nav-shipping-msg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Free Shipping on Orders Over ${CONFIG.CURRENCY_SYMBOL}${CONFIG.FREE_SHIPPING_THRESHOLD}
        </div>
      </div>
    </nav>

    ${getMegaMenuPanels()}
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="container footer-main">
        <div class="footer-col footer-brand-col">
          <a href="index.html" class="logo footer-logo">
            <span class="logo-text">${CONFIG.STORE_NAME}</span>
          </a>
          <p class="footer-tagline">${CONFIG.STORE_TAGLINE}</p>
          <div class="footer-contact">
            <div class="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+1 (800) 123-4567</span>
            </div>
            <div class="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>support@nexora.store</span>
            </div>
          </div>
          <div class="footer-social">
            <a href="#" aria-label="Twitter" class="social-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" class="social-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="YouTube" class="social-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" class="social-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Shop</h4>
          <ul class="footer-links">
            <li><a href="shop.html">All Products</a></li>
            ${CATEGORIES.map(c => `<li><a href="shop.html?category=${c.id}">${c.name}</a></li>`).join("")}
            <li><a href="shop.html?sort=newest">New Arrivals</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="shop.html?sort=featured">Best Sellers</a></li>
            <li><a href="shop.html?sort=newest">New Arrivals</a></li>
            <li><a href="deals.html">Deals</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Customer Care</h4>
          <ul class="footer-links">
            <li><a href="#">My Account</a></li>
            <li><a href="#">Order Tracking</a></li>
            <li><a href="wishlist.html">Wishlist</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Product Support</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p>&copy; 2026 ${CONFIG.STORE_NAME}. All rights reserved.</p>
          <div class="footer-payments">
            <span class="payment-icon" title="Visa">VISA</span>
            <span class="payment-icon" title="Mastercard">MC</span>
            <span class="payment-icon" title="Amex">AMEX</span>
            <span class="payment-icon" title="PayPal">PayPal</span>
            <span class="payment-icon" title="Apple Pay">Pay</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function initHeader() {
  const header = document.querySelector(".header-wrapper");
  if (header) {
    header.innerHTML = renderHeader();
  }

  const footerEl = document.querySelector(".footer-wrapper");
  if (footerEl) {
    footerEl.innerHTML = renderFooter();
  }

  initSearch();
  initMobileMenu();
  initWishlistBadges();
  initDeptDropdown();
  initMegaMenu();
  updateCartBadge();
  updateWishlistBadge();
}

function initSearch() {
  const searchInput = document.querySelector(".header-search-input");
  const searchBtn = document.querySelector(".header-search-btn");
  const searchCategorySelect = document.querySelector(".search-category-select");
  const dropdown = document.getElementById("search-results-dropdown");

  if (!searchInput || !dropdown) return;

  let debounceTimer;

  function getSearchURL() {
    const query = searchInput.value.trim();
    const category = searchCategorySelect ? searchCategorySelect.value : "";
    if (!query) return null;
    const params = new URLSearchParams();
    params.set("q", query);
    if (category) params.set("category", category);
    return "shop.html?" + params.toString();
  }

  const showDropdown = async () => {
    const query = searchInput.value.trim();
    const category = searchCategorySelect ? searchCategorySelect.value : "";
    if (query.length < 2) {
      dropdown.innerHTML = "";
      dropdown.classList.remove("active");
      dropdown.setAttribute("aria-hidden", "true");
      return;
    }

    let results = await ProductService.searchProducts(query);
    if (category) {
      results = results.filter(p => p.categoryId === category);
    }

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="search-dd-empty">No products found</div>';
    } else {
      dropdown.innerHTML = results.map(p => `
        <a href="product.html?id=${p.id}" class="search-dd-item">
          <img class="search-dd-img" src="${p.thumbnail || p.images?.[0] || ''}" alt="${p.name}" loading="lazy">
          <div class="search-dd-info">
            <span class="search-dd-name">${p.name}</span>
            <span class="search-dd-cat">${getCategoryName(p.categoryId)}</span>
          </div>
          <span class="search-dd-price">${CONFIG.CURRENCY_SYMBOL}${p.price.toFixed(2)}</span>
        </a>
      `).join("") + `<a href="shop.html?q=${encodeURIComponent(query)}" class="search-dd-viewall">View All Results</a>`;
    }
    dropdown.classList.add("active");
    dropdown.setAttribute("aria-hidden", "false");
  };

  function navigateToSearch() {
    const url = getSearchURL();
    if (url) {
      dropdown.classList.remove("active");
      window.location.href = url;
    }
  }

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(showDropdown, CONFIG.SEARCH_DEBOUNCE_MS);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdown.classList.remove("active");
      dropdown.setAttribute("aria-hidden", "true");
      searchInput.blur();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      navigateToSearch();
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim().length >= 2) {
      showDropdown();
    }
  });

  searchBtn?.addEventListener("click", navigateToSearch);

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-search")) {
      dropdown.classList.remove("active");
      dropdown.setAttribute("aria-hidden", "true");
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const header = document.querySelector(".header");

  if (!menuBtn || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    header?.classList.remove("menu-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  function openMenu() {
    mobileMenu.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    header?.classList.add("menu-open");
    document.body.style.overflow = "hidden";
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("active");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.querySelectorAll("[data-close-menu]").forEach(el => {
    el.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  document.querySelectorAll("[data-accordion-trigger]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const cat = trigger.closest("[data-accordion]");
      const content = cat.querySelector("[data-accordion-content]");
      const isOpen = cat.classList.contains("open");

      document.querySelectorAll("[data-accordion].open").forEach(openCat => {
        if (openCat !== cat) {
          openCat.classList.remove("open");
          const openContent = openCat.querySelector("[data-accordion-content]");
          if (openContent) openContent.style.maxHeight = "0";
        }
      });

      if (isOpen) {
        cat.classList.remove("open");
        content.style.maxHeight = "0";
      } else {
        cat.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

function initDeptDropdown() {
  const trigger = document.querySelector(".dept-trigger");
  const menu = document.querySelector(".dept-menu");
  if (!trigger || !menu) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle("active");
    trigger.setAttribute("aria-expanded", isOpen);
    menu.setAttribute("aria-hidden", !isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dept-dropdown-wrap")) {
      menu.classList.remove("active");
      trigger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
  });
}

function initMegaMenu() {
  const triggers = document.querySelectorAll("[data-mega-trigger]");
  const panels = document.querySelectorAll(".mega-menu-panel");
  const navBar = document.querySelector(".nav-bar");

  if (!triggers.length || !panels.length) return;

  let openPanel = null;
  let closeTimer = null;

  function getOffsetTop() {
    if (!navBar) return 0;
    return navBar.getBoundingClientRect().top + window.scrollY + navBar.offsetHeight;
  }

  function openMega(panel) {
    clearTimeout(closeTimer);
    if (openPanel && openPanel !== panel) {
      openPanel.classList.remove("is-open");
      openPanel.setAttribute("aria-hidden", "true");
    }
    const topPos = getOffsetTop();
    panel.style.top = topPos + "px";
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    openPanel = panel;
  }

  function scheduleClose() {
    closeTimer = setTimeout(() => {
      if (openPanel) {
        openPanel.classList.remove("is-open");
        openPanel.setAttribute("aria-hidden", "true");
        openPanel = null;
      }
    }, 200);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  triggers.forEach(trigger => {
    const key = trigger.getAttribute("data-mega-trigger");
    const panel = document.querySelector(`[data-mega-panel="${key}"]`);
    if (!panel) return;

    trigger.addEventListener("mouseenter", () => {
      openMega(panel);
    });

    panel.addEventListener("mouseenter", () => {
      cancelClose();
    });

    panel.addEventListener("mouseleave", () => {
      scheduleClose();
    });
  });

  triggers.forEach(trigger => {
    trigger.addEventListener("mouseleave", () => {
      scheduleClose();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openPanel) {
      openPanel.classList.remove("is-open");
      openPanel.setAttribute("aria-hidden", "true");
      openPanel = null;
    }
  });

  document.addEventListener("click", (e) => {
    if (openPanel && !e.target.closest(".mega-menu-panel") && !e.target.closest("[data-mega-trigger]")) {
      openPanel.classList.remove("is-open");
      openPanel.setAttribute("aria-hidden", "true");
      openPanel = null;
    }
  });

  window.addEventListener("scroll", () => {
    if (openPanel) {
      const topPos = getOffsetTop();
      openPanel.style.top = topPos + "px";
    }
  }, { passive: true });
}

async function initWishlistBadges() {
  document.querySelectorAll(".wishlist-btn").forEach(async (btn) => {
    const isWishlisted = await WishlistService.has(btn.dataset.productId);
    btn.classList.toggle("active", isWishlisted);
  });
}
