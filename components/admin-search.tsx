'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchAll } from '@/lib/actions/search-actions';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Plus,
  FileText,
  Tag,
  Folder,
  Image,
  Settings,
  Search,
  Loader2,
} from 'lucide-react';
import {
  IconArticle,
  IconPlus,
  IconFolder,
  IconSettings,
  IconPhoto,
  IconTag,
} from '@tabler/icons-react';

interface SearchResults {
  articles: {
    id: string;
    title: string;
    slug: string;
    status: string;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

const quickActions = [
  {
    label: 'New Article',
    icon: IconPlus,
    href: '/dashboard/articles/new',
  },
  {
    label: 'New Category',
    icon: IconPlus,
    href: '/dashboard/categories/new',
  },
  {
    label: 'New Tag',
    icon: IconPlus,
    href: '/dashboard/tags/new',
  },
  {
    label: 'Media Library',
    icon: IconPhoto,
    href: '/dashboard/media',
  },
  {
    label: 'Settings',
    icon: IconSettings,
    href: '/dashboard/settings',
  },
];

export function AdminSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchAll(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Keyboard shortcut to open
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    });
  }

  return (
    <>
        <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:border-accent transition-colors w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search or type a command..." 
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}

          {!isLoading && !query && (
            <>
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => (
                  <CommandItem
                    key={action.href}
                    onSelect={() => handleSelect(action.href)}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandEmpty className="py-6 text-sm text-muted-foreground">
                Start typing to search...
              </CommandEmpty>
            </>
          )}

          {!isLoading && query && results && (
            <>
              {results.articles.length === 0 && 
               results.categories.length === 0 && 
               results.tags.length === 0 && (
                <CommandEmpty className="py-6 text-sm text-muted-foreground">
                  No results found for "{query}"
                </CommandEmpty>
              )}

              {results.articles.length > 0 && (
                <>
                  <CommandGroup heading="Articles">
                    {results.articles.map((article) => (
                      <CommandItem
                        key={article.id}
                        onSelect={() => handleSelect(`/dashboard/articles/${article.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="flex-1">{article.title}</span>
                        <span className={`text-xs ${
                          article.status === 'published' 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {article.status}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {results.categories.length > 0 && (
                <>
                  <CommandGroup heading="Categories">
                    {results.categories.map((cat) => (
                      <CommandItem
                        key={cat.id}
                        onSelect={() => handleSelect(`/dashboard/categories/${cat.id}`)}
                      >
                        <Folder className="mr-2 h-4 w-4" />
                        {cat.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {results.tags.length > 0 && (
                <CommandGroup heading="Tags">
                  {results.tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleSelect(`/dashboard/tags/${tag.id}`)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}