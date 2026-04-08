import { Suspense } from "react";
import { Metadata } from "next";
import { getArticles, getAllCategories } from "@/lib/queries/article-queries";
import { BlogListShell, BlogListContent, BlogListSkeleton } from "@/components/blog-list";

export async function generateMetadata(props: {
  searchParams: Promise<{ category?: string; search?: string }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const baseUrl = "https://bbcons.net";

  if (searchParams.category) {
    const categories = await getAllCategories();
    const category = categories.find((c) => c.slug === searchParams.category);
    
    return {
      title: category ? `${category.name} - Blog B&BC` : "Catégorie - Blog B&BC",
      description: category
        ? `Articles sur ${category.name} - Business & Bosse Consulting`
        : "Articles du blog - Business & Bosse Consulting",
      openGraph: {
        title: category ? `${category.name} - Blog B&BC` : "Blog - Business & Bosse Consulting",
        description: category
          ? `Articles sur ${category.name} - Business & Bosse Consulting`
          : "Découvrez nos articles sur le conseil en gestion et les solutions IT en Afrique.",
        url: `${baseUrl}/blog${searchParams.category ? `?category=${searchParams.category}` : ""}`,
        type: "website",
      },
      alternates: {
        canonical: `${baseUrl}/blog${searchParams.category ? `?category=${searchParams.category}` : ""}`,
      },
    };
  }

  return {
    title: "Blog - Business & Bosse Consulting",
    description:
      "Découvrez nos articles sur le conseil en gestion, les solutions informatiques et la transformation digitale en Afrique.",
    openGraph: {
      title: "Blog - Business & Bosse Consulting",
      description:
        "Découvrez nos articles sur le conseil en gestion, les solutions informatiques et la transformation digitale en Afrique.",
      url: `${baseUrl}/blog`,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
  };
}

export default function BlogPage(props: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  return (
    <Suspense fallback={<BlogListShell category={undefined} search={undefined}><BlogListSkeleton /></BlogListShell>}>
      <BlogListContentWrapper searchParamsPromise={props.searchParams} />
    </Suspense>
  );
}

async function BlogListContentWrapper({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParamsPromise;

  return (
    <BlogListShell category={category} search={search}>
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListContent
          articlesPromise={getArticles({ category, search })}
          categoriesPromise={getAllCategories()}
          category={category}
        />
      </Suspense>
    </BlogListShell>
  );
}