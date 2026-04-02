import { db } from "@/db";
import { tag } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";
import { verifySession } from "@/lib/auth-check";

export async function getAllTags() {
  "use cache";
  cacheTag("tags");
  cacheLife("minutes");
  return db.select().from(tag).orderBy(tag.name);
}

export async function getTag(id: string) {
  await verifySession();
  return db
    .select()
    .from(tag)
    .where(eq(tag.id, id))
    .then((rows) => rows[0]);
}
