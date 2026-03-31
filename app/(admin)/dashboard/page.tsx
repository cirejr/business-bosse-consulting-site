import { Suspense } from 'react';
import { getArticles } from "@/lib/data/articles";
import { SectionCards } from "@/components/section-cards";
import { RecentArticlesTable } from "@/components/recent-articles-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const articlesPromise = getArticles();

  return (
    <>
      <h1 className="text-2xl font-bold font-serif">Dashboard</h1>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      }>
        <SectionCards />
      </Suspense>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Articles</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/articles">View All</Link>
          </Button>
        </div>

        <Suspense fallback={
          <div className="h-48 rounded-md border bg-muted animate-pulse" />
        }>
          <RecentArticlesTable articlesPromise={articlesPromise} />
        </Suspense>
      </div>
    </>
  );
}