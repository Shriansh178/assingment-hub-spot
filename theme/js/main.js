(function () {
  "use strict";

  /* -------------------------------------------------------
     Sticky header + mobile nav
  ------------------------------------------------------- */
  const siteHeader = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (siteHeader) {
    const onScroll = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-locked", isOpen);
    });
  }

  document.querySelectorAll("[data-has-submenu]").forEach((item) => {
    const trigger = item.querySelector("[data-submenu-trigger]");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      item.classList.toggle("is-open");
    });
  });

  /* -------------------------------------------------------
     Accordion
  ------------------------------------------------------- */
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const items = Array.from(accordion.querySelectorAll("[data-accordion-item]"));

    const setItemState = (item, open) => {
      const panel = item.querySelector("[data-accordion-panel]");
      const trigger = item.querySelector("[data-accordion-trigger]");
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    };

    items.forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      setItemState(item, item.classList.contains("is-open"));

      trigger.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");
        items.forEach((other) => setItemState(other, other === item ? willOpen : false));
      });
    });

    window.addEventListener("resize", () => {
      items.forEach((item) => {
        if (item.classList.contains("is-open")) setItemState(item, true);
      });
    });
  });

  /* -------------------------------------------------------
     Tabs
  ------------------------------------------------------- */
  document.querySelectorAll("[data-tabs]").forEach((tabGroup) => {
    const buttons = Array.from(tabGroup.querySelectorAll("[data-tab-button]"));
    const panels = Array.from(tabGroup.querySelectorAll("[data-tab-panel]"));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-tab-button");

        buttons.forEach((b) => b.classList.toggle("is-active", b === button));
        panels.forEach((panel) => {
          const match = panel.getAttribute("data-tab-panel") === target;
          panel.classList.toggle("is-active", match);
          if (match) {
            panel.style.animation = "none";
            void panel.offsetHeight;
            panel.style.animation = "";
          }
        });
      });
    });
  });

  /* -------------------------------------------------------
     Modal popups (plus-icon cards)
  ------------------------------------------------------- */
  const openModal = (modal) => {
    modal.classList.add("is-visible");
    document.body.classList.add("nav-locked");
    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-visible");
    document.body.classList.remove("nav-locked");
  };

  document.querySelectorAll("[data-modal-trigger]").forEach((trigger) => {
    const modal = document.getElementById(trigger.getAttribute("data-modal-trigger"));
    if (!modal) return;
    trigger.addEventListener("click", () => openModal(modal));
  });

  document.querySelectorAll("[data-modal]").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.hasAttribute("data-modal-close")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll("[data-modal].is-visible").forEach(closeModal);
  });

  /* -------------------------------------------------------
     AOS init (scroll animations)
  ------------------------------------------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      once: true,
      offset: 60,
      easing: "ease-out-cubic",
    });
  }

  /* -------------------------------------------------------
     Swiper instances
  ------------------------------------------------------- */
  if (window.Swiper) {
    if (document.querySelector(".hero-slider")) {
      new Swiper(".hero-slider", {
        effect: "fade",
        fadeEffect: { crossFade: true },
        loop: true,
        autoplay: { delay: 5500, disableOnInteraction: false },
        pagination: { el: ".hero-slider .swiper-pagination", clickable: true },
        navigation: {
          nextEl: ".hero-slider .swiper-button-next",
          prevEl: ".hero-slider .swiper-button-prev",
        },
      });
    }

    if (document.querySelector(".testimonial-slider")) {
      new Swiper(".testimonial-slider", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        pagination: { el: ".testimonial-slider .swiper-pagination", clickable: true },
        navigation: {
          nextEl: "[data-testimonial-next]",
          prevEl: "[data-testimonial-prev]",
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1080: { slidesPerView: 3 },
        },
      });
    }
  }
})();
