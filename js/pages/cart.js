async function initCartPage() {
  initHeader();
  APP.init();
  await renderCart();
}

async function renderCart() {
  const container = document.getElementById("cart-container");
  const items = await CartService.getCart();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products yet.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  const subtotal = await CartService.getSubtotal();
  const shipping = await CartService.getShipping();
  const tax = await CartService.getTax();
  const total = await CartService.getTotal();

  container.innerHTML = `
    <div class="cart-items">
      <div class="cart-items-header">
        <h2>Cart (${items.length} item${items.length !== 1 ? 's' : ''})</h2>
        <button class="cart-clear-btn" id="clear-cart-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Clear Cart
        </button>
      </div>
      ${items.map(item => {
        const product = item.product;
        const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
        return `
          <div class="cart-item" data-product-id="${item.productId}">
            <div class="cart-item-image">
              <a href="product.html?id=${item.productId}">
                <img src="${product.images?.[0] || product.thumbnail || ''}" alt="${escapeHtml(product.name)}" loading="lazy">
              </a>
            </div>
            <div class="cart-item-info">
              <span class="product-card-category">${getCategoryName(product.categoryId)}</span>
              <h3><a href="product.html?id=${item.productId}">${product.name}</a></h3>
              <div class="cart-item-unit-price">
                ${discount > 0 ? `<span class="cart-item-discount-badge">-${discount}%</span>` : ""}
                <span class="cart-item-price">${CONFIG.CURRENCY_SYMBOL}${product.price.toFixed(2)}</span>
                ${product.compareAtPrice ? `<span class="cart-item-compare">${CONFIG.CURRENCY_SYMBOL}${product.compareAtPrice.toFixed(2)}</span>` : ""}
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-control">
                <button class="qty-btn qty-minus" data-product-id="${item.productId}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn qty-plus" data-product-id="${item.productId}" aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-item-total">${CONFIG.CURRENCY_SYMBOL}${item.total.toFixed(2)}</span>
              <button class="cart-item-delete" data-product-id="${item.productId}" aria-label="Remove ${product.name} from cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join("")}
    </div>

    <div class="cart-summary">
      <h2>Order Summary</h2>
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>${CONFIG.CURRENCY_SYMBOL}${subtotal.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? 'Free' : CONFIG.CURRENCY_SYMBOL + shipping.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Tax</span>
        <span>${CONFIG.CURRENCY_SYMBOL}${tax.toFixed(2)}</span>
      </div>
      ${shipping === 0 ? "" : `<p style="font-size:0.75rem;color:var(--text-light);margin-top:4px;">Free shipping on orders over ${CONFIG.CURRENCY_SYMBOL}${CONFIG.FREE_SHIPPING_THRESHOLD}</p>`}
      <div class="cart-summary-row total">
        <span>Total</span>
        <span>${CONFIG.CURRENCY_SYMBOL}${total.toFixed(2)}</span>
      </div>
      <button class="btn btn-primary btn-full" id="checkout-btn">Proceed to Checkout</button>
      <a href="shop.html" class="btn btn-outline btn-full" style="margin-top:8px;">Continue Shopping</a>
    </div>
  `;

  container.querySelectorAll(".qty-minus").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.productId;
      const item = items.find(i => i.productId === id);
      if (item && item.quantity > 1) {
        await CartService.updateQuantity(id, item.quantity - 1);
        await renderCart();
        updateCartBadge();
      }
    });
  });

  container.querySelectorAll(".qty-plus").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.productId;
      const item = items.find(i => i.productId === id);
      if (item) {
        await CartService.updateQuantity(id, item.quantity + 1);
        await renderCart();
        updateCartBadge();
      }
    });
  });

  container.querySelectorAll(".cart-item-delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      await CartService.removeItem(btn.dataset.productId);
      showToast("Item removed from cart");
      await renderCart();
      updateCartBadge();
    });
  });

  document.getElementById("clear-cart-btn")?.addEventListener("click", async () => {
    await CartService.clearCart();
    showToast("Cart cleared");
    await renderCart();
    updateCartBadge();
  });

  document.getElementById("checkout-btn")?.addEventListener("click", async () => {
    const result = await OrderService.createOrder(items);
    if (result.success) {
      showToast("Order placed successfully!");
      await renderCart();
      updateCartBadge();
    }
  });
}

document.addEventListener("DOMContentLoaded", initCartPage);
