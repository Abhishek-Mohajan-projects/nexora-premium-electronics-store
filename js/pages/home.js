async function initHomePage() {
  initHeader();
  APP.init();

  renderHeroSidebar();
  renderPromoCards();
  await renderSpecialOffer();
  await initFeaturedTabs();
  await renderThreeColProducts();
  await renderShowcaseProducts();
  await renderBlogSection();
  initHeroSlider();
  initNewsletter();
  initPromoPopup();
  initWishlistBadges();
}

function renderHeroSidebar() {
  const sidebar = document.getElementById("hero-sidebar");
  if (!sidebar) return;

  const allCategories = [
    { id: "featured", name: "Featured", icon: "star" },
    { id: "bestsellers", name: "Best Sellers", icon: "trending" },
    { id: "new", name: "New Arrivals", icon: "new" },
    ...CATEGORIES
  ];

  const iconMap = {
    star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    trending: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    new: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    laptop: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    headphones: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/></svg>',
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    bag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>'
  };

  sidebar.innerHTML = allCategories.map((cat, i) => {
    const icon = cat.icon ? iconMap[cat.icon] : iconMap.bolt;
    const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
    const baseUrl = cat.id === 'featured' ? 'shop.html?sort=featured' : cat.id === 'bestsellers' ? 'shop.html?sort=featured' : cat.id === 'new' ? 'shop.html?sort=newest' : 'shop.html?category=' + cat.id;

    if (hasSubcategories) {
      const subLinks = cat.subcategories.map(sub =>
        `<a href="shop.html?category=${cat.id}&subcategory=${sub.id}" class="mega-sub-link">${sub.name}</a>`
      ).join("");

      return `
        <div class="hero-mega-item" data-cat-id="${cat.id}">
          <a href="${baseUrl}" class="hero-mega-trigger">
            <span class="dept-sidebar-icon">${icon}</span>
            <span class="dept-sidebar-name">${cat.name}</span>
            <svg class="hero-mega-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <div class="hero-mega-panel">
            <div class="hero-mega-panel-inner">
              <div class="hero-mega-panel-head">
                <h4>${cat.name}</h4>
                <p>${cat.description || ''}</p>
              </div>
              <div class="hero-mega-panel-links">
                <a href="${baseUrl}" class="mega-sub-link mega-sub-link--all">View All ${cat.name}</a>
                ${subLinks}
              </div>
              <div class="hero-mega-panel-image">
                <img src="${cat.image}" alt="${cat.name}" loading="lazy">
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <a href="${baseUrl}" class="hero-mega-item hero-mega-item--simple" data-cat-id="${cat.id}">
          <span class="dept-sidebar-icon">${icon}</span>
          <span class="dept-sidebar-name">${cat.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      `;
    }
  }).join("");

  initHeroSidebarInteraction();
}

function initHeroSidebarInteraction() {
  const megaItems = document.querySelectorAll(".hero-mega-item");
  let openItem = null;
  let closeTimer = null;
  let openTimer = null;

  function closeAll() {
    megaItems.forEach(item => item.classList.remove("is-open"));
    openItem = null;
  }

  function scheduleClose(item) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (openItem === item) {
        item.classList.remove("is-open");
        openItem = null;
      }
    }, 180);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  function scheduleOpen(item) {
    clearTimeout(openTimer);
    openTimer = setTimeout(() => {
      if (openItem && openItem !== item) {
        openItem.classList.remove("is-open");
      }
      item.classList.add("is-open");
      openItem = item;
    }, 80);
  }

  function cancelOpen() {
    clearTimeout(openTimer);
  }

  megaItems.forEach(item => {
    if (item.classList.contains("hero-mega-item--simple")) return;

    item.addEventListener("mouseenter", () => {
      cancelClose();
      scheduleOpen(item);
    });

    item.addEventListener("mouseleave", () => {
      cancelOpen();
      scheduleClose(item);
    });

    const panel = item.querySelector(".hero-mega-panel");
    if (panel) {
      panel.addEventListener("mouseenter", () => {
        cancelClose();
        cancelOpen();
      });

      panel.addEventListener("mouseleave", () => {
        scheduleClose(item);
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      closeAll();
    }
  });
}

function renderPromoCards() {
  const grid = document.getElementById("promo-cards-grid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.slice(0, 4).map(cat => renderPromoCategoryCard(cat)).join("");
}

async function renderSpecialOffer() {
  const panel = document.getElementById("special-offer-panel");
  if (!panel) return;

  const discounted = await ProductService.getDiscountedProducts(1);
  const offerProduct = discounted[0] || (await ProductService.getFeaturedProducts(1))[0];
  if (!offerProduct) return;

  const soldCount = Math.floor(Math.random() * 40) + 15;
  panel.innerHTML = renderSpecialOfferPanel(offerProduct, soldCount);
  startCountdown();
}

function startCountdown() {
  let totalSeconds = 8 * 3600 + 45 * 60 + 30;

  function update() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(s).padStart(2, "0");

    if (totalSeconds > 0) {
      totalSeconds--;
      setTimeout(update, 1000);
    }
  }
  update();
}

async function initFeaturedTabs() {
  const grid = document.getElementById("featured-products-grid");
  if (!grid) return;

  const tabData = {
    featured: await ProductService.getFeaturedProducts(8),
    onsale: await ProductService.getDiscountedProducts(8),
    toprated: (await ProductService.getProducts({ sort: "rating" })).slice(0, 8)
  };

  function renderTab(tabName) {
    const products = tabData[tabName] || [];
    grid.innerHTML = products.map(renderProductCard).join("");
  }

  renderTab("featured");

  document.querySelectorAll(".featured-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".featured-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderTab(tab.dataset.tab);
    });
  });
}

