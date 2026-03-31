'use server';

import { db } from "@/db";
import { article, category, tag } from "@/db/schema";
import { like, or } from "drizzle-orm";

interface SearchResult {
  articles: {
    id: string;
    title: string;
    slug: string;
    status: string;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export async function searchAll(query: string): Promise<SearchResult> {
  if (!query || query.trim().length === 0) {
    return { articles: [], categories: [], tags: [] };
  }

  const searchPattern = `%${query.trim()}%`;

  const [articles, categories, tags] = await Promise.all([
    db
      .select({
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
      })
      .from(article)
      .where(
        or(
          like(article.title, searchPattern),
          like(article.excerpt, searchPattern)
        )
      )
      .limit(5),
    db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })
      .from(category)
      .where(like(category.name, searchPattern))
      .limit(5),
    db
      .select({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })
      .from(tag)
      .where(like(tag.name, searchPattern))
      .limit(5),
  ]);

  return { articles, categories, tags };
}