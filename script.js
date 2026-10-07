/* =============================================================
   Portemonnaie – Seiteninteraktionen
   Vanilla JS, keine Abhängigkeiten. Läuft nach i18n.js am Ende von <body>.

   Newsletter-Formulare: alle <form data-signup> senden an /api/subscribe
   (Vercel-Funktion, Brevo). Felder: email (Pflicht), consent (Pflicht),
   first_name und language (optional).
   ============================================================= */

(function () {
  "use strict";

  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const t = (key) => (window.PM_I18N ? window.PM_I18N.t(key) : null) || key;

  function handleSignup(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const nameInput = form.querySelector('input[name="first_name"]');
    const consentInput = form.querySelector('input[name="consent"]');
    const langInputs = $$('input[name="language"]', form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = form.querySelector(".form__success");
    const errorMsg = form.querySelector(".form__error");
    if (!emailInput || !submitBtn) return;

    // Newsletter-Sprache vorbelegen: Seitensprache, sonst erste Option
    function presetLanguage() {
      if (!langInputs.length || langInputs.some((r) => r.checked)) return;
      const siteLang = (document.documentElement.lang || "en").slice(0, 2);
      (langInputs.find((r) => r.value === siteLang) || langInputs[0]).checked = true;
    }
    presetLanguage();
    document.addEventListener("pm:langchange", () => {
      if (form.dataset.completed) return;
      langInputs.forEach((r) => { r.checked = false; });
      presetLanguage();
    });

    emailInput.addEventListener("input", () => emailInput.setCustomValidity(""));
    if (consentInput) consentInput.addEventListener("change", () => consentInput.setCustomValidity(""));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.dataset.completed) return;

      const email = emailInput.value.trim();
      const firstName = nameInput ? nameInput.value.trim() : "";
      const langChoice = langInputs.find((r) => r.checked);
      const language = langChoice ? langChoice.value : (document.documentElement.lang || "en").slice(0, 2);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.setCustomValidity(t("form.invalid_email"));
        emailInput.reportValidity();
        return;
      }
      if (consentInput && !consentInput.checked) {
        consentInput.setCustomValidity(t("form.consent_required"));
        consentInput.reportValidity();
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = t("form.submitting");
      if (errorMsg) errorMsg.hidden = true;

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_name: firstName,
            language,
            consent: !!(consentInput && consentInput.checked),
            consent_timestamp: new Date().toISOString()
          })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Subscription failed");

        submitBtn.textContent = originalText;
        completeAllForms(email, firstName, language);
      } catch (err) {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        if (errorMsg) errorMsg.hidden = false;
      }
    });
  }

  // Nach erfolgreicher Anmeldung alle Formulare der Seite als erledigt markieren
  function completeAllForms(email, firstName, language) {
    $$("[data-signup]").forEach((form) => {
      if (form.dataset.completed) return;
      form.dataset.completed = "true";
      const emailEl = form.querySelector('input[type="email"]');
      const nameEl = form.querySelector('input[name="first_name"]');
      const success = form.querySelector(".form__success");
      if (emailEl) emailEl.value = email;
      if (nameEl && firstName) nameEl.value = firstName;
      $$('input[name="language"]', form).forEach((r) => { r.checked = r.value === language; });
      $$("input, button", form).forEach((el) => { el.disabled = true; });
      if (success) success.hidden = false;
    });
  }

  $$("[data-signup]").forEach(handleSignup);
})();
