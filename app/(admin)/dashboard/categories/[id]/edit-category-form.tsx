'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCategory } from '@/lib/actions/category-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EditCategoryFormProps {
  category: Category;
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await updateCategory(category.id, formData);
      toast.success('Category updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/categories">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold font-serif">Edit Category</h1>
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
            defaultValue={category.name}
            placeholder="Category name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <p className="text-sm text-muted-foreground">
            Auto-generated from name: {category.slug}
          </p>
        </div>
      </div>
    </form>
  );
}
