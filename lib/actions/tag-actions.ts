'use server';

import { db } from "@/db";
import { tag } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag as revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function verifyAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createTag(formData: FormData) {
  await verifyAuth();
  
  const name = formData.get('name') as string;
  const slug = generateSlug(name);

  await db.insert(tag).values({
    id: crypto.randomUUID(),
    name,
    slug,
  });

  revalidatePath('/dashboard/tags');
  revalidateTag('tags');
}

export async function updateTag(id: string, formData: FormData) {
  await verifyAuth();
  
  const name = formData.get('name') as string;
  const slug = generateSlug(name);

  await db.update(tag).set({
    name,
    slug,
  }).where(eq(tag.id, id));

  revalidatePath('/dashboard/tags');
  revalidateTag('tags');
  revalidateTag(`tag-${slug}`);
}

export async function deleteTagById(id: string) {
  await verifyAuth();
  
  await db.delete(tag).where(eq(tag.id, id));
  revalidatePath('/dashboard/tags');
  revalidateTag('tags');
}
