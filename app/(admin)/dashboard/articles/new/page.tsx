import { getAllCategories, getAllTags } from "@/lib/data/articles";
import { getAllMedia } from "@/lib/data/media";
import ArticleForm from "./article-form";

export default async function NewArticlePage() {
  const [categories, tags, media] = await Promise.all([
    getAllCategories(),
    getAllTags(),
    getAllMedia(),
  ]);

  return (
    <ArticleForm categories={categories} tags={tags} mediaItems={media} isEdit={false} />
  );
}
