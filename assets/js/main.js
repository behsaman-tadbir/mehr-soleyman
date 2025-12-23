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
  // Auth Demo (localStorage) - Static MVP
  // =========================
  const STORAGE_USERS = "ms_users";
  const STORAGE_SESSION = "ms_session";

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; }
    catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }
  function setSession(user) {
    localStorage.setItem(STORAGE_SESSION, JSON.stringify({
      username: user.username,
      role: user.role
    }));
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SESSION)); }
    catch { return null; }
  }
  function clearSession() {
    localStorage.removeItem(STORAGE_SESSION);
  }

  function updateHeaderAuthUI() {
    const guest = document.getElementById("authGuest");
    const user = document.getElementById("authUser");
    if (!guest || !user) return;

    const session = getSession();
    if (session && session.username) {
      guest.style.display = "none";
      user.style.display = "flex";
    } else {
      guest.style.display = "flex";
      user.style.display = "none";
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        clearSession();
        updateHeaderAuthUI();
        // اگر در داشبورد بودی، برگرد خانه
        if (location.pathname.endsWith("dashboard.html")) {
          location.href = "index.html";
        }
      });
    }
  }

  function wireRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const msg = document.getElementById("registerMsg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("regUsername")?.value.trim();
      const password = document.getElementById("regPassword")?.value.trim();
      const phone = document.getElementById("regPhone")?.value.trim();
      const nationalId = document.getElementById("regNationalId")?.value.trim();
      const role = document.getElementById("regRole")?.value;

      if (!username || !password || !phone || !nationalId || !role) {
        if (msg) msg.textContent = "لطفاً همه فیلدها را کامل کنید.";
        return;
      }

      if (!/^\d{10}$/.test(nationalId)) {
        if (msg) msg.textContent = "کد ملی باید دقیقاً ۱۰ رقم باشد.";
        return;
      }

      const users = loadUsers();
      const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        if (msg) msg.innerHTML = 'این نام کاربری قبلاً ثبت شده است. لطفاً <a href="login.html">وارد شوید</a>.';
        return;
      }

      const newUser = { username, password, phone, nationalId, role, createdAt: Date.now() };
      users.push(newUser);
      saveUsers(users);
      setSession(newUser);

      if (msg) msg.style.color = "#166534";
      if (msg) msg.textContent = "ثبت‌نام موفق بود. انتقال به داشبورد...";

      setTimeout(() => {
        location.href = "dashboard.html";
      }, 600);
    });
  }

  function wireLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const msg = document.getElementById("loginMsg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername")?.value.trim();
      const password = document.getElementById("loginPassword")?.value.trim();

      const users = loadUsers();
      const user = users.find(u =>
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!user) {
        if (msg) msg.style.color = "#b45309";
        if (msg) msg.innerHTML = 'حسابی با این اطلاعات پیدا نشد. لطفاً <a href="register.html">ثبت‌نام</a> کنید.';
        return;
      }

      setSession(user);

      if (msg) msg.style.color = "#166534";
      if (msg) msg.textContent = "ورود موفق. انتقال به داشبورد...";

      setTimeout(() => {
        location.href = "dashboard.html";
      }, 500);
    });
  }

  function protectDashboard() {
    if (!location.pathname.endsWith("dashboard.html")) return;
    const session = getSession();
    if (!session || !session.username) {
      location.href = "login.html";
    }
  }

  updateHeaderAuthUI();
  wireRegisterForm();
  wireLoginForm();
  protectDashboard();

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
