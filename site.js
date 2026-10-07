(() => {
  const data = window.TUFF_CHEF_DATA || {};
  const fallbackValues = {
    address: "Address details coming soon",
    hours: "Opening hours to be confirmed",
    phone: "Phone details coming soon",
    whatsapp: "WhatsApp details coming soon",
    email: "Email details coming soon",
    instagramHandle: "Instagram details coming soon"
  };

  document.querySelectorAll("[data-site-value]").forEach((node) => {
    const key = node.dataset.siteValue;
    const value = data[key];
    node.textContent = value || node.dataset.fallback || fallbackValues[key] || "Details coming soon";
  });

  const mapUrl = data.mapUrl || "https://www.google.com/maps/search/?api=1&query=The+Tuff+Chef+Restaurant%2C+Jalandhar%2C+Punjab";
  document.querySelectorAll("[data-map-link]").forEach((link) => {
    link.href = mapUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll('[data-contact-link="phone"]').forEach((link) => {
    if (data.phone) {
      link.href = `tel:${data.phone.replace(/[^+\d]/g, "")}`;
      link.textContent = data.phone;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  });
  document.querySelectorAll('[data-contact-link="whatsapp"]').forEach((link) => {
    if (data.whatsapp) {
      const digits = data.whatsapp.replace(/\D/g, "");
      link.href = `https://wa.me/${digits}`;
      link.textContent = data.whatsapp;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  });
  document.querySelectorAll('[data-contact-link="email"]').forEach((link) => {
    if (data.email) {
      link.href = `mailto:${data.email}`;
      link.textContent = data.email;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  });

  const instagramLinks = document.querySelectorAll('[data-social="instagram"]');
  instagramLinks.forEach((link) => {
    if (data.instagramUrl) {
      link.href = data.instagramUrl;
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (data.instagramHandle && link.dataset.showHandle !== "false") link.textContent = `@${data.instagramHandle.replace(/^@/, "")}`;
    } else {
      link.hidden = true;
    }
  });
  document.querySelectorAll('[data-social="facebook"]').forEach((link) => {
    if (data.facebookUrl) {
      link.href = data.facebookUrl;
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.hidden = true;
    }
  });
  document.querySelectorAll("[data-social-empty]").forEach((node) => {
    node.hidden = Boolean(data.instagramUrl || data.facebookUrl);
  });

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".main-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".arrival-main, .story-copy, .menu-copy, .menu-photo-stack, .signature-head, .signature-empty, .fire-copy, .experience-copy, .gallery-teaser-head, .review-note, .location-copy, .final-cta-inner, .page-hero-content, .menu-intro-copy, .story-page-copy, .contact-copy, .contact-form-wrap");
  if ("IntersectionObserver" in window) {
    revealItems.forEach((item) => item.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const heroImage = document.querySelector(".hero-image");
  if (heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => {
      const offset = Math.min(window.scrollY * 0.08, 42);
      heroImage.style.transform = `scale(1.04) translateY(${offset}px)`;
    }, { passive: true });
  }

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  // Content-ready menu browser. It displays real data only; the current menu
  // remains intentionally empty until the Jalandhar menu is confirmed.
  const menuBrowser = document.querySelector("[data-menu-browser]");
  if (menuBrowser) renderMenu(menuBrowser, Array.isArray(data.menuCategories) ? data.menuCategories : []);

  const signatureContainer = document.querySelector("[data-signatures]");
  if (signatureContainer) renderSignatures(signatureContainer, Array.isArray(data.signatureDishes) ? data.signatureDishes : []);

  // Gallery filter and accessible image lightbox.
  const gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    const cards = [...gallery.querySelectorAll("[data-gallery-category]")];
    const filters = [...document.querySelectorAll("[data-gallery-filter]")];
    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const active = filter.dataset.galleryFilter;
        filters.forEach((button) => button.setAttribute("aria-pressed", String(button === filter)));
        cards.forEach((card) => {
          card.hidden = active !== "all" && card.dataset.galleryCategory !== active;
        });
      });
    });

    const dialog = document.querySelector("#gallery-lightbox");
    const dialogImage = dialog?.querySelector("img");
    const dialogCaption = dialog?.querySelector("figcaption");
    const closeButton = dialog?.querySelector("[data-lightbox-close]");
    if (dialog && dialogImage && dialogCaption) {
      cards.forEach((card) => {
        card.addEventListener("click", () => {
          const image = card.querySelector("img");
          if (!image) return;
          dialogImage.src = image.currentSrc || image.src;
          dialogImage.alt = image.alt;
          dialogCaption.textContent = card.dataset.caption || card.innerText.trim();
          if (typeof dialog.showModal === "function") dialog.showModal();
        });
      });
      closeButton?.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    }
  }

  const form = document.querySelector("[data-reservation-form]");
  if (form) {
    const dateField = form.querySelector('input[name="date"]');
    if (dateField) {
      const localToday = new Date();
      const localDate = new Date(localToday.getTime() - localToday.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.min = localDate;
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      const recipient = data.reservationEmail || data.email;
      if (recipient) {
        const values = new FormData(form);
        const body = [
          `Name: ${values.get("name") || ""}`,
          `Phone: ${values.get("phone") || ""}`,
          `Date: ${values.get("date") || ""}`,
          `Time: ${values.get("time") || ""}`,
          `Guests: ${values.get("guests") || ""}`,
          `Message: ${values.get("message") || ""}`
        ].join("%0D%0A");
        const subject = encodeURIComponent("Table enquiry — The Tuff Chef Jalandhar");
        if (status) status.textContent = "Opening your email app with the enquiry details…";
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      } else if (status) {
        status.textContent = "This enquiry form is ready, but it is not connected yet. Add a confirmed reservation email in site-data.js before publishing.";
      }
    });
  }
})();

function renderMenu(container, categories) {
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  container.replaceChildren();
  if (!categories.length) {
    const empty = create("div", "menu-empty");
    empty.append(create("span", "menu-empty-number", "01"));
    const copy = create("div", "menu-empty-copy");
    copy.append(create("h3", "", "The Jalandhar menu is being confirmed."));
    copy.append(create("p", "", "We’re keeping this page honest: categories, dishes and prices will appear once the Jalandhar menu is confirmed. No guessed listings."));
    empty.append(copy);
    const cta = create("a", "button button-outline button-small", "Plan your visit");
    cta.href = "contact.html#location";
    empty.append(cta);
    container.append(empty);
    return;
  }

  const filters = create("div", "menu-tabs");
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Menu categories");
  const list = create("div", "menu-item-list");
  const showItems = (active) => {
    list.replaceChildren();
    const visible = active === "all" ? categories : categories.filter((category) => category.name === active);
    visible.forEach((category) => {
      (category.items || []).forEach((item) => {
        const article = create("article", "menu-item");
        const details = create("div", "");
        details.append(create("h3", "", item.name || ""));
        if (item.description) details.append(create("p", "", item.description));
        if (item.diet) details.append(create("span", "diet", item.diet));
        article.append(details);
        if (item.price) article.append(create("strong", "price", item.price));
        list.append(article);
      });
    });
  };
  const allButton = create("button", "menu-tab", "All");
  allButton.type = "button";
  allButton.setAttribute("aria-pressed", "true");
  allButton.addEventListener("click", () => {
    filters.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button === allButton)));
    showItems("all");
  });
  filters.append(allButton);
  categories.forEach((category) => {
    const button = create("button", "menu-tab", category.name || "Category");
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      filters.querySelectorAll("button").forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      showItems(category.name);
    });
    filters.append(button);
  });
  container.append(filters, list);
  showItems("all");
}

