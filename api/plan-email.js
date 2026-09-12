/* =============================================================
   Vercel serverless function — send "Mein Portfolio-Plan" by e-mail
   (PRD S10, decision on conflict 8). Brevo transactional template
   with the PDF attached; newsletter only with the checkbox and
   double opt-in (PRD 2.4, 10).

   Answers 501 { error: "not_configured" } until these env vars exist:
     BREVO_API_KEY                 (already used by api/subscribe.js)
     BREVO_PLAN_TEMPLATE_ID        transactional template with the attachment
     BREVO_NEWSLETTER_LIST_ID      list for the newsletter
     BREVO_DOI_TEMPLATE_ID         double-opt-in template
     BREVO_DOI_REDIRECT_URL        page after the confirmation click
   The e-mail address goes to Brevo only; it is never logged and
   never returned to analytics (the client tracks plan_email_sent
   without the address).
   ============================================================= */
const MAX_PDF_BYTES = 3 * 1024 * 1024;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

async function brevo(path, key, body) {
  const r = await fetch("https://api.brevo.com/v3/" + path, {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body)
  });
  return { ok: r.ok || r.status === 204, status: r.status };
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "method_not_allowed" }); }

  const key = process.env.BREVO_API_KEY;
  const templateId = parseInt(process.env.BREVO_PLAN_TEMPLATE_ID || "", 10);
  const listId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || "", 10);
  const doiTemplateId = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || "", 10);
  const doiRedirect = process.env.BREVO_DOI_REDIRECT_URL || "";
  if (!key || !templateId) return res.status(501).json({ error: "not_configured" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const email = body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const pdf = body && typeof body.pdfBase64 === "string" ? body.pdfBase64 : "";
  const fileName = body && /^Portemonnaie_Plan_\d{4}-\d{2}-\d{2}\.pdf$/.test(body.fileName || "") ? body.fileName : "Portemonnaie_Plan.pdf";
  const optIn = !!(body && body.newsletterOptIn === true);
  if (!EMAIL.test(email)) return res.status(400).json({ error: "invalid_email" });
  if (!pdf || pdf.length > MAX_PDF_BYTES * 1.4) return res.status(400).json({ error: "invalid_pdf" });

  try {
    const sent = await brevo("smtp/email", key, {
      to: [{ email }],
      templateId,
      attachment: [{ content: pdf, name: fileName }]
    });
    if (!sent.ok) return res.status(502).json({ error: "send_failed" });

    let newsletter = "skipped";
    if (optIn && listId && doiTemplateId && doiRedirect) {
      const doi = await brevo("contacts/doubleOptinConfirmation", key, {
        email, includeListIds: [listId], templateId: doiTemplateId, redirectionUrl: doiRedirect
      });
      newsletter = doi.ok ? "doi_sent" : "doi_failed";
    } else if (optIn) newsletter = "not_configured";

    return res.status(200).json({ ok: true, newsletter });
  } catch (e) {
    return res.status(502).json({ error: "send_failed" });
  }
}
