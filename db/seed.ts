import { auth } from "@/lib/auth";
import { db } from "./index";
import { user, account } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  const adminEmail = "admin@bbcons.net";
  const password = "admin_password_change_me";

  // Delete existing user first
  try {
    await db.delete(account).where(eq(account.accountId, adminEmail));
    await db.delete(user).where(eq(user.email, adminEmail));
    console.log("Cleaned up existing user");
  } catch (e) {
    console.log("No existing user to clean up");
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: password,
        name: "Admin B&BC",
      },
    });

    console.log("✅ Seed completed! Admin user created.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${password}`);
  } catch (error: any) {
    console.log("Error:", error.message || error);
  }
}

seed().catch(console.error);
