import { Suspense } from 'react';
import { getTag } from "@/lib/data/tags";
import { notFound } from "next/navigation";
import EditTagForm from "./edit-tag-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function TagFormContent({ id }: { id: string }) {
  const tagData = await getTag(id);

  if (!tagData) {
    notFound();
  }

  return <EditTagForm tag={tagData} />;
}

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading tag...</div>}>
      <TagFormContent id={id} />
    </Suspense>
  );
}
