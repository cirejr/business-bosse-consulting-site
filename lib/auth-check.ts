'use server';

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function verifySession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return { isAuth: true, user: session.user };
}

export async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
}
