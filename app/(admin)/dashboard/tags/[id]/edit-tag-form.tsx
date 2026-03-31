'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTag } from '@/lib/actions/tag-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface EditTagFormProps {
  tag: Tag;
}

export default function EditTagForm({ tag }: EditTagFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await updateTag(tag.id, formData);
      toast.success('Tag updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tags">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold font-serif">Edit Tag</h1>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={tag.name}
            placeholder="Tag name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <p className="text-sm text-muted-foreground">
            Auto-generated from name: {tag.slug}
          </p>
        </div>
      </div>
    </form>
  );
}
