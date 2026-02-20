(function () {
  // =========================
  // Footer year
  // =========================
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
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
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
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
  // Mobile menu (NON modal)
  // =========================
  const menuBtn = document.querySelector("[data-menu-btn]");
  const drawer = document.querySelector("[data-mobile]");

  function toggleDrawer() {
    const isOpen = drawer.classList.toggle("open");
    drawer.setAttribute("aria-hidden", String(!isOpen));
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  }

  menuBtn?.addEventListener("click", toggleDrawer);

  // Chiudi menu quando clicchi un link
  drawer?.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (a) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // =========================
  // Abstract: visibile solo dopo scroll
  // =========================
  const abstract = document.getElementById("abstract");

  if (abstract) {
    abstract.style.visibility = "hidden";

    if ("IntersectionObserver" in window) {
      const absObs = new IntersectionObserver(
        (entries, obs) => {
          if (entries[0].isIntersecting) {
            abstract.style.visibility = "visible";
            obs.disconnect();
          }
        },
        {
          rootMargin: "0px 0px -20% 0px",
          threshold: 0,
        }
      );

      absObs.observe(abstract);
    }
  }

  // =========================
  // Active nav link (FIX DEFINITIVO)
  // =========================
  const desktopLinks = Array.from(
    document.querySelectorAll("[data-nav] a[href^='#']")
  );
  const mobileLinks = Array.from(
    document.querySelectorAll("[data-nav-mobile] a[href^='#']")
  );
  const allLinks = [...desktopLinks, ...mobileLinks];

  const linkById = new Map();

  for (const a of allLinks) {
    const id = a.getAttribute("href")?.slice(1);
    if (!id || id === "abstract") continue;
    if (!linkById.has(id)) linkById.set(id, []);
    linkById.get(id).push(a);
  }

  function setActiveSection(id) {
    allLinks.forEach((a) => {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });
    linkById.get(id)?.forEach((a) => {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    });
  }

  // 🔒 lock per evitare il bug sul click
  let lockActive = false;
  let unlockTimer = null;

  function lockActiveTemporarily(id) {
    lockActive = true;
    setActiveSection(id);

    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => {
      lockActive = false;
    }, 450); // durata smooth scroll
  }

  // click su nav → forza active
  allLinks.forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("href")?.slice(1);
      if (id) lockActiveTemporarily(id);
    });
  });

  // =========================
  // IntersectionObserver sezioni
  // =========================
  const sections = Array.from(
    document.querySelectorAll("main section[id]:not(#abstract)")
  );

  if ("IntersectionObserver" in window && sections.length) {
    const headerH = header?.offsetHeight ?? 76;

    const navObs = new IntersectionObserver(
      (entries) => {
        if (lockActive) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${headerH + 20}px 0px -200px 0px`,
        threshold: 0,
      }
    );

    sections.forEach((s) => navObs.observe(s));
    setActiveSection(sections[0].id);
  }

  // =========================
  // Reveal animations
  // =========================
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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

    revealEls.forEach((el) => rObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();