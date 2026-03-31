import { Suspense } from 'react';
import { getAllCategories } from "@/lib/data/categories";
import { CategoriesTable } from './categories-table';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const categoriesPromise = getAllCategories();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Categories</h1>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-96 rounded-md border bg-muted animate-pulse" />}>
        <CategoriesTable categoriesPromise={categoriesPromise} />
      </Suspense>
    </>
  );
}