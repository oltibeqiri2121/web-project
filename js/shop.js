/**
 * Dessau – Shop page – Advanced JS
 * Search filter, add-to-cart with feedback, cart state / toast
 */
(function () {
  "use strict";

  const CART_STORAGE_KEY = "dessau_cart";

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function setCart(items) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (_) {}
  }

  function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(function (item) { return item.name === name; });
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else cart.push({ name: name, price: price, qty: 1 });
    setCart(cart);
    showToast('"' + name + '" added to cart');
  }

  function showToast(message) {
    let toast = $(".dessau-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "dessau-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }

  function debounce(fn, delay) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, delay);
    };
  }

  function initSearchFilter() {
    const searchInput = $("#search");
    const shopItemsContainer = $(".shop-items");
    if (!searchInput || !shopItemsContainer) return;
    const items = $$(".shop-item", shopItemsContainer);
    function filter() {
      const q = (searchInput.value || "").trim().toLowerCase();
      items.forEach(function (item) {
        const name = (item.querySelector("h3") && item.querySelector("h3").textContent) || "";
        item.style.display = !q || name.toLowerCase().includes(q) ? "" : "none";
      });
    }
    searchInput.addEventListener("input", debounce(filter, 200));
    searchInput.setAttribute("aria-label", "Search products");
  }

  function initCartClicks() {
    const container = document.getElementById("shop-list") || $(".shop-list") || document.body;
    if (!container) return;
    container.addEventListener("click", function (e) {
      const btn = e.target.closest(".add-to-cart");
      const iconWrap = e.target.closest(".shop-img .icon");
      const shopItem = (btn && btn.closest(".shop-item")) || (iconWrap && iconWrap.closest(".shop-item"));
      if (!shopItem) return;
      e.preventDefault();
      const nameEl = shopItem.querySelector(".shop-content h3");
      const priceStr = shopItem.querySelector(".shop-content h3:last-of-type, .shop-content h3:nth-of-type(2)");
      const name = nameEl ? nameEl.textContent.trim() : "Item";
      let price = 0;
      if (priceStr) {
        const match = priceStr.textContent.replace(/[^0-9.]/g, "");
        if (match) price = parseFloat(match);
      }
      addToCart(name, price);
    });
  }

  function injectToastStyles() {
    if ($("#dessau-toast-styles")) return;
    const style = document.createElement("style");
    style.id = "dessau-toast-styles";
    style.textContent = ".dessau-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#1b1b1b;color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;opacity:0;transition:transform .3s ease,opacity .3s ease;}.dessau-toast.show{transform:translateX(-50%) translateY(0);opacity:1;}";
    document.head.appendChild(style);
  }

  function init() {
    injectToastStyles();
    initSearchFilter();
    initCartClicks();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
