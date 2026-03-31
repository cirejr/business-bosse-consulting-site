import { Suspense } from 'react';
import { getArticleWithCategoriesAndTags } from "@/lib/queries/article-queries";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/ArticleHero";
import { ArticleContent } from "@/components/article-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function BlogPostContent({ slug }: { slug: string }) {
  const articleData = await getArticleWithCategoriesAndTags(slug);

  if (!articleData) {
    notFound();
  }

  return (
    <>
      <ArticleHero
        title={articleData.title}
        excerpt={articleData.excerpt}
        publishedAt={articleData.publishedAt}
        categories={articleData.categories || []}
        coverImageUrl={articleData.coverImageUrl}
      />
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <ArticleContent content={articleData.content} />

          {articleData.tags && articleData.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {articleData.tags.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BlogPostContent slug={slug} />
    </Suspense>
  );
}