async function renderThreeColProducts() {
  const featuredProducts = await ProductService.getFeaturedProducts(5);
  const saleProducts = await ProductService.getDiscountedProducts(5);
  const topProducts = (await ProductService.getProducts({ sort: "rating" })).slice(0, 5);

  const colFeatured = document.querySelector("#col-featured .product-list-items");
  const colSale = document.querySelector("#col-onsale .product-list-items");
  const colTop = document.querySelector("#col-toprated .product-list-items");

  if (colFeatured) colFeatured.innerHTML = featuredProducts.map(renderCompactRow).join("");
  if (colSale) colSale.innerHTML = saleProducts.map(renderCompactRow).join("");
  if (colTop) colTop.innerHTML = topProducts.map(renderCompactRow).join("");
}

async function renderShowcaseProducts() {
  const featuredProducts = await ProductService.getFeaturedProducts(3);
  const saleProducts = await ProductService.getDiscountedProducts(3);
  const topProducts = (await ProductService.getProducts({ sort: "rating" })).slice(0, 3);

  const featuredEl = document.getElementById("featured-items");
  const saleEl = document.getElementById("sale-items");
  const topEl = document.getElementById("toprated-items");

  if (featuredEl) featuredEl.innerHTML = featuredProducts.map(renderCompactRow).join("");
  if (saleEl) saleEl.innerHTML = saleProducts.map(renderCompactRow).join("");
  if (topEl) topEl.innerHTML = topProducts.map(renderCompactRow).join("");
}

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  let current = 0;
  let interval;

  function goTo(index) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[index]?.classList.add("active");
    dots[index]?.classList.add("active");
    current = index;
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    interval = setInterval(next, 5000);
  }

  function stopAuto() {
    clearInterval(interval);
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      stopAuto();
      goTo(parseInt(dot.dataset.slide));
      startAuto();
    });
  });

  startAuto();
}

function initNewsletter() {
  document.getElementById("newsletter-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector("input");
    const success = document.getElementById("newsletter-success");
    const email = input?.value.trim();
    if (!email) {
      showToast("Please enter your email.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email.", "error");
      return;
    }
    form.style.display = "none";
    success.style.display = "block";
    showToast("Subscribed successfully!");
  });
}

function initPromoPopup() {
  const storageKey = "nexora_popup_dismissed";
  if (localStorage.getItem(storageKey)) return;

  setTimeout(() => {
    const popup = document.createElement("div");
    popup.className = "promo-popup-overlay";
    popup.innerHTML = `
      <div class="promo-popup">
        <button class="promo-popup-close" aria-label="Close popup">&times;</button>
        <div class="promo-popup-content">
          <div class="promo-popup-text">
            <p class="promo-popup-label">Get 15% Off</p>
            <h2 class="promo-popup-title">Your First Order</h2>
            <p class="promo-popup-desc">Join our newsletter for exclusive deals and new product updates.</p>
            <form class="promo-popup-form" id="popup-newsletter-form">
              <input type="email" placeholder="Enter your email" required aria-label="Email address">
              <button type="submit" class="btn btn-primary">Subscribe</button>
            </form>
            <label class="popup-dontshow">
              <input type="checkbox" id="popup-dontshow-cb">
              <span>Don't show again</span>
            </label>
          </div>
          <div class="promo-popup-image">
            <img src="assets/headset.png" alt="Special Offer">
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add("active"));

    const closePopup = () => {
      const dontShow = popup.querySelector("#popup-dontshow-cb")?.checked;
      if (dontShow) {
        localStorage.setItem(storageKey, "true");
      } else {
        sessionStorage.setItem(storageKey, "true");
      }
      popup.classList.remove("active");
      setTimeout(() => popup.remove(), 300);
    };

    popup.querySelector(".promo-popup-close").addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    popup.querySelector("#popup-newsletter-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = e.target.querySelector("input");
      const email = input?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email.", "error");
        return;
      }
      showToast("Subscribed! Check your inbox.");
      closePopup();
    });

    setTimeout(closePopup, 20000);
  }, 3000);
}

async function renderBlogSection() {
  const section = document.getElementById("recent-blog-section");
  if (!section) return;

  const posts = BlogService.getRecentPosts(3);
  if (!posts.length) {
    section.style.display = "none";
    return;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const cards = posts.map(post => `
    <a href="blog.html?slug=${post.slug}" class="blog-card">
      <div class="blog-card-image">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
        <span class="blog-card-category">${post.category}</span>
      </div>
      <div class="blog-card-body">
        <time class="blog-card-date" datetime="${post.publishedAt}">${formatDate(post.publishedAt)}</time>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <span class="blog-card-cta">Read Article
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </a>
  `).join("");

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <p class="section-label">From the Journal</p>
        <h2 class="section-title">Latest from our blog</h2>
        <p class="section-desc">Helpful guides, ideas, and insights to help you get more from your everyday technology.</p>
      </div>
      <div class="blog-grid">${cards}</div>
      <div class="blog-viewall-wrap">
        <a href="blog.html" class="btn btn-outline">View All Articles</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", initHomePage);
