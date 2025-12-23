document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Header dropdown
  // =========================
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
  const dropdownParent = dropdownToggle?.closest(".has-dropdown");

  const closeDropdown = () => {
    if (!dropdownParent) return;
    dropdownParent.classList.remove("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  };

  if (dropdownToggle && dropdownParent) {
    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const nowOpen = dropdownParent.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", nowOpen ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      if (!dropdownParent.contains(event.target)) {
        closeDropdown();
      }
    });

    dropdownToggle.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
        dropdownToggle.focus();
      }
    });
  }

  // =========================
  // Home Post Slider (every 3s)
  // =========================
  const slides = Array.from(document.querySelectorAll(".post-slide"));
  const dotsWrap = document.getElementById("sliderDots");

  if (!slides.length || !dotsWrap) return;

  // build dots
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot";
    d.type = "button";
    d.setAttribute("aria-label", `اسلاید ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
  let idx = slides.findIndex(s => s.classList.contains("is-active"));
  if (idx < 0) idx = 0;

  function render() {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }

  function goTo(i) {
    idx = i % slides.length;
    render();
    restart();
  }

  let timer = null;
  function start() {
    timer = setInterval(() => {
      idx = (idx + 1) % slides.length;
      render();
    }, 3000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    start();
  }

  // pause on hover (desktop)
  const slider = document.querySelector(".post-slider");
  if (slider) {
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);
  }

  render();
  start();
});
