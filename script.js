/* =============================================================
   Portemonnaie. Landing page interactions.
   Clean vanilla JS. No dependencies.
   Minimalist, interactive scroll animations.
   ============================================================= */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ───────────────────── NAV ───────────────────── */
  const nav = $(".nav");
  const navToggle = $(".nav__toggle");
  const mobileMenu = $(".nav__mobile");
  const navLinks = $$(".nav__links a[data-nav]");

  function updateNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
    mobileMenu.classList.toggle("is-open", !expanded);
  });

  $$(".nav__mobile a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
      mobileMenu.classList.remove("is-open");
    });
  });

  const spyTargets = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  function updateSpy() {
    const y = window.scrollY + 140;
    let active = null;
    spyTargets.forEach(({ link, el }) => {
      if (el.offsetTop <= y) active = link;
    });
    navLinks.forEach((l) => l.classList.toggle("is-active", l === active));
  }

  const drifters = $$(".section__header");
  function updateDrift() {
    const vh = window.innerHeight;
    drifters.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const progress = clamp(1 - (rect.top + rect.height / 2) / vh, 0, 1);
      const drift = -progress * 24;
      el.style.setProperty("--drift", `${drift.toFixed(1)}px`);
    });
  }

  const missionSection = $(".mission");
  const missionWords = $$(".mission__word");
  function updateMission() {
    if (!missionSection) return;
    const rect = missionSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.15;
    const progress = clamp((start - rect.top) / (start - end), 0, 1);
    const lit = Math.floor(progress * missionWords.length);
    missionWords.forEach((w, i) => {
      w.classList.toggle("is-lit", i < lit);
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNav();
        updateDrift();
        updateMission();
        updateSpy();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  updateNav();
  updateMission();
  updateSpy();

  const revealEls = $$(".reveal, .reveal-left, .reveal-right, .reveal-scale");

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  $$(".steps, .problem__grid, .platform__pills, .news__grid").forEach(
    (group) => {
      $$(".reveal, .reveal-left, .reveal-right, .reveal-scale", group).forEach(
        (child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
        }
      );
    }
  );

  /* ───────────────────── FORM SUBMISSION (UPDATED) ───────────────────── */

  function handleSignup(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const consentInput = form.querySelector('input[name="consent"]');
    const successMsg = form.querySelector(".form__success");
    const submitBtn = form.querySelector("button[type='submit']");

    emailInput.addEventListener("input", () =>
      emailInput.setCustomValidity("")
    );

    if (consentInput) {
      consentInput.addEventListener("change", () =>
        consentInput.setCustomValidity("")
      );
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!email) return;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailInput.reportValidity();
        return;
      }

      if (consentInput && !consentInput.checked) {
        consentInput.setCustomValidity("Please accept the privacy policy to continue.");
        consentInput.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Saving your place...";

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            consent: !!(consentInput && consentInput.checked),
            consent_timestamp: new Date().toISOString()
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Subscription failed");
        }

        await new Promise((res) => setTimeout(res, 600));

        if (successMsg) successMsg.hidden = false;
        submitBtn.textContent = originalText;

        syncAllForms(email);

        if (typeof gtag !== "undefined") {
          gtag("event", "sign_up", {
            event_category: "engagement",
            event_label: "pre-registration",
          });
        }

      } catch (err) {
        console.error(err);

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function syncAllForms(email) {
    $$("[data-signup]").forEach((form) => {
      if (!form.dataset.completed) {
        form.dataset.completed = "true";

        const input = form.querySelector('input[type="email"]');
        const success = form.querySelector(".form__success");

        if (input) input.value = email;

        $$("input, button", form).forEach((el) => (el.disabled = true));

        if (success) success.hidden = false;
      }
    });
  }

  $$("[data-signup]").forEach(handleSignup);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.getElementById(
        link.getAttribute("href").slice(1)
      );

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({ behavior: "smooth", block: "start" });

      target.setAttribute("tabindex", "-1");

      target.focus({ preventScroll: true });
    });
  });

})();