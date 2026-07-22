const AuthService = {
  _getUser() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  _saveUser(user) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("auth-updated", { detail: { user } }));
  },

  async getCurrentUser() {
    return this._getUser();
  },

  async isAuthenticated() {
    return this._getUser() !== null;
  },

  async login(email, password) {
    const user = {
      id: "user_001",
      email: email,
      name: "Demo User",
      createdAt: new Date().toISOString()
    };
    this._saveUser(user);
    return { success: true, user };
  },

  async register(name, email, password) {
    const user = {
      id: "user_" + Date.now(),
      email: email,
      name: name,
      createdAt: new Date().toISOString()
    };
    this._saveUser(user);
    return { success: true, user };
  },

  async logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH);
    window.dispatchEvent(new CustomEvent("auth-updated", { detail: { user: null } }));
    return { success: true };
  },

  async updateProfile(data) {
    const user = this._getUser();
    if (!user) return { success: false, message: "Not authenticated" };
    const updated = { ...user, ...data };
    this._saveUser(updated);
    return { success: true, user: updated };
  }
};
