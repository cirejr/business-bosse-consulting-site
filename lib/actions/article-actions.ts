'use server';

import { db } from "@/db";
import { article, articleCategories, articleTags, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  
  while (true) {
    let existing;
    
    if (excludeId) {
      existing = await db.select({ id: article.id, slug: article.slug })
        .from(article)
        .where(eq(article.slug, slug));
      const isDuplicate = existing.some(a => a.slug === slug && a.id !== excludeId);
      if (!isDuplicate) break;
    } else {
      existing = await db.select({ slug: article.slug }).from(article).where(eq(article.slug, slug));
      if (existing.length === 0) break;
    }
    
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  
  return slug;
}

export async function createArticle(formData: FormData) {
  await verifyAuth();
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const status = formData.get('status') as 'draft' | 'published';
  const categoryIds = formData.getAll('categoryIds') as string[];
  const tagIds = formData.getAll('tagIds') as string[];

  const baseSlug = generateSlug(title);
  const slug = await getUniqueSlug(baseSlug);
  const publishedAt = status === 'published' ? new Date() : null;

  const session = await verifyAuth();
  const authorId = session.user.id;

  if (!authorId) {
    throw new Error('No user found. Please create an admin user first.');
  }

  const result = await db.insert(article).values({
    id: crypto.randomUUID(),
    title,
    slug,
    content,
    excerpt,
    coverImageUrl: coverImageUrl || null,
    status,
    authorId,
    publishedAt,
  }).returning({ id: article.id });

  const articleId = result[0].id;

  const validCategoryIds = categoryIds.filter(Boolean);

  if (validCategoryIds.length > 0) {
    await db.insert(articleCategories).values(
      validCategoryIds.map(categoryId => ({
        articleId,
        categoryId,
      }))
    );
  }

  const validTagIds = tagIds.filter(Boolean);

  if (validTagIds.length > 0) {
    await db.insert(articleTags).values(
      validTagIds.map(tagId => ({
        articleId,
        tagId,
      }))
    );
  }

  revalidatePath('/dashboard/articles');
  updateTag('articles-all');
  updateTag('articles-draft');
  updateTag('articles-published');
  updateTag('published-articles');
  updateTag('categories');
  updateTag('tags');
  return { success: true };
}

export async function updateArticle(id: string, formData: FormData) {
  await verifyAuth();
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const status = formData.get('status') as 'draft' | 'published';
  const categoryIds = formData.getAll('categoryIds') as string[];
  const tagIds = formData.getAll('tagIds') as string[];

  // Get current article to find its slug for cache invalidation
  const currentArticle = await db.select().from(article).where(eq(article.id, id));
  const currentSlug = currentArticle[0]?.slug;

  const baseSlug = generateSlug(title);
  const slug = await getUniqueSlug(baseSlug, id);
  const publishedAt = status === 'published' ? new Date() : null;

  await db.update(article).set({
    title,
    slug,
    content,
    excerpt,
    coverImageUrl: coverImageUrl || null,
    status,
    publishedAt,
  }).where(eq(article.id, id));

  await db.delete(articleCategories).where(eq(articleCategories.articleId, id));
  
  const validCategoryIds = categoryIds.filter(Boolean);

  if (validCategoryIds.length > 0) {
    await db.insert(articleCategories).values(
      validCategoryIds.map(categoryId => ({
        articleId: id,
        categoryId,
      }))
    );
  }

  await db.delete(articleTags).where(eq(articleTags.articleId, id));
  
  const validTagIds = tagIds.filter(Boolean);

  if (validTagIds.length > 0) {
    await db.insert(articleTags).values(
      validTagIds.map(tagId => ({
        articleId: id,
        tagId,
      }))
    );
  }

  revalidatePath('/dashboard/articles');
  updateTag('articles-all');
  updateTag('articles-draft');
  updateTag('articles-published');
  updateTag('published-articles');
  if (currentSlug) {
    updateTag(`article-${currentSlug}`);
  }
  updateTag('categories');
  updateTag('tags');
  return { success: true };
}

export async function deleteArticle(id: string) {
  await verifyAuth();
  
  // Get article slug for cache invalidation
  const articleToDelete = await db.select({ slug: article.slug }).from(article).where(eq(article.id, id));
  const slug = articleToDelete[0]?.slug;
  
  await db.delete(article).where(eq(article.id, id));
  revalidatePath('/dashboard/articles');
  updateTag('articles-all');
  updateTag('articles-draft');
  updateTag('articles-published');
  updateTag('published-articles');
  if (slug) {
    updateTag(`article-${slug}`);
  }
}

export async function toggleArticleStatus(id: string) {
  await verifyAuth();
  
  const articles = await db.select().from(article).where(eq(article.id, id));
  const currentArticle = articles[0];
  
  if (!currentArticle) {
    throw new Error('Article not found');
  }
  
  const newStatus = currentArticle.status === 'published' ? 'draft' : 'published';
  const publishedAt = newStatus === 'published' ? new Date() : null;
  
  await db.update(article).set({
    status: newStatus,
    publishedAt,
  }).where(eq(article.id, id));
  
  revalidatePath('/dashboard/articles');
  revalidatePath('/blog');
  updateTag('articles-all');
  updateTag('articles-draft');
  updateTag('articles-published');
  updateTag('published-articles');
  if (currentArticle.slug) {
    updateTag(`article-${currentArticle.slug}`);
  }
}
