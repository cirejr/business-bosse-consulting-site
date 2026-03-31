'use server';

import { db } from "@/db";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
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

export async function createCategory(formData: FormData) {
  await verifyAuth();
  
  const name = formData.get('name') as string;
  const slug = generateSlug(name);

  await db.insert(category).values({
    id: crypto.randomUUID(),
    name,
    slug,
  });

  revalidatePath('/dashboard/categories');
  updateTag('categories');
}

export async function updateCategory(id: string, formData: FormData) {
  await verifyAuth();
  
  const name = formData.get('name') as string;
  const slug = generateSlug(name);

  await db.update(category).set({
    name,
    slug,
  }).where(eq(category.id, id));

  revalidatePath('/dashboard/categories');
  updateTag('categories');
  updateTag(`category-${slug}`);
}

export async function deleteCategory(id: string) {
  await verifyAuth();
  
  await db.delete(category).where(eq(category.id, id));
  revalidatePath('/dashboard/categories');
  updateTag('categories');
}

export async function deleteCategoryById(id: string) {
  await verifyAuth();
  
  await db.delete(category).where(eq(category.id, id));
  revalidatePath('/dashboard/categories');
  updateTag('categories');
}
