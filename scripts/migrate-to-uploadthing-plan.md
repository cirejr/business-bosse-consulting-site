# UploadThing Migration Script Plan

## Overview
This plan outlines a script to migrate locally stored images (from WordPress import) to UploadThing cloud storage, updating the database with new URLs while preserving branding images as local paths.

## 1. Identification of Relevant Images

### Database Tables and Fields
- **article table**: `cover_image_url` field stores image URLs
- **media table**: `url` field stores image URLs
- Both tables have `wpId` field (original WordPress ID) to identify imported content

### Selection Criteria
Target records where:
- URL starts with `/uploads/` (indicating local storage)
- `wpId` IS NOT NULL (identifies WordPress-imported content)
- Exclude branding images (which lack wpId and are not in database tables)

### Specific IDs to Process
Since we don't have access to the actual WordPress export data, we'll target:
- All articles with `wpId` NOT NULL AND `cover_image_url` LIKE '/uploads/%'
- All media items with `wpId` NOT NULL AND `url` LIKE '/uploads/%'

In practice, this would include:
- Blog post cover images (from article.cover_image_url)
- Seminar images and other content images (from media table)
- Any other WordPress-imported images referenced in content

## 2. File Path Resolution Logic

### Local Path Construction
Given a database URL like `/uploads/2023/05/image.jpg`:
1. Remove leading slash: `uploads/2023/05/image.jpg`
2. Prepend project public directory: `/home/cirejr/work/clients/business-bosse-consulting-site/public/uploads/2023/05/image.jpg`
3. Verify file exists at this path

### Path Normalization
- Handle both absolute and relative paths in database
- Ensure consistent forward slashes
- Resolve any `..` or `.` path components

## 3. UploadThing SDK Usage

### Server-Side Initialization
```typescript
import { UploadThing } from "uploadthing/server";

const uploadThing = new UploadThing({
  // Automatically reads from process.env:
  // UPLOADTHING_APP_ID
  // UPLOADTHING_SECRET
});
```

### File Upload Process
```typescript
async function uploadFileToUploadThing(localPath: string): Promise<string> {
  // Create readable stream from file
  const stream = fs.createReadStream(localPath);
  
  // Upload to UploadThing
  const result = await uploadThing.uploadFile({
    data: stream,
    // Optional: Add metadata for tracking
    metadata: {
      source: 'wordpress-migration',
      timestamp: new Date().toISOString()
    }
  });
  
  // Return the public URL
  return result.url;
}
```

### Batch Processing Optimization
To avoid duplicate uploads of the same file:
1. Group database records by local file path
2. Upload each unique file once
3. Apply the resulting URL to all records referencing that path

## 4. Database Update Queries

### Using Drizzle ORM
```typescript
import { db } from "@/db";
import { article, media } from "@/db/schema";

// Update article cover images
await db.update(article)
  .set({ coverImageUrl: newUrl })
  .eq(article.id, articleId);

// Update media URLs
await db.update(media)
  .set({ url: newUrl })
  .eq(media.id, mediaId);
```

### Transaction Handling
- Wrap updates in transactions for consistency
- Commit only after successful upload and verification
- Rollback on any failure

## 5. Preservation of Branding Images

### Safety Mechanism
The script exclusively targets records with:
- Non-null `wpId` (WordPress import identifier)
- Local `/uploads/` paths

Branding images:
- Are not stored in the database (used directly in components/UI)
- Or if stored, lack `wpId` field
- Therefore, they are automatically excluded from processing

### Verification
Pre-migration audit:
```sql
-- Count of images to migrate
SELECT COUNT(*) FROM article WHERE wpId IS NOT NULL AND cover_image_url LIKE '/uploads/%';
SELECT COUNT(*) FROM media WHERE wpId IS NOT NULL AND url LIKE '/uploads/%';

-- Confirm branding images are untouched
SELECT name, url FROM media WHERE wpId IS NULL AND url LIKE '/uploads/%';
```

## 6. Error Handling, Logging, and Verification

### Error Handling Strategy
- Try/catch around each file operation
- Continue processing other files on individual failures
- Detailed error logging with context
- Automatic rollback of database transactions on failure

### Logging Structure
```typescript
interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  details?: Record<string, any>;
}

// Log to both console and file
function log(entry: LogEntry) {
  console.log(`[${entry.timestamp}] [${entry.type}] ${entry.message}`);
  // Append to migration.log file
}
```

