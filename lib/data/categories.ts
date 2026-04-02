import { db } from "@/db";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";
import { verifySession } from "@/lib/auth-check";

export async function getAllCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife("minutes");
  return db.select().from(category).orderBy(category.name);
}

export async function getCategory(id: string) {
  await verifySession();
  return db
    .select()
    .from(category)
    .where(eq(category.id, id))
    .then((rows) => rows[0]);
}
