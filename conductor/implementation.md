# Implementation Plan: Lossless WordPress Migration (Articles, Categories, Tags, Images)

## Technical Approach

### 1. Database Schema Update
*   **`article` Table**:
    *   Add `wp_id`: Integer (to map relationships during migration).
    *   Add `meta`: JSONB (to temporarily hold WP-specific data like `_thumbnail_id`).
*   **`category` & `tag` Tables**:
    *   Add `wp_id`: Integer.
*   **`media` Table (New)**:
    *   Fields: `id`, `name`, `url`, `type`, `size`, `wp_id`.

### 2. Migration Script Logic (`lib/migration/wp-importer.ts`)
*   **Step A (Terms)**: Import all `category` and `post_tag` terms into our new tables, storing their WP IDs.
*   **Step B (Media)**: Identify all `attachment` types in the SQL dump and populate the `media` table.
*   **Step C (Articles)**: 
    *   Import only `post_type = 'post'`.
    *   Clean the content (remove WordPress-specific HTML comments like `<!-- wp:paragraph -->`).
    *   Link to Categories/Tags by looking up relationships in the `wp_term_relationships` data.
    *   Set the `cover_image_url` by finding the `_thumbnail_id` in the `wp_postmeta` data and matching it to our new `media` table.

### 3. Verification & Cleanup
*   Once the migration is complete and verified, the `wp_id` and `meta` columns can be ignored or eventually removed to keep the schema 100% focused on the new CMS.

## Affected Files
*   `db/schema.ts`: Table updates and new `media` table.
*   `tasks/kanban.md`: Update backlog with migration sub-tasks.
*   `lib/migration/`: (New directory) Migration scripts.

## Next Steps
1. Update the database schema and generate the migration.
2. Draft the migration parser script to process the 30MB SQL dump.
