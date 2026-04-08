import { db } from "@/db";
import {
  article,
  articleCategories,
  articleTags,
  category,
  tag,
} from "@/db/schema";
import { eq, desc, like, and, sql } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";

interface ArticleFilters {
  categoryId?: string;
  search?: string;
}

export async function getPublishedArticles(filters?: ArticleFilters) {
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

  if (filters?.search) {
    const searchLower = `%${filters.search.toLowerCase()}%`;
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

export async function getAllCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife("minutes");

  return db.select().from(category).orderBy(category.name);
}

export async function getAllTags() {
  "use cache";
  cacheTag("tags");
  cacheLife("minutes");

  return db.select().from(tag).orderBy(tag.name);
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

interface ArticleFilters {
  category?: string;
  search?: string;
}

type ArticleSelect = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export async function getArticles(filters?: ArticleFilters): Promise<ArticleSelect[]> {
  "use cache";
  
  let articles: ArticleSelect[];

  if (filters?.category) {
    cacheTag(`category-${filters.category}`);
    const categoryRows = await db
      .select()
      .from(category)
      .where(eq(category.slug, filters.category));

    if (!categoryRows[0]) {
      articles = [];
    } else {
      const articleIds = await db
        .select({ articleId: articleCategories.articleId })
        .from(articleCategories)
        .where(eq(articleCategories.categoryId, categoryRows[0].id));

      if (articleIds.length === 0) {
        articles = [];
      } else {
        articles = await db
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
          .where(
            and(
              eq(article.status, "published"),
              sql`${article.id} IN ${articleIds.map((a) => a.articleId)}`,
            ),
          )
          .orderBy(desc(article.publishedAt));
      }
    }
  } else {
    cacheTag("published-articles");
    articles = await db
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
      .where(eq(article.status, "published"))
      .orderBy(desc(article.publishedAt));
  }

  cacheLife("minutes");

  if (filters?.search && articles.length > 0) {
    const searchLower = filters.search.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(searchLower)),
    );
  }

  return articles;
}
