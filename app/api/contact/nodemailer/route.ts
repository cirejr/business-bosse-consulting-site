import nodemailer from "nodemailer";
import { z } from "zod";

const contactFormSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  company: z.string().optional(),
  country: z.string().min(1, "Le pays est requis"),
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(1, "Le message est requis"),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate form data
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: "Formulaire invalide",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { firstname, lastname, email, company, country, subject, message } =
      result.data;

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from: `"Formulaire de contact bbcons.net" <${process.env.SMTP_USER}>`,

      to: process.env.CONTACT_RECEIVER_EMAIL,

      replyTo: email,

      subject: `[Contact bbcons.net] ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p style="font-size: 12px; color: #888; border-bottom: 1px solid #ddd; padding-bottom: 8px;">
            Ce message a été envoyé depuis le formulaire de contact du site <strong>bbcons.net</strong>.
          </p>

          <h2>Nouveau message de contact</h2>

          <hr />

          <p>
            <strong>Prénom :</strong> ${escapeHtml(firstname)}
          </p>

          <p>
            <strong>Nom :</strong> ${escapeHtml(lastname)}
          </p>

          <p>
            <strong>Email :</strong> ${escapeHtml(email)}
          </p>

          <p>
            <strong>Société :</strong> ${company ? escapeHtml(company) : "Non renseigné"}
          </p>

          <p>
            <strong>Pays :</strong> ${escapeHtml(country)}
          </p>

          <p>
            <strong>Sujet :</strong> ${escapeHtml(subject)}
          </p>

          <hr />

          <h3>Message</h3>

          <p>
            ${safeMessage}
          </p>
        </div>
      `,
    });

    return Response.json({
      success: true,
      message: "Message envoyé avec succès",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return Response.json(
      {
        success: false,
        error: "Échec de l'envoi du message. Veuillez réessayer.",
      },
      {
        status: 500,
      },
    );
  }
}
