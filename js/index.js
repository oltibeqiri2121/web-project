/**
 * Dessau – Home page (index) – Advanced JS
 * Hero slider, principles accordion, testimonial slider, smooth scroll, header behavior
 */
(function () {
  "use strict";

  const HERO_INTERVAL_MS = 5000;
  const SLIDER_SELECTOR = "#hero .slider";
  const TESTIMONIAL_SLIDER = ".p-slider";
  const TESTIMONIAL_NAV = ".p-slider-nav";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function $(selector, context = document) {
    return context.querySelector(selector);
  }

  function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  function throttle(fn, delay) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  function initHeroSlider() {
    const slider = $(SLIDER_SELECTOR);
    if (!slider) return;
    let scrollAmount = 0;
    let autoScrollTimer = null;
    function goNext() {
      const slideWidth = slider.clientWidth;
      scrollAmount += slideWidth;
      if (scrollAmount >= slider.scrollWidth) scrollAmount = 0;
      slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
    function startAutoScroll() {
      stopAutoScroll();
      autoScrollTimer = setInterval(goNext, HERO_INTERVAL_MS);
    }
    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }
    slider.addEventListener("mouseenter", stopAutoScroll);
    slider.addEventListener("mouseleave", startAutoScroll);
    slider.addEventListener("touchstart", stopAutoScroll, { passive: true });
    slider.addEventListener("touchend", function () {
      setTimeout(startAutoScroll, 500);
    }, { passive: true });
    startAutoScroll();
  }

  function initPrinciplesAccordion() {
    const toggle = $("#principles-toggle");
    const container = toggle && toggle.closest(".list-container");
    const hideEl = container && container.querySelector(".hide");
    if (toggle && hideEl) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        const open = hideEl.classList.toggle("show-active");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "−" : "+";
      });
    }
    $$("#list .list-container").forEach(function (cont) {
      if (cont.querySelector("#principles-toggle")) return;
      const trigger = cont.querySelector("h3");
      const content = cont.querySelector(".hide");
      if (!trigger || !content) return;
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", function () {
        const open = content.classList.toggle("show-active");
        trigger.setAttribute("aria-expanded", String(open));
        trigger.textContent = open ? "−" : "+";
      });
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger.click();
        }
      });
    });
  }

  function initTestimonialSlider() {
    const slider = $(TESTIMONIAL_SLIDER);
    const nav = $(TESTIMONIAL_NAV);
    if (!slider || !nav) return;
    const links = $$("a", nav);
    if (!links.length) return;
    function updateActiveDot() {
      const scrollLeft = slider.scrollLeft;
      const width = slider.clientWidth;
      const index = Math.round(scrollLeft / width);
      const i = Math.max(0, Math.min(index, links.length - 1));
      links.forEach(function (a, j) {
        a.setAttribute("aria-current", j === i ? "true" : "false");
      });
    }
    slider.addEventListener("scroll", throttle(updateActiveDot, 100));
    updateActiveDot();
    links.forEach(function (a, i) {
      a.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      a.addEventListener("click", function (e) {
        e.preventDefault();
        slider.scrollTo({ left: i * slider.clientWidth, behavior: "smooth" });
      });
    });
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

  function initHeaderScroll() {
    const header = $("header");
    if (!header) return;
    const onScroll = throttle(function () {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }, 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  ready(function () {
    initHeroSlider();
    initPrinciplesAccordion();
    initTestimonialSlider();
    initSmoothScroll();
    initHeaderScroll();
  });
})();
