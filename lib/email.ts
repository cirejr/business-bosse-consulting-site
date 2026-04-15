import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactFormEmail({
  firstname,
  lastname,
  email,
  company,
  subject,
  message,
}: {
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}) {
  try {
    const recipient: string = process.env.CONTACT_FORM_RECIPIENT || "vixionhq@gmail.com";
    
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: [recipient],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendContactFormEmail:", error);
    throw error;
  }
}