const ProductService = {
  async getProducts(filters = {}) {
    let products = [...PRODUCTS];

    if (filters.category) {
      products = products.filter(p => p.categoryId === filters.category);
    }

    if (filters.subcategory) {
      products = products.filter(p => p.subcategoryId === filters.subcategory);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.categoryId.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minRating !== undefined) {
      products = products.filter(p => p.rating >= filters.minRating);
    }

    if (filters.inStock) {
      products = products.filter(p => p.stock > 0);
    }

    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      products = products.filter(p => tags.some(t => p.tags.includes(t)));
    }

    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "discount":
          products.sort((a, b) => {
            const dA = a.compareAtPrice ? ((a.compareAtPrice - a.price) / a.compareAtPrice) : 0;
            const dB = b.compareAtPrice ? ((b.compareAtPrice - b.price) / b.compareAtPrice) : 0;
            return dB - dA;
          });
          break;
        case "featured":
        default:
          products.sort((a, b) => {
            const aF = a.tags.includes("featured") ? 1 : 0;
            const bF = b.tags.includes("featured") ? 1 : 0;
            return bF - aF || b.reviewCount - a.reviewCount;
          });
          break;
      }
    }

    return products;
  },

  async getProductById(id) {
    return PRODUCTS.find(p => p.id === id) || null;
  },

  async getProductBySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug) || null;
  },

  async searchProducts(query) {
    if (!query || query.trim() === "") return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);
  },

  async getProductsByCategory(categoryId) {
    return PRODUCTS.filter(p => p.categoryId === categoryId);
  },

  async getProductsBySubcategory(categoryId, subcategoryId) {
    return PRODUCTS.filter(p => p.categoryId === categoryId && p.subcategoryId === subcategoryId);
  },

  async getSubcategories(categoryId) {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category ? category.subcategories || [] : [];
  },

  async getFeaturedProducts(limit = 8) {
    return PRODUCTS.filter(p => p.tags.includes("featured")).slice(0, limit);
  },

  async getTrendingProducts(limit = 8) {
    return [...PRODUCTS]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  },

  async getBestsellerProducts(limit = 8) {
    return PRODUCTS.filter(p => p.tags.includes("bestseller")).slice(0, limit);
  },

  async getNewArrivals(limit = 8) {
    return [...PRODUCTS]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  async getRelatedProducts(productId, limit = 4) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return [];
    return PRODUCTS.filter(p => p.id !== productId && p.categoryId === product.categoryId)
      .slice(0, limit);
  },

  async getDiscountedProducts(limit = 8) {
    return PRODUCTS.filter(p => p.compareAtPrice && p.compareAtPrice > p.price)
      .sort((a, b) => {
        const discA = ((a.compareAtPrice - a.price) / a.compareAtPrice) * 100;
        const discB = ((b.compareAtPrice - b.price) / b.compareAtPrice) * 100;
        return discB - discA;
      })
      .slice(0, limit);
  }
};
