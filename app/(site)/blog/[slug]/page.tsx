import { Suspense } from 'react';
import { Metadata } from "next";
import { getArticleWithCategoriesAndTags, getPublishedArticles } from "@/lib/queries/article-queries";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/ArticleHero";
import { ArticleContent } from "@/components/article-content";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const article = await getArticleWithCategoriesAndTags(params.slug);

  if (!article) {
    return {
      title: "Article non trouvé - Business & Bosse Consulting",
    };
  }

  const baseUrl = "https://bbcons.net";
  const imageUrl = article.coverImageUrl 
    ? `${baseUrl}${article.coverImageUrl}` 
    : `${baseUrl}/images/logo_bbcons-7.png`;

  return {
    title: `${article.title} - Business & Bosse Consulting`,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      url: `${baseUrl}/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: ["Business & Bosse Consulting"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${article.slug}`,
    },
  };
}

async function BlogPost({ slug }: { slug: string }) {
  const articleData = await getArticleWithCategoriesAndTags(slug);

  if (!articleData) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: articleData.title,
            description: articleData.excerpt,
            image: articleData.coverImageUrl,
            datePublished: articleData.publishedAt?.toISOString(),
            author: {
              "@type": "Organization",
              name: "Business & Bosse Consulting",
              url: "https://bbcons.net",
            },
            publisher: {
              "@type": "Organization",
              name: "Business & Bosse Consulting",
              logo: {
                "@type": "ImageObject",
                url: "https://bbcons.net/images/logo_bbcons-7.png",
              },
            },
          }),
        }}
      />
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

function BlogPostFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse h-96 w-full max-w-3xl bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BlogPostFallback />}>
      <BlogPostWithParams params={props.params} />
    </Suspense>
  );
}

async function BlogPostWithParams({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPost slug={slug} />;
}
