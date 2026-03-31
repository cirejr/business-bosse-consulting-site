export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  // Remove 'dashboard' from the path since it's the base
  const adminSegments = segments.filter(s => s !== 'dashboard');

  if (adminSegments.length === 0) {
    return [{ label: 'Dashboard' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

  const segmentLabels: Record<string, string> = {
    articles: 'Articles',
    categories: 'Categories',
    tags: 'Tags',
    media: 'Media Library',
    settings: 'Settings',
  };

  const segmentIcons: Record<string, string> = {
    articles: 'IconArticle',
    categories: 'IconFolder',
    tags: 'IconTag',
    media: 'IconPhoto',
    settings: 'IconSettings',
  };

  for (let i = 0; i < adminSegments.length; i++) {
    const segment = adminSegments[i];
    const baseLabel = segmentLabels[segment];
    
    if (!baseLabel) {
      // Handle dynamic IDs - look at next segment for context
      if (i === adminSegments.length - 1) {
        // Last segment is an ID, try to infer from previous segment
        const prevSegment = adminSegments[i - 1];
        const prevLabel = segmentLabels[prevSegment];
        if (prevLabel) {
          const action = segment === 'new' ? 'New' : 'Edit';
          breadcrumbs.push({ 
            label: `${prevLabel} / ${action}`,
            href: undefined 
          });
        }
      }
      continue;
    }

    // Check if it's a new/create page
    if (segment === 'new') {
      breadcrumbs.push({ label: `New ${baseLabel.slice(0, -1)}` });
      continue;
    }

    // Check if this is an edit page (has an ID after it)
    const nextSegment = adminSegments[i + 1];
    const isEditPage = nextSegment && !segmentLabels[nextSegment];
    
    if (isEditPage) {
      breadcrumbs.push({ 
        label: `${baseLabel} / Edit`,
        href: `/dashboard/${segment}`
      });
    } else {
      breadcrumbs.push({ 
        label: baseLabel,
        href: `/dashboard/${segment}`
      });
    }
  }

  return breadcrumbs;
}