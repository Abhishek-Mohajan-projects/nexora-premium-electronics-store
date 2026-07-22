const WishlistService = {
  _getItems() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  _saveItems(items) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items } }));
  },

  async add(productId) {
    const items = this._getItems();
    if (!items.includes(productId)) {
      items.push(productId);
      this._saveItems(items);
    }
    return { success: true };
  },

  async remove(productId) {
    const items = this._getItems().filter(id => id !== productId);
    this._saveItems(items);
    return { success: true };
  },

  async toggle(productId) {
    if (await this.has(productId)) {
      await this.remove(productId);
      return { success: true, added: false };
    } else {
      await this.add(productId);
      return { success: true, added: true };
    }
  },

  async has(productId) {
    return this._getItems().includes(productId);
  },

  async getItems() {
    const ids = this._getItems();
    const products = [];
    for (const id of ids) {
      const product = await ProductService.getProductById(id);
      if (product) products.push(product);
    }
    return products;
  },

  async getItemCount() {
    return this._getItems().length;
  },

  async clear() {
    this._saveItems([]);
    return { success: true };
  }
};
