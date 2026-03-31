import { Suspense } from 'react';
import { getAllTags } from "@/lib/data/tags";
import { TagsTable } from './tags-table';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TagsPage() {
  const tagsPromise = getAllTags();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Tags</h1>
        <Button asChild>
          <Link href="/dashboard/tags/new">
            <Plus className="mr-2 h-4 w-4" />
            New Tag
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-96 rounded-md border bg-muted animate-pulse" />}>
        <TagsTable tagsPromise={tagsPromise} />
      </Suspense>
    </>
  );
}