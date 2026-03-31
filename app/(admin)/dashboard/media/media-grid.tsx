'use client';

import { use } from 'react';
import { Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import DeleteButton from "./delete-button";

interface MediaGridProps {
  mediaPromise: Promise<{
    id: string;
    name: string;
    url: string | null;
    type: string | null;
    size: number | null;
    wpId: number | null;
    createdAt: Date;
    updatedAt: Date;
  }[]>;
}

export function MediaGrid({ mediaPromise }: MediaGridProps) {
  const mediaItems = use(mediaPromise);

  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-8">
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No media files</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload your first image to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {mediaItems.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
        >
          {item.url ? (
            <Image
              src={item.url}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
            <div className="text-white text-xs text-center px-2 truncate">
              {item.name}
            </div>
            <DeleteButton id={item.id} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
            <p className="truncate text-xs text-white">{item.name}</p>
            <p className="text-xs text-white/70">
              {item.createdAt ? format(new Date(item.createdAt), 'MMM d') : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}