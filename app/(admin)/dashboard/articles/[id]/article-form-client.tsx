'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { updateArticle } from '@/lib/actions/article-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MediaPicker } from '@/components/media-picker';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const TiptapEditor = dynamic(
  () => import('@/components/editor/tiptap-editor'),
  { 
    ssr: false,
    loading: () => <Textarea rows={15} className="font-mono" disabled placeholder="Loading editor..." />
  }
);

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: 'draft' | 'published';
}

interface ArticleFormClientProps {
  article: Article;
  categories: Category[];
  tags: Tag[];
  mediaItems: MediaItem[];
  articleCategoryIds?: string[];
  articleTagIds?: string[];
  isEdit?: boolean;
}

export default function ArticleFormClient({ article, categories, tags, mediaItems, articleCategoryIds = [], articleTagIds = [], isEdit = false }: ArticleFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>(article.status);
  const [selectedCategory, setSelectedCategory] = useState<string>(articleCategoryIds[0] || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(articleTagIds);
  const [content, setContent] = useState(article.content || '');
  const [coverImageUrl, setCoverImageUrl] = useState(article.coverImageUrl || '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('status', status);
    formData.set('categoryIds', selectedCategory);
    formData.set('tagIds', selectedTags.join(','));
    formData.set('content', content);
    formData.set('coverImageUrl', coverImageUrl);

    try {
      await updateArticle(article.id, formData);
      toast.success('Article updated successfully');
      router.push('/dashboard/articles');
    } catch (error: unknown) {
      const err = error as { digest?: string };
      if (err?.digest?.includes('NEXT_REDIRECT')) {
        return;
      }
      console.error('Error saving article:', error);
      toast.error('Failed to update article');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/articles">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold font-serif">
            {isEdit ? 'Edit Article' : 'New Article'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="status"
              checked={status === 'published'}
              onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
            />
            <Label htmlFor="status" className="cursor-pointer">
              {status === 'published' ? 'Published' : 'Draft'}
            </Label>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={article.title}
              placeholder="Article title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={article.slug}
              placeholder="article-url-slug"
            />
            <p className="text-sm text-muted-foreground">
              URL: /blog/{article.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={article.excerpt || ''}
              placeholder="Brief summary of the article"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your article..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <MediaPicker
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            mediaItems={mediaItems}
          />

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    value={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, tag.id]);
                      } else {
                        setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer font-normal">
                    {tag.name}
                  </Label>
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
