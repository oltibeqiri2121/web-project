/**
 * Dessau – About Us page – Advanced JS
 * Active nav, expandable lists, team icon hover, smooth scroll
 */
(function () {
  "use strict";

  const LISTS_DATA = [
    { title: "Our Principles", content: "We follow integrity, creativity, and excellence in all projects." },
    { title: "Work Ethics", content: "Our team is committed, professional, and always on time." },
    { title: "What We Do", content: "We design, innovate, and bring architectural visions to life." },
    { title: "Our Legacy", content: "Our work has impacted communities worldwide for decades." }
  ];

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  function setActiveNav() {
    const links = $$("nav ul li a");
    const currentHref = window.location.href.split("?")[0].replace(/\/$/, "");
    links.forEach(function (link) {
      const href = link.href.split("?")[0].replace(/\/$/, "");
      const active = href === currentHref || (currentHref.endsWith("about-us") && href.endsWith("about-us.html"));
      link.classList.toggle("active", active);
      link.setAttribute("aria-current", active ? "page" : "false");
    });
  }

  function initExpandableLists() {
    const containers = $$("#list .list-container");
    if (!containers.length) return;
    containers.forEach(function (container, index) {
      let contentEl = container.querySelector(".hide, p.content");
      if (!contentEl && LISTS_DATA[index]) {
        contentEl = document.createElement("p");
        contentEl.className = "hide content";
        contentEl.textContent = LISTS_DATA[index].content;
        container.appendChild(contentEl);
      }
      const trigger = container.querySelector("h1, h3, button");
      if (!trigger || !contentEl) return;
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-expanded", "false");
      function toggle() {
        const open = contentEl.classList.toggle("show-active");
        trigger.setAttribute("aria-expanded", String(open));
        if (trigger.textContent.trim() === "+" || trigger.textContent.trim() === "−") {
          trigger.textContent = open ? "−" : "+";
        }
      }
      container.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        toggle();
      });
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function initTeamIcons() {
    const icons = $$(".team-member .icon-content svg");
    icons.forEach(function (icon) {
      icon.setAttribute("role", "img");
      icon.addEventListener("mouseenter", function () { icon.style.fill = "#1DA1F2"; });
      icon.addEventListener("mouseleave", function () { icon.style.fill = "#555"; });
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

  function init() {
    setActiveNav();
    initExpandableLists();
    initTeamIcons();
    initSmoothScroll();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
