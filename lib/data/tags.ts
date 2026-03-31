'use server';

import { db } from "@/db";
import { tag } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllTags() {
  return db.select().from(tag).orderBy(tag.name);
}

export async function getTag(id: string) {
  return db.select().from(tag).where(eq(tag.id, id)).then(rows => rows[0]);
}
