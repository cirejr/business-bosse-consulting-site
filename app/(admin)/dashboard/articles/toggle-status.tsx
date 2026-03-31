'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toggleArticleStatus } from '@/lib/actions/article-actions';
import { toast } from 'sonner';

interface ToggleStatusProps {
  id: string;
  status: 'draft' | 'published';
}

export default function ToggleStatus({ id, status }: ToggleStatusProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  async function handleToggle(checked: boolean) {
    setIsToggling(true);
    try {
      await toggleArticleStatus(id);
      toast.success(status === 'published' ? 'Marked as draft' : 'Published successfully');
      router.refresh();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={status === 'published'}
        onCheckedChange={handleToggle}
        disabled={isToggling}
      />
      <span className={`text-xs ${status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
        {status === 'published' ? 'Published' : 'Draft'}
      </span>
    </div>
  );
}
