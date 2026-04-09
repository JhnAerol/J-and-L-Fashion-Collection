document.addEventListener("DOMContentLoaded", () => {
  const categoryFilter = document.getElementById("category-filter");
  const brandFilter = document.getElementById("brand-filter");
  const priceFilter = document.getElementById("price-filter");

  window.applyFilters = function () {
    let filtered = app.products;

    if (categoryFilter && categoryFilter.value !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter.value);
    }

    if (brandFilter && brandFilter.value !== "all") {
      filtered = filtered.filter(p => p.brand === brandFilter.value);
    }

    if (priceFilter) {
      if (priceFilter.value === "low-high") {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (priceFilter.value === "high-low") {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
      }
    }

    if (window.renderProducts) {
      window.renderProducts(filtered);
    }
  };

  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  if (brandFilter) brandFilter.addEventListener("change", applyFilters);
  if (priceFilter) priceFilter.addEventListener("change", applyFilters);
});
