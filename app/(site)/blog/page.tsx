import {
  getPublishedArticles,
  getAllCategories,
  getArticlesByCategory,
} from "@/lib/queries/article-queries";
import { BlogHero } from "@/components/BlogHero";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  let articles;

  if (category) {
    articles = await getArticlesByCategory(category);
    if (search && articles) {
      const searchLower = `%${search.toLowerCase()}%`;
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(searchLower)),
      );
    }
  } else {
    articles = await getPublishedArticles({ search });
  }

  const categories = await getAllCategories();

  return (
    <>
      <BlogHero />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <form className="flex-1" action="/blog" method="GET">
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <div className="flex gap-2">
                <Input
                  type="search"
                  name="search"
                  placeholder="Rechercher un article..."
                  defaultValue={search || ""}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href="/blog"
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !category
                    ? "bg-navy-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    category === cat.slug
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun article trouvé.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {articles.map((item) => (
                <article key={item.id} className="group">
                  <Link href={`/blog/${item.slug}`} className="block">
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      {item.coverImageUrl && (
                        <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className={item.coverImageUrl ? "" : "md:col-span-2"}>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          {item.publishedAt && (
                            <span>
                              {format(new Date(item.publishedAt), "d MMMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-3 text-navy-900 group-hover:text-gold-600 transition-colors">
                          {item.title}
                        </h2>
                        {item.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}
                        <span className="text-gold-600 font-medium group-hover:underline">
                          Lire la suite →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
