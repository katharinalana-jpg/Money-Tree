export default async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }

  try {

    const { email } = req.body;

    // Basic validation
    if (!email || !email.includes("@")) {

      return res.status(400).json({
        error: "Invalid email address"
      });

    }

    // Send email to Brevo
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

          listIds: [4],

          updateEnabled: true

        })

      }
    );

    const data = await brevoResponse.json();

    // Handle Brevo API errors
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