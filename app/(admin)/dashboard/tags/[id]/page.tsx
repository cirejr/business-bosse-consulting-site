import { getTag } from "@/lib/data/tags";
import { notFound } from "next/navigation";
import EditTagForm from "./edit-tag-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params;
  const tagData = await getTag(id);

  if (!tagData) {
    notFound();
  }

  return <EditTagForm tag={tagData} />;
}
