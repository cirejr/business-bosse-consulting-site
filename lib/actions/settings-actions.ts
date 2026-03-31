'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  await db.update(user).set({ name: name.trim() }).where(eq(user.id, session.user.id));

  revalidatePath("/dashboard/settings");
}

export async function updatePassword(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const h = await headers();
  await auth.api.setUserPassword({
    headers: h,
    body: {
      userId: session.user.id,
      newPassword: newPassword,
    },
  });

  revalidatePath("/dashboard/settings");
}