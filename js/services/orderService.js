const OrderService = {
  _getOrders() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  _saveOrders(orders) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  async createOrder(cartItems, shippingAddress = {}) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_COST;
    const tax = Math.round(subtotal * CONFIG.TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const order = {
      id: "ord_" + Date.now(),
      userId: (await AuthService.getCurrentUser())?.id || "guest",
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      discount: 0,
      tax,
      total,
      currency: CONFIG.CURRENCY,
      status: "pending",
      shippingAddress,
      createdAt: new Date().toISOString()
    };

    const orders = this._getOrders();
    orders.push(order);
    this._saveOrders(orders);

    await CartService.clearCart();

    return { success: true, order };
  },

  async getOrders() {
    return this._getOrders();
  },

  async getOrderById(id) {
    return this._getOrders().find(o => o.id === id) || null;
  }
};
