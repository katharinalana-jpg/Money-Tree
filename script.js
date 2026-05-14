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

  /* Scroll spy */
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

  /* ───────────────────── SCROLL DRIFT ───────────────────── */
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

  /* ───────────────────── MISSION WORD ANIMATION ───────────────────── */
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

  /* ───────────────────── PLATFORM PILL SPOTLIGHT ───────────────────── */
  const pills = $$(".platform__pills li");
  if ("IntersectionObserver" in window && pills.length) {
    const pillObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.target.classList.toggle("is-visible", e.isIntersecting),
        );
      },
      { threshold: 0.35 },
    );
    pills.forEach((p) => pillObs.observe(p));
  }

  /* ───────────────────── SCROLL LOOP ───────────────────── */
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

  /* ───────────────────── REVEAL ON SCROLL ───────────────────── */
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
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Staggered delays for grouped items */
  $$(".steps, .problem__grid, .platform__pills, .news__grid").forEach(
    (group) => {
      $$(".reveal, .reveal-left, .reveal-right, .reveal-scale", group).forEach(
        (child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
        },
      );
    },
  );

  /* ───────────────────── FORM SUBMISSION ─────────────────────
     Replace the simulated fetch with a real backend:
     A) Formspree: POST https://formspree.io/f/<FORM_ID>
     B) Mailchimp: embed action URL
     C) Brevo / ConvertKit: POST { email } with API key
     D) Supabase: supabase.from('waitlist').insert([{ email }])
  */
  function handleSignup(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const successMsg = form.querySelector(".form__success");
    const submitBtn = form.querySelector("button[type='submit']");

    emailInput.addEventListener("input", () =>
      emailInput.setCustomValidity(""),
    );

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailInput.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Saving your place...";

      try {
        // Send email to Zapier webhook
        await fetch("https://hooks.zapier.com/hooks/catch/27599229/4yxsep6/", {
          method: "POST",
          body: JSON.stringify({ email: email })
        });

        await new Promise((res) => setTimeout(res, 900));
        if (successMsg) successMsg.hidden = false;
        syncAllForms(email);
        if (typeof gtag !== "undefined") {
          gtag("event", "sign_up", {
            event_category: "engagement",
            event_label: "pre-registration",
          });
        }
      } catch (err) {
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

  /* ───────────────────── FOOTER YEAR ───────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ───────────────────── SMOOTH ANCHOR SCROLL ───────────────────── */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.getElementById(
        link.getAttribute("href").slice(1),
      );
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ───────────────────── INTERACTIVE HOVER TILT ───────────────────── */
  $$(".step:not(.step--interactive), .problem__card, .news__card").forEach(
    (card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    },
  );

  /* ───────────────────── BASKET DRAG AND DROP ───────────────────── */
  const basketDrop = $("[data-drop]");
  if (basketDrop) {
    const chips = $$(".basket-demo__chip");
    chips.forEach((chip) => {
      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", chip.dataset.type);
        chip.classList.add("is-dragging");
      });
      chip.addEventListener("dragend", () => {
        chip.classList.remove("is-dragging");
      });
    });
    basketDrop.addEventListener("dragover", (e) => {
      e.preventDefault();
      basketDrop.classList.add("is-over");
    });
    basketDrop.addEventListener("dragleave", () => {
      basketDrop.classList.remove("is-over");
    });
    basketDrop.addEventListener("drop", (e) => {
      e.preventDefault();
      basketDrop.classList.remove("is-over");
      const type = e.dataTransfer.getData("text/plain");
      const chip = $$(`.basket-demo__chip[data-type="${type}"]`)[0];
      if (chip && !basketDrop.querySelector(`[data-dropped="${type}"]`)) {
        const tag = document.createElement("span");
        tag.className = "basket-dropped";
        tag.setAttribute("data-dropped", type);
        tag.textContent = chip.textContent;
        const placeholder = basketDrop.querySelector(
          "span:not(.basket-dropped)",
        );
        const icon = basketDrop.querySelector("svg");
        if (placeholder) placeholder.style.display = "none";
        if (icon) icon.style.display = "none";
        basketDrop.appendChild(tag);
        chip.style.opacity = "0.3";
        chip.setAttribute("draggable", "false");
      }
    });
  }

  /* ───────────────────── COLLABS TABS ───────────────────── */
  const tabBtns = $$(".collabs-tabs__btn");
  const tabPanels = $$(".collabs-tabs__panel");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      tabPanels.forEach((p) =>
        p.classList.toggle("is-active", p.id === "tab-" + target),
      );
    });
  });
})();
