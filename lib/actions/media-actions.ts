'use server';

import { db } from "@/db";
import { media } from "@/db/schema";
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

export async function getAllMedia() {
  return db.select().from(media).orderBy(media.createdAt);
}

export async function getMedia(id: string) {
  return db.select().from(media).where(eq(media.id, id)).then(rows => rows[0]);
}

export async function createMedia(formData: FormData) {
  await verifyAuth();
  
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const type = formData.get('type') as string;
  const size = formData.get('size') ? parseInt(formData.get('size') as string) : null;

  await db.insert(media).values({
    id: crypto.randomUUID(),
    name,
    url,
    type,
    size,
  });

  revalidatePath('/dashboard/media');
  updateTag('media');
}

export async function createMediaFromUpload(url: string, name: string) {
  await verifyAuth();
  
  await db.insert(media).values({
    id: crypto.randomUUID(),
    name,
    url,
    type: 'image',
  });

  revalidatePath('/dashboard/media');
  updateTag('media');
}

export async function deleteMedia(id: string) {
  await verifyAuth();
  
  await db.delete(media).where(eq(media.id, id));
  revalidatePath('/dashboard/media');
  updateTag('media');
  updateTag(`media-${id}`);
}
