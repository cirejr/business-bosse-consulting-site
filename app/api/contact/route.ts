import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";
import { z } from "zod";

// Validation schema for contact form
const contactFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { firstname, lastname, email, company, country, subject, message } = validationResult.data;
    
    // Send email
    await sendContactFormEmail({
      firstname,
      lastname,
      email,
      company: company || "",
      country: country || "",
      subject,
      message,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again later." },
      { status: 500 }
    );
  }
}