### Key Verification Steps
1. **Pre-upload**
   - File existence check
   - File size validation (configurable limit, e.g., 10MB)
   - File type validation (image/jpeg, image/png, etc.)
   - Read permissions check

2. **Post-upload**
   - Verify UploadThing URL returns successfully (HEAD request)
   - Confirm URL matches expected pattern (contains `uploadthing.com`)
   - Database update verification (read back and compare)

3. **Post-migration**
   - Summary report of:
     - Total files processed
     - Successful uploads
     - Failed uploads
     - Total storage space migrated
   - Sample URL verification

### Specific Safety Checks
- **File existence**: `fs.existsSync(localPath)` before upload
- **Size limits**: Check `fs.statSync(localPath).size` against max allowed
- **File type**: Check extension or use file-type detection
- **Path traversal**: Ensure resolved path stays within public/uploads directory
- **Network resilience**: Retry failed uploads with exponential backoff
- **IDempotency**: Script can be safely re-run (skips already migrated files)

## 7. Implementation Steps

### Phase 1: Preparation
1. Ensure UploadThing credentials are configured in environment
2. Verify database connection works
3. Create backup of database (recommended)
4. Install any required dependencies (`uploadthing` server SDK)

### Phase 2: Core Migration Logic
1. Query database for target records
2. Group records by local file path
3. For each unique file:
   - Validate file existence and properties
   - Upload to UploadThing
   - Store path-to-URL mapping
4. Update database records with new URLs
5. Commit transactions

### Phase 3: Verification and Reporting
1. Verify migrated URLs are accessible
2. Generate migration report
3. Manual spot-check of frontend display
4. Confirm branding images remain unaffected

### Phase 4: Cleanup
1. Remove temporary files/logs if desired
2. Document completion status

## 8. Example Code Structure

```typescript
// scripts/migrate-to-uploadthing.ts
import { UploadThing } from "uploadthing/server";
import { db } from "@/db";
import { article, media } from "@/db/schema";
import { fs, path } from "@/lib/utils"; // Custom utils wrappers

async function main() {
  const uploadThing = new UploadThing();
  
  // 1. Fetch records to migrate
  const articlesToMigrate = await db.select()
    .from(article)
    .where(and(
      eq(article.wpId, notNull()),
      like(article.coverImageUrl, '/uploads/%')
    ));
  
  const mediaToMigrate = await db.select()
    .from(media)
    .where(and(
      eq(media.wpId, notNull()),
      like(media.url, '/uploads/%')
    ));
  
  // 2. Group by local file path
  const fileGroups = new Map<string, {articles: typeof articlesToMigrate; media: typeof mediaToMigrate}>();
  
  // Process articles...
  // Process media...
  
  // 3. Process each unique file
  for (const [localPath, group] of fileGroups.entries()) {
    try {
      // Validate file
      // Upload to UploadThing
      // Update all records in group
    } catch (error) {
      // Log error and continue
    }
  }
  
  // 4. Generate report
}

main().catch(console.error);
```

## 9. Configuration Parameters

### Environment Variables
- `UPLOADTHING_APP_ID`: UploadThing application ID
- `UPLOADTHING_SECRET`: UploadThing secret key
- `MIGRATION_BATCH_SIZE`: Number of files to process per batch (default: 10)
- `MIGRATION_MAX_FILE_SIZE`: Maximum file size in MB (default: 10)
- `MIGRATION_ALLOWED_TYPES`: Comma-separated list of allowed MIME types

### Script Options
- `--dry-run`: Show what would be done without making changes
- `--verbose`: Detailed logging
- --help: Display usage information

## 10. Rollback Procedure

In case of issues:
1. Database backups taken pre-migration can be restored
2. Since we only update URL fields and don't delete files, local files remain intact
3. To revert: Set URLs back to original `/uploads/` paths using backup data
4. UploadThing files can be deleted via their dashboard if needed

## 11. Success Criteria

- [ ] All WordPress-imported images (articles + media) moved to UploadThing
- [ ] Database URLs updated to point to UploadThing
- [ ] Branding images remain as local `/uploads/` paths
- [ ] No broken image links on frontend after migration
- [ ] Migration log created with detailed results
- [ ] Script handles errors gracefully without stopping entire process
- [ ] Performance acceptable for expected volume (~100-500 images)
