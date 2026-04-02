import { Suspense } from 'react';
import { getCategory } from "@/lib/data/categories";
import { notFound } from "next/navigation";
import EditCategoryForm from "./edit-category-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function CategoryFormContent({ id }: { id: string }) {
  const categoryData = await getCategory(id);

  if (!categoryData) {
    notFound();
  }

  return <EditCategoryForm category={categoryData} />;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading category...</div>}>
      <CategoryFormContent id={id} />
    </Suspense>
  );
}
