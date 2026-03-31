# Public Site Integration Implementation

## Technical Approach

### 1. Blog Listing Page (`app/(site)/blog/page.tsx`)
- Add category filter sidebar/dropdown using URL search params
- Add search input that filters by title/excerpt
- Display categories as clickable filter tags
- Show category and tag pills on each article card

### 2. Blog Post Page (`app/(site)/blog/[slug]/page.tsx`)
- Query and display categories linked to the article
- Query and display tags linked to the article
- Add category/tag links that filter the blog page

### 3. Helper Functions
- Create `lib/queries/article-queries.ts` with functions:
  - `getPublishedArticles(filters)` - with category, search params
  - `getArticleWithCategoriesAndTags(slug)` - for single post

## Affected Files
- `app/(site)/blog/page.tsx` - Add filters + category/tag display
- `app/(site)/blog/[slug]/page.tsx` - Add category/tag display
- `lib/queries/article-queries.ts` - New file for filtered queries

## Verification
- Build passes: `bun run build`
- Blog page loads at `/blog`
- Individual posts load at `/blog/[slug]`
- Categories filter works via URL params
