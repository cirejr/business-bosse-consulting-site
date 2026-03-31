'use server';

import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";

export async function getAllMedia() {
  'use cache';
  cacheTag('media');
  cacheLife('minutes');
  return db.select().from(media).orderBy(media.createdAt);
}

export async function getMedia(id: string) {
  'use cache';
  cacheTag(`media-${id}`);
  cacheLife('minutes');
  return db.select().from(media).where(eq(media.id, id)).then(rows => rows[0]);
}
