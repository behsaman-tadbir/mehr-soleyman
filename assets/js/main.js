document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Header dropdown (Desktop)
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
      if (!dropdownParent.contains(event.target)) closeDropdown();
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

  // هدر دسکتاپ: اگر در HTML این IDها را داشته باشی کار می‌کند
  // - authGuest: کانتینر دکمه "ثبت نام/ورود"
  // - authUser: کانتینر دکمه "داشبورد/خروج"
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
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clearSession();
        updateHeaderAuthUI();
        updateBottomAuthUI();
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
      const role = document.getElementById("regRole")?.value; // student|teacher

      if (!username || !password || !phone || !nationalId || !role) {
        if (msg) {
          msg.style.color = "#b45309";
          msg.textContent = "لطفاً همه فیلدها را کامل کنید.";
        }
        return;
      }

      if (!/^\d{10}$/.test(nationalId)) {
        if (msg) {
          msg.style.color = "#b45309";
          msg.textContent = "کد ملی باید دقیقاً ۱۰ رقم باشد.";
        }
        return;
      }

      const users = loadUsers();
      const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        if (msg) {
          msg.style.color = "#b45309";
          msg.innerHTML = 'این نام کاربری قبلاً ثبت شده است. لطفاً <a href="login.html">وارد شوید</a>.';
        }
        return;
      }

      const newUser = { username, password, phone, nationalId, role, createdAt: Date.now() };
      users.push(newUser);
      saveUsers(users);
      setSession(newUser);

      if (msg) {
        msg.style.color = "#166534";
        msg.textContent = "ثبت‌نام موفق بود. انتقال به داشبورد...";
      }

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
        u.username.toLowerCase() === (username || "").toLowerCase() &&
        u.password === password
      );

      if (!user) {
        if (msg) {
          msg.style.color = "#b45309";
          msg.innerHTML = 'حسابی با این اطلاعات پیدا نشد. لطفاً <a href="register.html">ثبت‌نام</a> کنید.';
        }
        return;
      }

      setSession(user);

      if (msg) {
        msg.style.color = "#166534";
        msg.textContent = "ورود موفق. انتقال به داشبورد...";
      }

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

  // =========================
  // Mobile Bottom Sheet: Categories (IDs استاندارد)
  // =========================
  const bnCats = document.getElementById("bnCats");
  const catsSheet = document.getElementById("catsSheet");
  const catsBackdrop = document.getElementById("catsBackdrop");
  const catsClose = document.getElementById("catsClose");

  const openCats = () => {
    if (!catsSheet) return;
    catsSheet.classList.add("is-open");
    catsSheet.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const closeCats = () => {
    if (!catsSheet) return;
    catsSheet.classList.remove("is-open");
    catsSheet.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  bnCats?.addEventListener("click", openCats);
  catsBackdrop?.addEventListener("click", closeCats);
  catsClose?.addEventListener("click", closeCats);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCats();
  });

  // =========================
  // Bottom Nav Active Item
  // =========================
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const navMap = [
    { key: "home", files: ["index.html"] },
    { key: "contact", files: ["contact.html"] },
    { key: "account", files: ["login.html", "register.html", "dashboard.html"] },
  ];

  const activeKey = navMap.find(x => x.files.includes(path))?.key || "home";

  document.querySelectorAll(".bottom-nav .bn-item").forEach((el) => {
    if (el.getAttribute("data-nav") === activeKey) el.classList.add("is-active");
  });

  // =========================
  // Bottom Nav Auth Switch (ورود ↔ داشبورد)
  // =========================
  function updateBottomAuthUI() {
    const bnAccount = document.getElementById("bnAccount");
    const bnAccountText = document.getElementById("bnAccountText");
    if (!bnAccount || !bnAccountText) return;

    const session = getSession();
    if (session && session.username) {
      bnAccount.href = "dashboard.html";
      bnAccountText.textContent = "داشبورد";
      bnAccount.setAttribute("aria-label", "داشبورد");
    } else {
      bnAccount.href = "login.html";
      bnAccountText.textContent = "ورود";
      bnAccount.setAttribute("aria-label", "ورود");
    }
  }

  // =========================
  // Home Post Slider (every 3s)
  // =========================
  const slides = Array.from(document.querySelectorAll(".post-slide"));
  const dotsWrap = document.getElementById("sliderDots");

  if (slides.length && dotsWrap) {
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

    const slider = document.querySelector(".post-slider");
    if (slider) {
      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      slider.addEventListener("focusin", stop);
      slider.addEventListener("focusout", start);
    }

    render();
    start();
  }

  // init
  updateHeaderAuthUI();
  updateBottomAuthUI();
  wireRegisterForm();
  wireLoginForm();
  protectDashboard();
});
