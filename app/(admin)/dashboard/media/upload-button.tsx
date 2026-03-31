'use client';

import { UploadButton } from "@/lib/uploadthing";
import { createMediaFromUpload } from "@/lib/actions/media-actions";

export function MediaUploadButton() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={async (res) => {
        const url = res[0].ufsUrl;
        const name = res[0].name;
        await createMediaFromUpload(url, name);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
    />
  );
}
