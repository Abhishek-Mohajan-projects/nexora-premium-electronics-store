const CartService = {
  _getCart() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  _saveCart(cart) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { cart } }));
  },

  async addItem(productId, quantity = 1) {
    const product = await ProductService.getProductById(productId);
    if (!product) return { success: false, message: "Product not found" };
    if (product.stock < quantity) return { success: false, message: "Not enough stock" };

    const cart = this._getCart();
    const existing = cart.find(item => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity > product.stock) {
        existing.quantity = product.stock;
      }
    } else {
      cart.push({ productId, quantity, addedAt: new Date().toISOString() });
    }

    this._saveCart(cart);
    return { success: true, message: "Added to cart" };
  },

  async removeItem(productId) {
    const cart = this._getCart().filter(item => item.productId !== productId);
    this._saveCart(cart);
    return { success: true, message: "Removed from cart" };
  },

  async updateQuantity(productId, quantity) {
    const product = await ProductService.getProductById(productId);
    if (!product) return { success: false, message: "Product not found" };

    const cart = this._getCart();
    const item = cart.find(i => i.productId === productId);
    if (!item) return { success: false, message: "Item not in cart" };

    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    item.quantity = Math.min(quantity, product.stock);
    this._saveCart(cart);
    return { success: true, message: "Cart updated" };
  },

  async getCart() {
    const cart = this._getCart();
    const items = [];
    for (const item of cart) {
      const product = await ProductService.getProductById(item.productId);
      if (product) {
        items.push({
          ...item,
          product,
          total: product.price * item.quantity
        });
      }
    }
    return items;
  },

  async getItemCount() {
    const cart = this._getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  async getSubtotal() {
    const cart = this._getCart();
    let subtotal = 0;
    for (const item of cart) {
      const product = await ProductService.getProductById(item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    }
    return Math.round(subtotal * 100) / 100;
  },

  async getShipping() {
    const subtotal = await this.getSubtotal();
    return subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_COST;
  },

  async getTax() {
    const subtotal = await this.getSubtotal();
    return Math.round(subtotal * CONFIG.TAX_RATE * 100) / 100;
  },

  async getTotal() {
    const subtotal = await this.getSubtotal();
    const shipping = await this.getShipping();
    const tax = await this.getTax();
    return Math.round((subtotal + shipping + tax) * 100) / 100;
  },

  async clearCart() {
    this._saveCart([]);
    return { success: true, message: "Cart cleared" };
  }
};
