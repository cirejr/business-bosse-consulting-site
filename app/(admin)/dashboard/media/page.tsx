import { Suspense } from 'react';
import { MediaGrid } from './media-grid';
import { MediaUploadButton } from "./upload-button";
import { getAllMedia } from "@/lib/data/media";

export default function MediaPage() {
  const mediaPromise = getAllMedia();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Media Library</h1>
        <MediaUploadButton />
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-md bg-muted animate-pulse" />
        ))}
      </div>}>
        <MediaGrid mediaPromise={mediaPromise} />
      </Suspense>
    </>
  );
}