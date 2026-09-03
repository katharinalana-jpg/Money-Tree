export default async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }

  try {

    const { email, consent, consent_timestamp, first_name, language } = req.body;

    // Basic validation
    if (!email || !email.includes("@")) {

      return res.status(400).json({
        error: "Invalid email address"
      });

    }

    if (!consent) {

      return res.status(400).json({
        error: "Consent is required"
      });

    }

    const consentAt = consent_timestamp || new Date().toISOString();

    // Newsletter language: only the three we publish in. Anything else
    // falls back to English rather than rejecting the signup.
    const ALLOWED_LANGUAGES = ["en", "de", "fr"];
    const lang = String(language || "en").toLowerCase().slice(0, 2);
    const preferredLanguage = ALLOWED_LANGUAGES.includes(lang) ? lang.toUpperCase() : "EN";

    // First name is optional. Trim, cap length, strip control characters.
    const firstName = String(first_name || "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 60);

    const attributes = {
      CONSENT: true,
      CONSENT_TIMESTAMP: consentAt,
      LANGUAGE: preferredLanguage
    };

    // Only send FIRSTNAME when given, so a later re-signup without a name
    // does not blank out a name we already have (updateEnabled: true).
    if (firstName) attributes.FIRSTNAME = firstName;

    // Add contact to the DOI pending list (5).
    // A Brevo Automation watches list 5, sends the confirmation email,
    // and moves the contact to list 4 (confirmed) on click.
    const brevoResponse = await fetch(
      "https://api.brevo.com/v3/contacts",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY
        },

        body: JSON.stringify({

          email: email,

          listIds: [5],

          updateEnabled: true,

          attributes: attributes

        })

      }
    );

    const data = await brevoResponse.json().catch(() => ({}));

    if (!brevoResponse.ok) {

      console.error("Brevo Error:", data);

      return res.status(400).json({
        error: "Failed to subscribe"
      });

    }

    // Success
    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Internal server error"
    });

  }

}