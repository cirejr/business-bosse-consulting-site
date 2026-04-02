import { db } from "@/db";
import {
  article,
  articleCategories,
  articleTags,
  category,
  tag,
} from "@/db/schema";
import { eq, desc, like, or, and, sql } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";
import { verifySession } from "@/lib/auth-check";

export async function getArticles(options?: {
  search?: string;
  status?: string;
}) {
  "use cache";
  cacheTag(`articles-${options?.status || "all"}`);
  cacheLife("minutes");

  const conditions = [];

  if (options?.search) {
    conditions.push(
      or(
        like(article.title, `%${options.search}%`),
        like(article.excerpt, `%${options.search}%`),
      ),
    );
  }

  if (
    options?.status &&
    (options.status === "published" || options.status === "draft")
  ) {
    conditions.push(eq(article.status, options.status));
  }

  return db
    .select()
    .from(article)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(article.createdAt));
}

export async function getArticle(id: string) {
  await verifySession();
  return db
    .select()
    .from(article)
    .where(eq(article.id, id))
    .then((rows) => rows[0]);
}

export async function getArticleBySlug(slug: string) {
  "use cache";
  cacheTag(`article-slug-${slug}`);
  cacheLife("minutes");
  return db
    .select()
    .from(article)
    .where(eq(article.slug, slug))
    .then((rows) => rows[0]);
}

export async function getPublishedArticles(options?: { search?: string }) {
  "use cache";
  cacheTag("published-articles");
  cacheLife("minutes");

  let query = db
    .select({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
    })
    .from(article)
    .where(eq(article.status, "published"));

  const articles = await query.orderBy(desc(article.publishedAt));

  if (options?.search) {
    const searchLower = `%${options.search.toLowerCase()}%`;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(searchLower)),
    );
  }

  return articles;
}

export async function getArticleWithCategoriesAndTags(slug: string) {
  "use cache";
  cacheTag(`article-${slug}`);
  cacheLife("minutes");

  const articles = await db
    .select()
    .from(article)
    .where(and(eq(article.slug, slug), eq(article.status, "published")));

  if (!articles[0]) return null;

  const articleData = articles[0];

  const categoryRows = await db
    .select({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })
    .from(category)
    .innerJoin(articleCategories, eq(articleCategories.categoryId, category.id))
    .where(eq(articleCategories.articleId, articleData.id));

  const tagRows = await db
    .select({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })
    .from(tag)
    .innerJoin(articleTags, eq(articleTags.tagId, tag.id))
    .where(eq(articleTags.articleId, articleData.id));

  return {
    ...articleData,
    categories: categoryRows,
    tags: tagRows,
  };
}

export async function getArticlesByCategory(categorySlug: string) {
  "use cache";
  cacheTag(`category-${categorySlug}`);
  cacheLife("minutes");

  const categoryRows = await db
    .select()
    .from(category)
    .where(eq(category.slug, categorySlug));

  if (!categoryRows[0]) return [];

  const articleIds = await db
    .select({ articleId: articleCategories.articleId })
    .from(articleCategories)
    .where(eq(articleCategories.categoryId, categoryRows[0].id));

  if (articleIds.length === 0) return [];

  const articles = await db
    .select({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      publishedAt: article.publishedAt,
    })
    .from(article)
    .where(
      and(
        eq(article.status, "published"),
        sql`${article.id} IN ${articleIds.map((a) => a.articleId)}`,
      ),
    )
    .orderBy(desc(article.publishedAt));

  return articles;
}

export async function getRecentArticles(limit = 5) {
  "use cache";
  cacheTag("recent-articles");
  cacheLife("minutes");

  return db
    .select()
    .from(article)
    .orderBy(desc(article.createdAt))
    .limit(limit);
}

export async function getArticleCategories(articleId: string) {
  await verifySession();
  const cats = await db
    .select({
      categoryId: articleCategories.categoryId,
    })
    .from(articleCategories)
    .where(eq(articleCategories.articleId, articleId));
  return cats.map((c) => c.categoryId);
}

export async function getArticleTags(articleId: string) {
  await verifySession();
  const tags = await db
    .select({
      tagId: articleTags.tagId,
    })
    .from(articleTags)
    .where(eq(articleTags.articleId, articleId));
  return tags.map((t) => t.tagId);
}

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
