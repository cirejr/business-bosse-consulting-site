# Implementation Plan: Setup Email Service for Contact Form

## Technical Approach
Implement a functional contact form by creating a Next.js API route that handles form submissions and sends emails using Resend email service.

## Affected Files/Modules
- `app/api/contact/route.ts` - New API route for handling contact form submissions
- `components/ContactFormSection.tsx` - Updated form to submit to API endpoint with client-side validation and loading states
- `lib/email.ts` - New utility function for sending emails via Resend
- `.env.local` - Add Resend API key environment variable

## Verification Commands
- `bun run dev` - Start development server to test form submission
- Manual testing: Submit contact form and verify email delivery
- `bun run build` - Ensure no TypeScript compilation errors

## Implementation Steps Completed
1. ✅ Installed Resend email service package: `bun add resend`
2. ✅ Created email utility function in `lib/email.ts`
3. ✅ Created API route in `app/api/contact/route.ts` to handle POST requests
4. ✅ Updated ContactFormSection to submit form data to the API endpoint with proper validation and UI feedback
5. ⏳ Add Resend API key and recipient email to `.env.local` file
6. ⏳ Test contact form submission and email delivery

## Configuration Details
- Email Service: Resend
- Recipient Email: commercial@bbcons.net
- Environment Variables Needed:
  - `RESEND_API_KEY` - API key from Resend service
  - `CONTACT_FORM_RECIPIENT` - Set to "commercial@bbcons.net"

## Security Considerations Implemented
- Input validation using Zod on server side
- Basic client-side validation for required fields
- Sanitization of email content to prevent injection
- Use of environment variables for sensitive credentials
- Rate limiting consideration (handled by Vercel by default for API routes)