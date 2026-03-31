'use server';

import { db } from "@/db";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllCategories() {
  return db.select().from(category).orderBy(category.name);
}

export async function getCategory(id: string) {
  return db.select().from(category).where(eq(category.id, id)).then(rows => rows[0]);
}
