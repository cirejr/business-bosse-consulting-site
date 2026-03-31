import { getArticle, getAllCategories, getAllTags, getArticleCategories, getArticleTags } from "@/lib/data/articles";
import { getAllMedia } from "@/lib/data/media";
import { notFound } from "next/navigation";
import ArticleFormClient from "./article-form-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  
  const [articleData, categories, tags, categoryRows, tagRows, media] = await Promise.all([
    getArticle(id),
    getAllCategories(),
    getAllTags(),
    getArticleCategories(id),
    getArticleTags(id),
    getAllMedia(),
  ]);

  if (!articleData) {
    notFound();
  }

  return (
    <ArticleFormClient 
      article={articleData} 
      categories={categories} 
      tags={tags}
      mediaItems={media}
      articleCategoryIds={categoryRows}
      articleTagIds={tagRows}
      isEdit={true} 
    />
  );
}
