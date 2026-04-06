const app = {
  isRoot: false,
  products: [],
  stockKey: 'j_l_fashion_stocks',

  async init(isRoot = false) {
    this.isRoot = isRoot;
    this.initToastContainer();
    this.renderNavbar();
    this.renderFooter();
    await this.loadProducts();
    cart.updateCartBadge();
  },

  initToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(message, icon = '🛍️') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
      <div class="custom-toast-icon">${icon}</div>
      <div class="custom-toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Force reflow for animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  },

  basePath() {
    return this.isRoot ? '.' : '..';
  },

  renderNavbar() {
    const navbarHTML = `
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
          <a class="navbar-brand me-auto me-lg-4" href="${this.basePath()}/index.html">J & L</a>
          
          <!-- Desktop Menu & Desktop Cart -->
          <div class="collapse navbar-collapse order-3 order-lg-2" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" href="${this.basePath()}/index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${this.basePath()}/views/products.html">Products</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${this.basePath()}/views/suppliers.html">Suppliers</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${this.basePath()}/views/about.html">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${this.basePath()}/views/contact.html">Contact</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${this.basePath()}/views/order-status.html">Order Status</a>
              </li>
            </ul>
          </div>

          <!-- Quick Access Icons (Right Aligned) -->
          <div class="d-flex align-items-center gap-2 order-2 order-lg-3 ms-lg-auto">
             <a href="${this.basePath()}/views/checkout.html" class="nav-link p-2 position-relative">
                <div class="cart-icon">
                  <span class="fs-4">🛍️</span>
                  <span class="cart-badge" id="navbar-cart-badge" style="display:none;">0</span>
                </div>
             </a>
             <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
             </button>
          </div>
        </div>
      </nav>
    `;
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) navContainer.innerHTML = navbarHTML;
    this.renderBottomNav();
  },

  renderBottomNav() {
    // Only show on mobile
    if (window.innerWidth > 576) return;

    if (document.getElementById('bottom-nav')) return;

    const navHTML = `
      <div id="bottom-nav" class="bottom-nav">
        <a href="${this.basePath()}/index.html" class="bottom-nav-item">🏠</a>
        <a href="${this.basePath()}/views/products.html" class="bottom-nav-item">🔍</a>
        <a href="${this.basePath()}/views/about.html" class="bottom-nav-item">👤</a>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
  },

  renderFooter() {
    const footerHTML = `
      <footer class="mt-auto pb-5 pb-md-0">
        <div class="container text-center">
          <p class="mb-2">&copy; ${new Date().getFullYear()} J & L Fashion Collection</p>
          <div>
            <a href="${this.basePath()}/views/about.html" class="footer-link mx-2">About</a>
            <a href="${this.basePath()}/views/contact.html" class="footer-link mx-2">Contact</a>
            <a href="${this.basePath()}/views/suppliers.html" class="footer-link mx-2">Suppliers</a>
          </div>
        </div>
      </footer>
    `;
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) footerContainer.innerHTML = footerHTML;
  },

  async loadProducts() {
    try {
      const response = await fetch(`${this.basePath()}/data/products.json`);
      let allProducts = await response.json();

      // Check local storage for updated stocks
      const savedStocks = localStorage.getItem(this.stockKey);
      let localStocks = savedStocks ? JSON.parse(savedStocks) : {};

      // Merge local stocks into data
      this.products = allProducts.map(p => {
        if (localStocks[p.id] !== undefined) {
          p.stock = localStocks[p.id];
        }
        return p;
      });

    } catch (e) {
      console.error("Error loading products", e);
    }
  },

  updateStocks(purchasedItems) {
    const savedStocks = localStorage.getItem(this.stockKey);
    let localStocks = savedStocks ? JSON.parse(savedStocks) : {};

    purchasedItems.forEach(item => {
      let currentStock = localStocks[item.id] !== undefined ? localStocks[item.id] : item.stock;
      localStocks[item.id] = Math.max(0, currentStock - item.quantity);
    });

    localStorage.setItem(this.stockKey, JSON.stringify(localStocks));
  },

  getProductCardHTML(product) {
    let stockText = product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock';
    let stockClass = product.stock > 0 ? 'text-success' : 'text-danger';

    // Truncate name slightly less to keep details visible
    let displayName = product.name.length > 40 ? product.name.substring(0, 37) + "..." : product.name;

    return `
      <div class="col-6 col-lg-3">
        <div class="card product-card h-100 position-relative">
          <a href="${this.basePath()}/views/product-details.html?id=${product.id}" class="text-decoration-none text-dark">
            <div class="product-img-wrapper">
              ${product.isFeatured ? '<span class="product-badge">Featured</span>' : ''}
              <img src="${product.images[0]}" alt="${product.name}" class="card-img-top">
            </div>
            <div class="product-info">
              <p class="product-brand mb-0">${product.brand}</p>
              <h5 class="product-title">${displayName}</h5>
              
              <div class="d-flex align-items-center mb-1">
                ${product.oldPrice ? `<small class="text-muted text-decoration-line-through me-2">$${product.oldPrice.toFixed(2)}</small>` : ''}
                <span class="product-price fw-bold me-2">$${product.price.toFixed(2)}</span>
              </div>

              <div class="d-flex flex-wrap align-items-center gap-2 small text-muted">
                <div class="d-flex align-items-center">
                  <span class="text-warning me-1">★</span> ${product.rating}
                </div>
                <span class="opacity-50">|</span>
                <span class="${stockClass} fw-bold" style="font-size: 0.75rem;">${stockText}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    `;
  },

  loadFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    const featured = this.products.filter(p => p.isFeatured).slice(0, 4);

    if (featured.length === 0) {
      container.innerHTML = `<p class="text-center w-100">No featured products right now.</p>`;
      return;
    }

    let html = '';
    featured.forEach(item => {
      html += this.getProductCardHTML(item);
    });
    container.innerHTML = html;
  }
};
