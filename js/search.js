// search.js
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  if(searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if(window.renderProducts && query) {
        // Find products matching query in name, brand, or category
        const filtered = app.products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.brand.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        );
        window.renderProducts(filtered);
      }
    });

    // Also search on typing
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if(window.renderProducts) {
        if(!query) {
           // Reset to all products or apply current sort/filter
           if(window.applyFilters) {
              window.applyFilters();
           } else {
              window.renderProducts(app.products);
           }
           return;
        }
        const filtered = app.products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.brand.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        );
        window.renderProducts(filtered);
      }
    });
  }
});
