const BlogService = {
  getRecentPosts(limit = 3) {
    const posts = BLOGS.filter(b => b.status === "published");
    posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return posts.slice(0, limit);
  },

  getPostBySlug(slug) {
    return BLOGS.find(b => b.slug === slug && b.status === "published") || null;
  },

  getAllPosts() {
    return BLOGS.filter(b => b.status === "published")
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }
};
