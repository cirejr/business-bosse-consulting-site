import { getCategory } from "@/lib/data/categories";
import { notFound } from "next/navigation";
import EditCategoryForm from "./edit-category-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categoryData = await getCategory(id);

  if (!categoryData) {
    notFound();
  }

  return <EditCategoryForm category={categoryData} />;
}
