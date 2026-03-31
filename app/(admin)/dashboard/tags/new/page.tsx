'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTag } from '@/lib/actions/tag-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewTagPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await createTag(formData);
      toast.success('Tag created successfully');
      router.push('/dashboard/tags');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
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
          <h1 className="text-2xl font-bold font-serif">New Tag</h1>
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
            placeholder="Tag name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <p className="text-sm text-muted-foreground">
            Auto-generated from name
          </p>
        </div>
      </div>
    </form>
  );
}
