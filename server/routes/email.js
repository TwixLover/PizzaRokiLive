import Brevo from "@getbrevo/brevo";

const api = new Brevo.TransactionalEmailsApi();

api.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function sendEmail({
  to,
  name,
  subject,
  html,
}) {
  try {
    await api.sendTransacEmail({
      sender: {
        name: "Pizza Roki",
        email: "trashcanforzs@gmail.com",
      },

      to: [
        {
          email: to,
          name,
        },
      ],

      subject,

      htmlContent: html,
    });

    console.log("Email sent");
  } catch (err) {
    console.error(err);
    throw err;
  }
}