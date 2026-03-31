import { config } from 'dotenv';
config({ path: './dist/.env' });

import { db } from './dist/db/index.js';
import { article, category, tag, media, articleCategories, articleTags, user } from './dist/db/schema.js';
import { parseWpDump } from './dist/lib/migration/wp-parser.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function runMigration() {
  console.log("🚀 Starting WordPress to Next.js Migration...");

  const dumpPath = "./docs/bbcons-wp-db-dump.sql";
  const { terms, posts, meta, termRelationships } = await parseWpDump(dumpPath);

  // 1. Get the admin user to assign as author
  const adminUsers = await db.select().from(user).limit(1);
  if (adminUsers.length === 0) {
    console.error("❌ No admin user found in database. Please run the seed script first.");
    return;
  }
  const authorId = adminUsers[0].id;

  // 2. Import Categories
  console.log("📂 Importing Categories...");
  const wpCategories = Array.from(terms.values()).filter(t => t.taxonomy === "category");
  for (const c of wpCategories) {
    await db.insert(category).values({
      id: randomUUID(),
      name: c.name,
      slug: c.slug || c.name.toLowerCase().replace(/ /g, "-"),
      wpId: c.term_id,
    }).onConflictDoNothing();
  }

  // 3. Import Tags
  console.log("🏷️ Importing Tags...");
  const wpTags = Array.from(terms.values()).filter(t => t.taxonomy === "post_tag");
  for (const t of wpTags) {
    await db.insert(tag).values({
      id: randomUUID(),
      name: t.name,
      slug: t.slug || t.name.toLowerCase().replace(/ /g, "-"),
      wpId: t.term_id,
    }).onConflictDoNothing();
  }

  // 4. Import Media (Attachments)
  console.log("🖼️ Importing Media...");
  const wpAttachments = posts.filter(p => p.type === "attachment");
  for (const m of wpAttachments) {
    // Get the actual file path from _wp_attached_file meta
    const attachedFile = meta.get(m.id)?.get("_wp_attached_file");
    
    // Fallback to title if _wp_attached_file not found (shouldn't happen in valid WP)
    const filePath = attachedFile || `${m.date.split(' ')[0].split('-')[0]}/${m.date.split(' ')[0].split('-')[1]}/${m.title}`;
    
    // Convert to /uploads/ URL
    // e.g. 2023/10/photo.jpg -> /uploads/2023/10/photo.jpg
    const url = `/uploads/${filePath}`;

    await db.insert(media).values({
      id: randomUUID(),
      name: m.title,
      url: url,
      type: m.mime_type,
      wpId: m.id,
    }).onConflictDoNothing();
  }

  // 5. Import Articles (Posts)
  console.log("📝 Importing Articles...");
  const wpPosts = posts.filter(p => p.type === "post" && p.status === "publish");
  for (const p of wpPosts) {
    const cleanedContent = p.content
      .replace(/<!-- wp:.*? -->/g, "")
      .replace(/<!-- \/wp:.*? -->/g, "");

    const newArticleId = randomUUID();
    
    // Find featured image URL from meta
    const thumbnailId = meta.get(p.id)?.get("_thumbnail_id");
    let coverUrl = null;
    if (thumbnailId) {
      const mediaItem = await db.select().from(media).where(eq(media.wpId, parseInt(thumbnailId))).limit(1);
      if (mediaItem.length > 0) {
        coverUrl = mediaItem[0].url;
      }
    }

    try {
      await db.insert(article).values({
        id: newArticleId,
        title: p.title,
        slug: p.slug || p.title.toLowerCase().replace(/ /g, "-"),
        content: cleanedContent,
        excerpt: p.excerpt,
        status: "published",
        authorId: authorId,
        coverImageUrl: coverUrl,
        wpId: p.id,
        publishedAt: new Date(p.date),
      }).onConflictDoNothing();

      // 6. Link Categories and Tags
      const relatedTermTaxIds = termRelationships.get(p.id) || [];
      for (const termTaxId of relatedTermTaxIds) {
        // Get term_id from wp_term_taxonomy using term_taxonomy_id
        const termTaxonomyMeta = meta.get(termTaxId);
        const termId = termTaxonomyMeta ? parseInt(termTaxonomyMeta.get("term_id") || "") : null;
        
        if (termId) {
          // Look up category by term_id (which is stored as wpId in category table)
          const cat = await db.select().from(category).where(eq(category.wpId, termId)).limit(1);
          if (cat.length > 0) {
            await db.insert(articleCategories).values({
              articleId: newArticleId,
              categoryId: cat[0].id,
            }).onConflictDoNothing();
          }

          // Look up tag by term_id (which is stored as wpId in tag table)
          const t = await db.select().from(tag).where(eq(tag.wpId, termId)).limit(1);
          if (t.length > 0) {
            await db.insert(articleTags).values({
              articleId: newArticleId,
              tagId: t[0].id,
            }).onConflictDoNothing();
          }
        }
      }
    } catch (err) {
      console.error(`Skipping article ${p.id} due to error (likely exists): ${err}`);
    }
  }

  console.log("✅ Migration Completed Successfully!");
}

runMigration().catch(console.error);