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
    </div>
    <div class="products-grid" id="wishlist-grid"></div>
  `;

  document.getElementById("wishlist-grid").innerHTML = items.map(renderProductCard).join("");

  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", initWishlistPage);
