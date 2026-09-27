document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MENU MOBILE
  ========================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function closeMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const menuIsOpen = mobileMenu.classList.toggle("is-open");

      menuToggle.classList.toggle("is-open", menuIsOpen);
      menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
      menuToggle.setAttribute(
        "aria-label",
        menuIsOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  /* =========================
     CARROSSEL DO HERO
  ========================= */

  const slider = document.querySelector(".hero-slider");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const prevButton = document.querySelector(".hero-prev");
  const nextButton = document.querySelector(".hero-next");
  const currentCount = document.querySelector(".hero-current");
  const totalCount = document.querySelector(".hero-total");

  if (!slider || slides.length === 0) return;

  let currentSlide = 0;
  let autoplayId;
  const autoplayDelay = 6000;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (totalCount) {
    totalCount.textContent = String(slides.length).padStart(2, "0");
  }

  function updateCounter() {
    if (!currentCount) return;

    currentCount.textContent = String(currentSlide + 1).padStart(2, "0");
  }

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    updateCounter();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function previousSlide() {
    showSlide(currentSlide - 1);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayId);
  }

  function startAutoplay() {
    if (reducedMotion || slides.length < 2) return;

    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, autoplayDelay);
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      previousSlide();
      startAutoplay();
    });
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;
    const userIsInsideSlider = slider.contains(activeElement);

    if (!userIsInsideSlider) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
      startAutoplay();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
      startAutoplay();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 45;

  slider.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
      stopAutoplay();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          previousSlide();
        }
      }

      startAutoplay();
    },
    { passive: true }
  );

  showSlide(0);
  startAutoplay();
}); 
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     GALERIA DE PÁGINA DE PROJETO
  ========================= */

  const thumbnails = Array.from(document.querySelectorAll(".project-thumb"));
  const mainImage = document.querySelector(".project-main-image");
  const mainImageButton = document.querySelector(".project-main-image-button");
  const previousButton = document.querySelector(".project-gallery-prev");
  const nextButton = document.querySelector(".project-gallery-next");
  const currentImageCount = document.querySelector(".project-current-image");
  const totalImageCount = document.querySelector(".project-total-images");

  const lightbox = document.querySelector(".image-lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrevious = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const lightboxCurrent = document.querySelector(".lightbox-current");
  const lightboxTotal = document.querySelector(".lightbox-total");

  if (
    thumbnails.length === 0 ||
    !mainImage ||
    !mainImageButton ||
    !lightbox ||
    !lightboxImage
  ) {
    return;
  }

  let activeImage = 0;

  if (totalImageCount) {
    totalImageCount.textContent = String(thumbnails.length).padStart(2, "0");
  }

  if (lightboxTotal) {
    lightboxTotal.textContent = String(thumbnails.length).padStart(2, "0");
  }

  function updateProjectImage(index) {
    activeImage = (index + thumbnails.length) % thumbnails.length;

    const activeThumbnail = thumbnails[activeImage];
    const imageSource = activeThumbnail.dataset.image;
    const imageAlt = activeThumbnail.dataset.alt;

    mainImage.src = imageSource;
    mainImage.alt = imageAlt;

    lightboxImage.src = imageSource;
    lightboxImage.alt = imageAlt;

    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      const isActive = thumbnailIndex === activeImage;

      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-selected", String(isActive));
    });

    const formattedPosition = String(activeImage + 1).padStart(2, "0");

    if (currentImageCount) {
      currentImageCount.textContent = formattedPosition;
    }

    if (lightboxCurrent) {
      lightboxCurrent.textContent = formattedPosition;
    }
  }

  function showNextImage() {
    updateProjectImage(activeImage + 1);
  }

  function showPreviousImage() {
    updateProjectImage(activeImage - 1);
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      updateProjectImage(index);
    });

    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        thumbnails[(index + 1) % thumbnails.length].focus();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        thumbnails[(index - 1 + thumbnails.length) % thumbnails.length].focus();
      }
    });
  });

  previousButton?.addEventListener("click", showPreviousImage);
  nextButton?.addEventListener("click", showNextImage);

  mainImageButton.addEventListener("click", () => {
    lightbox.showModal();
  });

  lightboxClose?.addEventListener("click", () => {
    lightbox.close();
  });

  lightboxPrevious?.addEventListener("click", showPreviousImage);
  lightboxNext?.addEventListener("click", showNextImage);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextImage();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousImage();
    }
  });

  updateProjectImage(0);
}); 
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     CORTINA INICIAL + FADE INTERNO
  ========================= */

  const body = document.body;
  const curtain = document.querySelector(".page-transition");
  const storageKey = "sariedine-intro-seen";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let isNavigating = false;

  function revealPage() {
    body.classList.remove("is-leaving");

    requestAnimationFrame(() => {
      body.classList.add("page-is-ready");
    });
  }

  const introAlreadySeen = sessionStorage.getItem(storageKey);

  /* A CORTINA É ATIVADA SOMENTE NA PRIMEIRA ABERTURA */
  if (!reducedMotion && !introAlreadySeen && curtain) {
    curtain.classList.add("is-active");

    window.setTimeout(() => {
      curtain.classList.remove("is-active");
      sessionStorage.setItem(storageKey, "true");
      revealPage();
    }, 1850);
  } else {
    /* Todas as páginas internas entram apenas em fade */
    revealPage();
  }

  /* Protege o retorno pelo botão Voltar/Avançar do navegador */
  window.addEventListener("pageshow", () => {
    body.classList.remove("is-leaving");
    body.classList.add("page-is-ready");
  });

  /* Todos os links internos usam APENAS fade-out */
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      const isSpecialLink =
        !href ||
        href === "#" ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        link.target === "_blank" ||
        link.hasAttribute("download");

      const isModifiedClick =
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0;

      if (
        isSpecialLink ||
        isModifiedClick ||
        reducedMotion ||
        isNavigating
      ) {
        return;
      }

      event.preventDefault();
      isNavigating = true;

      /* Aqui não existe cortina: somente o fade-out */
      body.classList.remove("page-is-ready");
      body.classList.add("is-leaving");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 520);
    });
  });
}); 
  /* =========================
     BOTÃO VOLTAR AO TOPO
  ========================= */

 const botaoTopo = document.getElementById("botao-topo");

function atualizarBotaoTopo() {
  if (!botaoTopo) return;

  const deveMostrar = window.scrollY > 420;
  botaoTopo.classList.toggle("visivel", deveMostrar);
}

if (botaoTopo) {
  window.addEventListener("scroll", atualizarBotaoTopo, {
    passive: true,
  });

  atualizarBotaoTopo();

  botaoTopo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}