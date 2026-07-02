export async function sendEmail({
  to,
  name,
  subject,
  html,
}) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: "Pizza Roki",
        email: process.env.BREVO_SENDER,
      },

      to: [
        {
          email: to,
          name: name,
        },
      ],

      subject: subject,

      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("BREVO ERROR:");
    console.error(errorText);

    throw new Error(errorText);
  }

  const data = await response.json();

  console.log("Email sent:", data);

  return data;
}