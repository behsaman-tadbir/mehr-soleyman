document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Header dropdown (desktop)
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
  const STORAGE_USERS = "bs_users";
  const STORAGE_SESSION = "bs_session";
  const STORAGE_CART = "bs_cart";

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  function setSession(user) {
    localStorage.setItem(
      STORAGE_SESSION,
      JSON.stringify({
        username: user.username,
        role: user.role,
      })
    );
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SESSION));
    } catch {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_SESSION);
  }

  function redirectByRole(role) {
    if (role === "admin") {
      location.href = "dashboard-admin.html";
      return;
    }
    if (role === "teacher") {
      location.href = "dashboard-teacher.html";
      return;
    }
    location.href = "dashboard.html";
  }

  function updateHeaderAuthUI() {
    // اینها اگر در HTML داشته باشی کار می‌کنند (مثل نسخه قبلی):
    // <div id="authGuest">...</div>
    // <div id="authUser">...</div>
    const guest = document.getElementById("authGuest");
    const user = document.getElementById("authUser");
    const session = getSession();

    if (guest && user) {
      if (session && session.username) {
        guest.style.display = "none";
        user.style.display = "flex";
      } else {
        guest.style.display = "flex";
        user.style.display = "none";
      }
    }

    // اگر دکمه خروج در داشبوردها وجود دارد:
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && !logoutBtn.__wired) {
      logoutBtn.__wired = true;
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clearSession();
        updateHeaderAuthUI();
        // برگرد به خانه
        location.href = "index.html";
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
      const role = document.getElementById("regRole")?.value; // فقط student / teacher

      if (!username || !password || !phone || !nationalId || !role) {
        if (msg) msg.textContent = "لطفاً همه فیلدها را کامل کنید.";
        return;
      }

      if (!/^\d{10}$/.test(nationalId)) {
        if (msg) msg.textContent = "کد ملی باید دقیقاً ۱۰ رقم باشد.";
        return;
      }

      if (!/^\d{11}$/.test(phone)) {
        if (msg) msg.textContent = "شماره همراه باید دقیقاً ۱۱ رقم باشد.";
        return;
      }

      // جلوگیری از ساخت ادمین با ثبت‌نام
      if (role === "admin") {
        if (msg) msg.textContent = "ثبت‌نام مدیر سیستم مجاز نیست.";
        return;
      }

      const users = loadUsers();
      const exists = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      if (exists) {
        if (msg)
          msg.innerHTML =
            'این نام کاربری قبلاً ثبت شده است. لطفاً <a href="login.html">وارد شوید</a>.';
        return;
      }

      const newUser = {
        username,
        password,
        phone,
        nationalId,
        role, // student | teacher
        createdAt: Date.now(),
      };

      users.push(newUser);
      saveUsers(users);
      setSession(newUser);

      if (msg) msg.style.color = "#166534";
      if (msg) msg.textContent = "ثبت‌نام موفق بود. انتقال...";

      setTimeout(() => {
        redirectByRole(newUser.role);
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

      if (!username || !password) {
        if (msg) msg.textContent = "نام کاربری و رمز عبور را وارد کنید.";
        return;
      }

      // Admin demo login (no register)
      if (username.toLowerCase() === "admin" && password === "110110") {
        setSession({ username: "admin", role: "admin" });
        if (msg) {
          msg.style.color = "#166534";
          msg.textContent = "ورود مدیر سیستم موفق. انتقال...";
        }
        setTimeout(() => {
          location.href = "dashboard-admin.html";
        }, 400);
        return;
      }

      const users = loadUsers();
      const user = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        if (msg) msg.style.color = "#b45309";
        if (msg)
          msg.innerHTML =
            'حسابی با این اطلاعات پیدا نشد. لطفاً <a href="register.html">ثبت‌نام</a> کنید.';
        return;
      }

      setSession(user);

      if (msg) msg.style.color = "#166534";
      if (msg) msg.textContent = "ورود موفق. انتقال...";

      setTimeout(() => {
        redirectByRole(user.role);
      }, 500);
    });
  }

  function protectDashboard() {
    const file = (location.pathname.split("/").pop() || "").toLowerCase();
    const session = getSession();

    const protectedPages = [
      "dashboard.html",
      "dashboard-teacher.html",
      "dashboard-admin.html",
    ];
    if (!protectedPages.includes(file)) return;

    if (!session || !session.username) {
      location.href = "login.html";
      return;
    }

    // role guards
    if (file === "dashboard-admin.html" && session.role !== "admin") {
      location.href = "dashboard.html";
      return;
    }

    if (file === "dashboard-teacher.html" && session.role !== "teacher") {
      location.href = "dashboard.html";
      return;
    }

    // if user is on dashboard.html but role is not student
    if (file === "dashboard.html" && session.role === "admin") {
      location.href = "dashboard-admin.html";
      return;
    }
    if (file === "dashboard.html" && session.role === "teacher") {
      location.href = "dashboard-teacher.html";
      return;
    }
  }

  updateHeaderAuthUI();
  wireRegisterForm();
  wireLoginForm();
  protectDashboard();

  // =========================
  // Mobile Bottom Nav + Sheet
  // =========================
  const catsBtn = document.getElementById("bnCatsBtn");
  const catsSheet = document.getElementById("mobileCatsSheet");
  const authLink = document.getElementById("bnAuthLink");
  const authText = document.getElementById("bnAuthText");
  const cartBadge = document.getElementById("bnCartBadge");

  const openSheet = () => {
    if (!catsSheet || !catsBtn) return;
    catsSheet.classList.add("is-open");
    catsSheet.setAttribute("aria-hidden", "false");
    catsBtn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
  };

  const closeSheet = () => {
    if (!catsSheet || !catsBtn) return;
    catsSheet.classList.remove("is-open");
    catsSheet.setAttribute("aria-hidden", "true");
    catsBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  };

  if (catsBtn && catsSheet) {
    catsBtn.addEventListener("click", () => {
      const isOpen = catsSheet.classList.contains("is-open");
      isOpen ? closeSheet() : openSheet();
    });

    catsSheet.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.matches("[data-sheet-close]")) closeSheet();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSheet();
    });
  }

  // Auth text/href in bottom nav
  if (authLink && authText) {
    const session = getSession();
    const loggedIn = !!(session && session.username);

    if (loggedIn) {
      authText.textContent = "داشبورد";
      authLink.setAttribute("aria-label", "داشبورد");

      // لینک را براساس نقش تنظیم کن
      if (session.role === "admin") authLink.href = "dashboard-admin.html";
      else if (session.role === "teacher") authLink.href = "dashboard-teacher.html";
      else authLink.href = "dashboard.html";
    } else {
      authText.textContent = "ورود";
      authLink.href = "login.html";
      authLink.setAttribute("aria-label", "ورود");
    }
  }

  // Cart badge (Demo)
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_CART) || "[]");
    const count = Array.isArray(cart) ? cart.length : 0;
    if (cartBadge) {
      if (count > 0) {
        cartBadge.hidden = false;
        cartBadge.textContent = String(count);
      } else {
        cartBadge.hidden = true;
      }
    }
  } catch {
    if (cartBadge) cartBadge.hidden = true;
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
  let idx = slides.findIndex((s) => s.classList.contains("is-active"));
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
});
