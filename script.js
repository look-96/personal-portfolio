document.body.classList.add("js");

// Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function toggleMenu(forceOpen) {
  if (!menuButton || !navigation) return;

  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !isOpen;

  menuButton.setAttribute("aria-expanded", String(shouldOpen));
  navigation.classList.toggle("is-open", shouldOpen);
}

menuButton?.addEventListener("click", () => toggleMenu());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    toggleMenu(false);
    menuButton.focus();
  }
});

// Smoothly navigate to in-page sections, while respecting reduced-motion settings.
document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    toggleMenu(false);
  });
});

// Project category filters
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      filterButton.setAttribute("aria-pressed", String(filterButton === button));
    });

    projectCards.forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
  });
});

// Accessible project image lightbox
const lightbox = document.querySelector("#project-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".lightbox-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const image = trigger.querySelector("img");
    const caption = trigger.closest("figure")?.querySelector("figcaption")?.textContent ?? "Project image";
    if (!image || !lightbox || !lightboxImage || !lightboxCaption) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption;
    lightbox.showModal();
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.close());

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

// Real-time contact form validation
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const fields = contactForm
  ? [...contactForm.querySelectorAll("input[required], textarea[required]")]
  : [];

function validateField(field) {
  const errorElement = document.querySelector(`#${field.id}-error`);
  const value = field.value.trim();
  let message = "";

  if (!value) {
    message = "This field is required.";
  } else if (field.type === "email" && !field.validity.valid) {
    message = "Enter a valid email address.";
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (errorElement) errorElement.textContent = message;
  return message === "";
}

fields.forEach((field) => {
  field.addEventListener("input", () => {
    validateField(field);
    if (formStatus) formStatus.textContent = "";
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalidField = fields.find((field) => !validateField(field));
  if (invalidField) {
    if (formStatus) formStatus.textContent = "Please correct the highlighted fields.";
    invalidField.focus();
    return;
  }

  if (formStatus) {
    formStatus.textContent = "Your details look good. This demo form is not connected to a message service yet.";
  }
});
