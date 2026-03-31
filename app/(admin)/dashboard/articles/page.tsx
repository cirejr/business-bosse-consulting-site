import { Suspense } from 'react';
import { getArticles } from "@/lib/data/articles";
import { ArticlesTable } from './articles-table';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default function ArticlesPage({ searchParams }: PageProps) {
  const articlesPromise = getArticles({});

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Articles</h1>
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-96 rounded-md border bg-muted animate-pulse" />}>
        <ArticlesTable articlesPromise={articlesPromise} />
      </Suspense>
    </>
  );
}