/**
 * Dessau – Portfolio page – Advanced JS
 * Dynamic nav, gallery load more, category filter, smooth scroll
 */
(function () {
  "use strict";

  const NAV_LINKS = [
    { name: "Home", href: "index.html" },
    { name: "Pages", href: "about-us.html" },
    { name: "Portofolio", href: "portofolio.html" },
    { name: "Blog", href: "blog.html" },
    { name: "Shop", href: "shop.html" },
    { name: "Contact", href: "#" }
  ];

  const PORTFOLIO_ITEMS = [
    { title: "Opera", category: "Buildings", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-1-550x550.jpg" },
    { title: "N Apartment", category: "Interior", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-2-550x550.jpg" },
    { title: "Steel Stairs", category: "Public", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-3-550x550.jpg" },
    { title: "Art School", category: "Public", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h6-port-img-2-550x550.jpg" },
    { title: "My Exhibition", category: "March", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-5-550x550.jpg" },
    { title: "Staircase", category: "September", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-6-550x550.jpg" },
    { title: "The Gallery", category: "January", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-7-550x550.jpg" },
    { title: "Construction", category: "Texture", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-8-550x550.jpg" },
    { title: "Living Room", category: "Furniture", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-9-550x550.jpg" },
    { title: "Office Lobby", category: "Interior", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-10-550x550.jpg" },
    { title: "New Theatre", category: "Industrial Design", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-11-550x550.jpg" },
    { title: "Shoes Store", category: "Commercial", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/h13-port-img-12-550x550.jpg" }
  ];

  const LOAD_MORE_STEP = 3;
  let itemsToShow = 6;
  let activeCategory = "all";

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function getCategories() {
    const set = new Set(PORTFOLIO_ITEMS.map(function (item) { return item.category; }));
    return ["all"].concat(Array.from(set).sort());
  }

  function buildNav() {
    const navUl = $("header nav ul");
    if (!navUl) return;
    const currentPath = window.location.pathname;
    navUl.innerHTML = "";
    NAV_LINKS.forEach(function (link) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.name;
      const isActive = currentPath.endsWith(link.href);
      if (isActive) a.classList.add("active");
      a.setAttribute("aria-current", isActive ? "page" : "false");
      li.appendChild(a);
      navUl.appendChild(li);
    });
  }

  function filteredItems() {
    if (activeCategory === "all") return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter(function (item) { return item.category === activeCategory; });
  }

  function renderPortfolio() {
    const galleryHolder = $(".gallery-holder");
    const loadBtn = $(".load-more");
    if (!galleryHolder) return;
    const filtered = filteredItems();
    const toShow = filtered.slice(0, itemsToShow);
    galleryHolder.innerHTML = toShow.map(function (item) {
      return '<div class="gallery" data-category="' + escapeHtml(item.category) + '">' +
        '<img src="' + escapeHtml(item.img) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<h5>' + escapeHtml(item.category) + '</h5></div>';
    }).join("");
    if (loadBtn) {
      const hasMore = toShow.length < filtered.length;
      loadBtn.style.display = hasMore ? "inline-block" : "none";
      loadBtn.setAttribute("aria-hidden", String(!hasMore));
    }
  }

  function initLoadMore() {
    const loadBtn = $(".load-more");
    if (!loadBtn) return;
    loadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      itemsToShow += LOAD_MORE_STEP;
      renderPortfolio();
    });
  }

  function initCategoryFilter() {
    const categories = getCategories();
    if (categories.length <= 1) return;
    let filterBar = $(".portfolio-filter");
    if (!filterBar) {
      filterBar = document.createElement("div");
      filterBar.className = "portfolio-filter";
      filterBar.setAttribute("role", "tablist");
      filterBar.setAttribute("aria-label", "Filter by category");
      categories.forEach(function (cat, i) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filter-btn";
        btn.textContent = cat === "all" ? "All" : cat;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.dataset.category = cat;
        filterBar.appendChild(btn);
      });
      const galleryHolder = $(".gallery-holder");
      if (galleryHolder && galleryHolder.parentNode) {
        galleryHolder.parentNode.insertBefore(filterBar, galleryHolder);
      }
    }
    filterBar.addEventListener("click", function (e) {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      activeCategory = btn.dataset.category || "all";
      itemsToShow = 6;
      $$(".filter-btn", filterBar).forEach(function (b) {
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
        b.classList.toggle("active", b === btn);
      });
      renderPortfolio();
    });
    $$(".filter-btn", filterBar).forEach(function (b, i) { if (i === 0) b.classList.add("active"); });
  }

  function injectFilterStyles() {
    if ($("#portfolio-filter-styles")) return;
    const style = document.createElement("style");
    style.id = "portfolio-filter-styles";
    style.textContent = ".portfolio-filter{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem;justify-content:center}.portfolio-filter .filter-btn{padding:8px 16px;border:1px solid #1b1b1b;background:#fff;cursor:pointer;font-family:Raleway,sans-serif;font-size:14px}.portfolio-filter .filter-btn:hover,.portfolio-filter .filter-btn.active{background:#1b1b1b;color:#fff}";
    document.head.appendChild(style);
  }

  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !a.hash) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function init() {
    injectFilterStyles();
    buildNav();
    renderPortfolio();
    initLoadMore();
    initCategoryFilter();
    initSmoothScroll();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
