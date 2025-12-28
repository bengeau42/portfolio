(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year in footer
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Sticky header elevation on scroll
  const header = document.querySelector("[data-elevate]");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = $(".nav__toggle");
  const menu = $("#navMenu");
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on link click (mobile)
    $$(".nav__link", menu).forEach((a) => a.addEventListener("click", closeMenu));

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      const clickedInside = menu.contains(e.target) || toggle.contains(e.target);
      if (!clickedInside) closeMenu();
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Filter chips (Work section)
  const chips = $$(".chip");
  const cards = $$(".workCard");
  const setActive = (btn) => {
    chips.forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
  };
  const applyFilter = (filter) => {
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      const show = filter === "all" || tags.includes(filter);
      card.style.display = show ? "" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter || "all";
      setActive(chip);
      applyFilter(filter);
    });
  });

  // Reveal on scroll (IntersectionObserver)
  const revealEls = $$("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Copy email
  const copyBtn = document.querySelector("[data-copy]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = copyBtn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
        const old = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = old), 1100);
      } catch {
        alert("Copy failed. Please copy manually: " + text);
      }
    });
  }

  // Back to top
  const topBtn = document.querySelector("[data-top]");
  if (topBtn) {
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();

(() => {
  const vids = Array.from(document.querySelectorAll(".workCard__video"));
  if (!vids.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!(target instanceof HTMLVideoElement)) return;

      if (isIntersecting) {
        // Try to play (may fail if browser blocks, but muted usually works)
        target.play().catch(() => {});
      } else {
        target.pause();
      }
    });
  }, { threshold: 0.25 });

  vids.forEach(v => io.observe(v));
})();

