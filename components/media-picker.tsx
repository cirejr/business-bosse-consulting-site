'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, X, Search, Upload } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  mediaItems: MediaItem[];
}

export function MediaPicker({ value, onChange, mediaItems }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  const filteredItems = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      onChange(urlInput);
      setShowUrlInput(false);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Cover Image</Label>
      
      {value ? (
        <div className="relative group border rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpen(true)}
            >
              Change
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Select from Library
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            Or enter URL
          </Button>
        </div>
      )}

      {showUrlInput && !value && (
        <div className="flex gap-2 mt-2">
          <Input
            type="url"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button onClick={handleUrlSubmit}>Add</Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Cover Image</DialogTitle>
            <DialogDescription>
              Choose an image from your media library
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No images found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload images in the Media Library first
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto py-4">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:ring-2 hover:ring-accent ${
                    value === item.url
                      ? 'border-accent ring-2 ring-accent'
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {value === item.url && (
                    <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                      <span className="bg-accent text-primary text-xs px-2 py-1 font-medium">
                        Selected
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} image{filteredItems.length !== 1 ? 's' : ''} available
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                window.open('/dashboard/media', '_blank');
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}