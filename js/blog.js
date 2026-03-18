/**
 * Dessau – Blog page – Advanced JS
 * Dynamic nav, dynamic posts, pagination, smooth scroll
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

  const BLOG_POSTS = [
    { title: "Bauhaus", author: "Kevin Johnson", category: "Architecture", date: "05/03/2018", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/blog-img-4.jpg", excerpt: "Eainean imperdiet. Atium oltri cies nisi vol augue. Surabitur ullam corper ultricies nisi. Nam eget dui..." },
    { title: "Minimalism", author: "Kevin Johnson", category: "Architecture", date: "05/03/2018", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/blog-img-5.jpg", excerpt: "Eainean imperdiet. Atium oltri cies nisi vol augue. Surabitur ullam corper ultricies nisi. Nam eget dui..." },
    { title: "Focus On Details", author: "Kevin Johnson", category: "Architecture", date: "05/03/2018", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/04/blog-img-7.jpg", excerpt: "Eainean imperdiet. Atium oltri cies nisi vol augue. Surabitur ullam corper ultricies nisi. Nam eget dui..." },
    { title: "Modern Spaces", author: "Kevin Johnson", category: "Interior", date: "12/04/2018", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/blog-img-4.jpg", excerpt: "Nam quam nunc, blandit vel, luctus pulvinar. Maecenas tempus, tellus eget condimentum rhoncus." },
    { title: "Light & Shadow", author: "Kevin Johnson", category: "Architecture", date: "20/04/2018", img: "https://dessau.qodeinteractive.com/wp-content/uploads/2018/05/blog-img-5.jpg", excerpt: "Sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc." }
  ];

  const POSTS_PER_PAGE = 3;
  let currentPage = 1;

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
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
      const isActive = currentPath.endsWith(link.href) || (link.href === "blog.html" && currentPath.includes("blog"));
      if (isActive) a.classList.add("active");
      a.setAttribute("aria-current", isActive ? "page" : "false");
      li.appendChild(a);
      navUl.appendChild(li);
    });
  }

  function renderBlogPosts() {
    const container = $(".blog-gallery");
    if (!container) return;
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const postsToShow = BLOG_POSTS.slice(start, end);
    container.innerHTML = postsToShow.map(function (post) {
      return '<div class="blog-holder">' +
        '<img src="' + escapeHtml(post.img) + '" alt="' + escapeHtml(post.title) + '">' +
        '<a href="#">' + escapeHtml(post.title) + '</a>' +
        '<ul><li>' + escapeHtml(post.author) + '</li><li>/</li><li>' + escapeHtml(post.category) + '</li><li>/</li><li>' + escapeHtml(post.date) + '</li></ul>' +
        '<p>' + escapeHtml(post.excerpt) + '</p>' +
        '<div class="read-more" role="button" tabindex="0">Read more &gt;</div></div>';
    }).join("");
    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(BLOG_POSTS.length / POSTS_PER_PAGE);
    const paginationUl = $("#link ul");
    if (!paginationUl) return;
    paginationUl.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = i;
      a.setAttribute("aria-label", "Page " + i);
      if (i === currentPage) { a.classList.add("active"); a.setAttribute("aria-current", "page"); }
      a.addEventListener("click", (function (p) {
        return function (e) {
          e.preventDefault();
          currentPage = p;
          renderBlogPosts();
        };
      })(i));
      li.appendChild(a);
      paginationUl.appendChild(li);
    }
    const liNext = document.createElement("li");
    const aNext = document.createElement("a");
    aNext.href = "#";
    aNext.textContent = ">";
    aNext.setAttribute("aria-label", "Next page");
    aNext.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentPage < totalPages) { currentPage++; renderBlogPosts(); }
    });
    liNext.appendChild(aNext);
    paginationUl.appendChild(liNext);
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
    buildNav();
    renderBlogPosts();
    initSmoothScroll();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
