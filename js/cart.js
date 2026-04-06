const CART_KEY = 'j_l_fashion_cart';

const cart = {
  items: [],

  init() {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  },

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    this.updateCartBadge();
  },

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    // Check stock before adding
    let currentQty = existingItem ? existingItem.quantity : 0;
    if (currentQty + quantity > product.stock) {
      app.showToast(`Only ${product.stock} items left in stock!`, '⚠️');
      return;
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        stock: product.stock
      });
    }
    this.save();
    app.showToast(`${product.name} added to your Yellow Basket!`, '✨');
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      if(quantity > item.stock) {
        app.showToast(`Only ${item.stock} items left in stock.`, '⚠️');
        return;
      }
      if(quantity < 1) {
        this.removeItem(productId);
        return;
      }
      item.quantity = quantity;
      this.save();
    }
  },

  removeItems(productIds) {
    this.items = this.items.filter(item => !productIds.includes(item.id));
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  },

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = this.getCount();
      if(this.getCount() === 0){
        badge.style.display = 'none';
      } else {
        badge.style.display = 'inline-block';
      }
    });
  }
};

// Initialize cart on load
cart.init();
