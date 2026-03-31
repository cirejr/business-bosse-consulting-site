import { db } from "@/db";
import { article, category, tag } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function SectionCards() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalCategories,
    totalTags,
  ] = await Promise.all([
    db.select({ count: count() }).from(article),
    db
      .select({ count: count() })
      .from(article)
      .where(eq(article.status, "published")),
    db
      .select({ count: count() })
      .from(article)
      .where(eq(article.status, "draft")),
    db.select({ count: count() }).from(category),
    db.select({ count: count() }).from(tag),
  ]);

  return (
    <div className="*:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Articles</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalArticles[0]?.count || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Published</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {publishedArticles[0]?.count || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Drafts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {draftArticles[0]?.count || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Categories</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCategories[0]?.count || 0}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
