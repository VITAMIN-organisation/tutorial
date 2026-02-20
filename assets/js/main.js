(function(){
  const btn = document.querySelector('[data-menu-btn]');
  const mobile = document.querySelector('[data-mobile]');
  if(btn && mobile){
    btn.addEventListener('click', () => {
      const isOpen = mobile.style.display === 'block';
      mobile.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  }
  const y = document.querySelector('[data-year]');
  if(y){ y.textContent = String(new Date().getFullYear()); }
})();

(() => {
  const root = document.documentElement;

  // =========================
  // Theme toggle
  // =========================
  const themeBtn = document.querySelector("[data-theme-toggle]");

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    themeBtn?.setAttribute("aria-pressed", String(theme === "dark"));
  }

  applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });

  // =========================
  // Header scrolled state
  // =========================
  const header = document.querySelector("[data-header]");
  let lastScrolled = false;

  function updateHeaderScrolled() {
    const scrolled = window.scrollY > 10;
    if (scrolled !== lastScrolled) {
      header?.classList.toggle("scrolled", scrolled);
      lastScrolled = scrolled;
    }
  }
  updateHeaderScrolled();
  window.addEventListener("scroll", updateHeaderScrolled, { passive: true });

  // =========================
  // Mobile drawer
  // =========================
  const menuBtn = document.querySelector("[data-menu-btn]");
  const drawer = document.querySelector("[data-mobile]");
  const overlay = document.querySelector("[data-overlay]");
  const closeBtn = document.querySelector("[data-close-mobile]");

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  let lastFocusedEl = null;

  function setOverlay(show) {
    if (!overlay) return;
    overlay.hidden = !show;
    overlay.classList.toggle("show", show);
  }

  function openDrawer() {
    lastFocusedEl = document.activeElement;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    setOverlay(true);
    drawer.querySelector(focusableSelector)?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    setOverlay(false);
    lastFocusedEl?.focus?.();
  }

  menuBtn?.addEventListener("click", () =>
    drawer.classList.contains("open") ? closeDrawer() : openDrawer()
  );
  closeBtn?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  // =========================
  // 🔥 ABSTRACT VISIBILITY (JS-ONLY)
  // =========================
  const abstract = document.getElementById("abstract");

  if (abstract) {
    // Nascondi Abstract al load
    abstract.style.visibility = "hidden";

    if ("IntersectionObserver" in window) {
      const showAbstractObs = new IntersectionObserver(
        (entries, obs) => {
          if (entries[0].isIntersecting) {
            abstract.style.visibility = "visible";
            obs.disconnect();
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -20% 0px",
          threshold: 0
        }
      );

      showAbstractObs.observe(abstract);
    }
  }

  // =========================
  // Active nav link on scroll
  // =========================
  const desktopLinks = Array.from(document.querySelectorAll("[data-nav] a[href^='#']"));
  const mobileLinks = Array.from(document.querySelectorAll("[data-nav-mobile] a[href^='#']"));
  const allLinks = [...desktopLinks, ...mobileLinks];

  const linkById = new Map();
  for (const a of allLinks) {
    const id = a.getAttribute("href")?.slice(1);
    if (!id || id === "abstract") continue; // 👈 Abstract escluso
    if (!linkById.has(id)) linkById.set(id, []);
    linkById.get(id).push(a);
  }

  function setActiveSection(id) {
    allLinks.forEach(a => {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });
    linkById.get(id)?.forEach(a => {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    });
  }

  const sections = Array.from(
    document.querySelectorAll("main section[id]:not(#abstract)")
  );

  if ("IntersectionObserver" in window && sections.length) {
    const header = document.querySelector('[data-header]');
    const HEADER_OFFSET = header?.offsetHeight
      ? header.offsetHeight + 20
      : 96;

    const navObs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${HEADER_OFFSET}px 0px -200px 0px`,
        threshold: 0
      }
    );

    sections.forEach(s => navObs.observe(s));
    setActiveSection(sections[0].id);
  }

  // =========================
  // Reveal animations
  // =========================
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  if (!prefersReduced && "IntersectionObserver" in window) {
    const rObs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            rObs.unobserve(en.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    revealEls.forEach(el => rObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }
})();