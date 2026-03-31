'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getBreadcrumbs, type BreadcrumbItem as BreadcrumbItemType } from '@/lib/breadcrumbs';
import { AdminSearch } from '@/components/admin-search';
import {
  IconArticle,
  IconFolder,
  IconPhoto,
  IconSettings,
  IconTag,
} from '@tabler/icons-react';

const segmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  articles: IconArticle,
  categories: IconFolder,
  tags: IconTag,
  media: IconPhoto,
  settings: IconSettings,
};

export function SiteHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumb */}
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const IconComponent = index > 0 ? segmentIcons[breadcrumbs[index - 1]?.label?.toLowerCase() || ''] : null;
              const isLast = index === breadcrumbs.length - 1;

              return (
                <>
                  {index > 0 && <BreadcrumbSeparator className="hidden sm:inline" />}
                  <BreadcrumbItem key={item.label} className="hidden sm:inline-flex">
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-2 font-medium">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {item.label}
                      </BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {item.label}
                      </span>
                    )}
                  </BreadcrumbItem>
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search */}
        <div className="ml-auto">
          <AdminSearch />
        </div>
      </div>
    </header>
  );
}