function renderSignatures(container, dishes) {
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  container.replaceChildren();
  if (!dishes.length) {
    const empty = create("div", "signature-empty");
    const imageWrap = create("figure", "signature-empty-image");
    const image = create("img", "", "");
    image.src = "assets/images/sizzler-platter.jpg";
    image.alt = "Illustrative food photograph; not a confirmed Tuff Chef signature dish";
    image.loading = "lazy";
    imageWrap.append(image, create("figcaption", "", "Illustrative image · replace with a confirmed signature dish"));
    const copy = create("div", "signature-empty-copy");
    copy.append(create("span", "kicker", "A real lineup, coming soon"));
    copy.append(create("h3", "display", "No guessed plates."));
    copy.append(create("p", "", "The signature dishes will appear when the Jalandhar kitchen confirms them. Real names, real descriptions, and the actual dishes on the table."));
    const link = create("a", "text-link", "Menu update");
    link.href = "menu.html";
    copy.append(link);
    empty.append(imageWrap, copy);
    container.append(empty);
    return;
  }

  const grid = create("div", "signature-grid");
  dishes.slice(0, 6).forEach((dish, index) => {
    const card = create("article", `signature-card${index === 0 ? " signature-card-featured" : ""}`);
    const figure = create("figure", "");
    const image = create("img", "");
    image.src = dish.image || "assets/images/sizzler-platter.jpg";
    image.alt = dish.imageAlt || dish.name || "Signature dish";
    image.loading = "lazy";
    figure.append(image);
    card.append(figure);
    const details = create("div", "signature-card-copy");
    details.append(create("span", "kicker", "Signature"));
    details.append(create("h3", "display", dish.name || ""));
    if (dish.description) details.append(create("p", "", dish.description));
    card.append(details);
    grid.append(card);
  });
  container.append(grid);
}
