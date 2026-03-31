# UploadThing Migration Implementation Plan

## Overview
This document details a comprehensive plan to migrate locally stored WordPress-imported images to UploadThing cloud storage while preserving branding images as local paths. The script will:

1. Identify WordPress-imported images (blog posts + seminar images) from the database
2. Get their actual file paths from the local filesystem
3. Upload them to UploadThing using the UploadThing SDK
4. Update the database with the new UploadThing URLs
5. Leave branding images as local /uploads/ paths
6. Include proper error handling, logging, and verification

## 1. Target Images Identification

### Database Analysis
Based on the schema in `/db/schema.ts`, we have two relevant tables:

#### Article Table
- `cover_image_url` - stores the URL of article cover images
- `wpId` - original WordPress post ID (NOT NULL for imported content)

#### Media Table
- `url` - stores the URL of media attachments
- `wpId` - original WordPress attachment ID (NOT NULL for imported content)

### Selection Logic
We will target records where:
- `wpId IS NOT NULL` (identifies WordPress-imported content)
- `url LIKE '/uploads/%'` OR `cover_image_url LIKE '/uploads/%'` (identifies local storage)
- Exclude branding images (which would not have wpId or would be in different contexts)

### Specific Content to Process
1. **Blog post cover images**: From `article.cover_image_url` where `wpId IS NOT NULL`
2. **Seminar images and content images**: From `media.url` where `wpId IS NOT NULL`
3. **Any other WordPress-imported images** referenced in content (stored in media table)

## 2. File Path Resolution

### Path Construction Algorithm
Given a database URL like `/uploads/2025/04/image.jpg`:
1. Validate it starts with `/uploads/`
2. Remove leading slash: `uploads/2025/04/image.jpg`
3. Prepend project public directory: `/home/cirejr/work/clients/business-bosse-consulting-site/public/uploads/2025/04/image.jpg`
4. Normalize path (resolve `..`, `.` components)
5. Verify file exists at resolved path

### Safety Measures
- Ensure resolved path stays within `public/uploads` directory (prevent path traversal)
- Validate file exists before attempting upload
- Check file size against configurable limits
- Validate file type (image/jpeg, image/png, etc.)

## 3. UploadThing SDK Integration

### Setup
Based on existing code in `/lib/uploadthing.ts`, we need to:
1. Install UploadThing server SDK: `bun add uploadthing`
2. Configure environment variables:
   - `UPLOADTHING_APP_ID`
   - `UPLOADTHING_SECRET`

### Server-Side Implementation
```typescript
import { UploadThing } from "uploadthing/server";

const uploadThing = new UploadThing({
  // Reads from process.env automatically:
  // UPLOADTHING_APP_ID
  // UPLOADTHING_SECRET
});
```

### Upload Function
```typescript
import { createReadStream } from "fs";
import { statSync } from "fs";

async function uploadFileToUploadThing(
  localPath: string,
  options: {
    metadata?: Record<string, any>;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<string> {
  // Validate file exists
  if (!existsSync(localPath)) {
    throw new Error(`File not found: ${localPath}`);
  }
  
  // Get file stats for progress reporting
  const stats = statSync(localPath);
  const fileSize = stats.size;
  
  // Create readable stream
  const stream = createReadStream(localPath);
  
  // Track upload progress
  let uploadedBytes = 0;
  stream.on("data", (chunk) => {
    uploadedBytes += chunk.length;
    if (options.onProgress) {
      const progress = Math.round((uploadedBytes / fileSize) * 100);
      options.onProgress(progress);
    }
  });
  
  // Upload to UploadThing
  const result = await uploadThing.uploadFile({
    data: stream,
    metadata: {
      source: "wordpress-migration",
      timestamp: new Date().toISOString(),
      ...options.metadata
    }
  });
  
  return result.url;
}
```

### Batch Processing Optimization
To prevent duplicate uploads:
1. Group all database records by their local file path
2. Process each unique file only once
3. Apply the resulting URL to all database records referencing that path
4. This reduces UploadThing API calls and ensures consistency

## 4. Database Update Strategy

### Using Drizzle ORM
We'll use the existing Drizzle setup from `/db/index.ts`:

```typescript
import { db } from "@/db";
import { article, media } from "@/db/schema";
import { eq } from "drizzle-orm";

// Update article cover image
await db.update(article)
  .set({ coverImageUrl: newUploadthingUrl })
  .eq(article.id, articleId);

// Update media URL
await db.update(media)
  .set({ url: newUploadthingUrl })
  .eq(media.id, mediaId);
```

### Transaction Handling
- Each file's database updates will be wrapped in a transaction
- Only commit after successful upload AND verification
- Automatic rollback on any failure during the process
- Continue processing other files even if one fails (with error logging)

## 5. Preservation of Branding Images

### Identification Strategy
Branding images are preserved by design because:
1. They are not stored in the database with `wpId` (used directly in components)
2. OR if stored in media table, they lack `wpId` values
3. Our selection criteria explicitly requires `wpId IS NOT NULL`

### Verification Query
```sql
-- These should return branding images that we want to keep local
SELECT name, url FROM media WHERE wpId IS NULL AND url LIKE '/uploads/%';
```

## 6. Error Handling, Logging & Verification

### Error Handling Approach
- Individual file failures don't stop the entire migration
- Detailed error context captured (file path, database ID, error message)
- Automatic cleanup of partial uploads when possible
- Transaction rollback ensures database consistency

### Logging Structure
```typescript
interface MigrationLogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  context?: {
    filePath?: string;
    articleId?: string;
    mediaId?: string;
    error?: string;
  };
}

// Dual logging to console and file
function log(entry: MigrationLogEntry): void {
  const logLine = `[${entry.timestamp}] [${entry.level}] ${entry.message}`;
  console.log(logLine);
  
  // Also append to migration log file
  appendFileSync(
    "./scripts/migration.log",
    logLine + "\n",
    "utf8"
  );
}
```

### Verification Steps

#### Pre-Upload Checks
1. File existence verification
2. File size validation (default max: 10MB)
3. File type validation (jpeg, png, webp, gif)
4. Read permission check
5. Path safety verification (within public/uploads)

#### Post-Upload Checks
1. Verify UploadThing URL returns successfully (HTTP HEAD request)
2. Confirm URL contains `uploadthing.com` domain
3. Validate URL format matches expected pattern
4. Read-back database verification (confirm update succeeded)

#### Post-Migration Report
Generate summary including:
- Total files processed
- Successful uploads
- Failed uploads (with reasons)
- Total storage migrated
- Average upload time per file
- List of any problematic files

## 7. Implementation Steps

### Phase 0: Prerequisites
1. Ensure UploadThing credentials are set in `.env`:
   ```
   UPLOADTHING_APP_ID=your_app_id
   UPLOADTHING_SECRET=your_secret_key
   ```
2. Install required dependencies:
   ```bash
   bun add uploadthing
   ```
3. Verify database connection works
4. Recommended: Backup database before migration

### Phase 1: Discovery & Preparation
1. Query database for all articles with `wpId IS NOT NULL AND cover_image_url LIKE '/uploads/%'`
2. Query database for all media with `wpId IS NOT NULL AND url LIKE '/uploads/%'`
3. Extract unique local file paths from both result sets
4. Verify each file exists locally and meets validation criteria
5. Group database records by local file path for efficient processing

### Phase 2: Migration Execution
1. Initialize UploadThing client
2. For each unique local file path:
   a. Validate file (existence, size, type, permissions)
   b. Upload file to UploadThing with progress tracking
   c. Store path-to-URL mapping
   c. Update all database records referencing this path
   d. Commit transaction for this batch
   e. Log success/failure details
3. Continue to next file (individual failures don't stop migration)

### Phase 3: Validation & Reporting
1. Perform spot-check of migrated URLs (HEAD requests)
2. Verify branding images still resolve to local paths
3. Generate comprehensive migration report
4. Manual verification of frontend image loading
5. Archive logs and temporary files

### Phase 4: Cleanup
1. Remove temporary files if created
2. Document completion status
3. Provide rollback instructions if needed

## 8. Detailed Implementation Example

```typescript
// scripts/migrate-to-uploadthing.ts
import { UploadThing } from "uploadthing/server";
import { db } from "@/db";
import { article, media } from "@/db/schema";
import { eq, and, like, notNull, isNull } from "drizzle-orm";
import { createReadStream, existsSync, statSync } from "fs";
import { join, dirname, isAbsolute } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

interface MigrationStats {
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  totalSizeMigrated: number;
  startTime: number;
  endTime: number;
}

class UploadThingMigrator {
  private uploadThing: UploadThing;
  private stats: MigrationStats;
  
  constructor() {
    this.uploadThing = new UploadThing();
    this.stats = {
      totalFiles: 0,
      successfulUploads: 0,
      failedUploads: 0,
      totalSizeMigrated: 0,
      startTime: Date.now(),
      endTime: 0
    };
  }
  
  private async getRecordsToMigrate() {
    // Get articles needing migration
    const articles = await db.select()
      .from(article)
      .where(and(
        notNull(article.wpId),
        like(article.coverImageUrl, "/uploads/%")
      ));
    
    // Get media needing migration
    const mediaItems = await db.select()
      .from(media)
      .where(and(
        notNull(media.wpId),
        like(media.url, "/uploads/%")
      ));
    
    return { articles, mediaItems };
  }
  
  private resolveLocalPath(dbPath: string): string {
    // Ensure path starts with /
    const normalizedPath = dbPath.startsWith("/") ? dbPath : `/${dbPath}`;
    
    // Remove leading slash and join with public directory
    const relativePath = normalizedPath.substring(1);
    return join(PUBLIC_DIR, relativePath);
  }
  
  private async validateFile(localPath: string): Promise<{ valid: boolean; error?: string }> {
    // Check if file exists
    if (!existsSync(localPath)) {
      return { valid: false, error: "File does not exist" };
    }
    
    try {
      const stats = statSync(localPath);
      
      // Check file size (default 10MB limit)
      const maxSizeBytes = 10 * 1024 * 1024; // 10MB
      if (stats.size > maxSizeBytes) {
        return { 
          valid: false, 
          error: `File too large: ${stats.size} bytes (max ${maxSizeBytes})` 
        };
      }
      
      // Check file extension (basic validation)
      const ext = localPath.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      if (!ext || !allowedExtensions.includes(ext)) {
        return { 
          valid: false, 
          error: `Invalid file type: .${ext}` 
        };
      }
      
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: `Error accessing file: error.message` 
      };
    }
  }
  
  private async uploadFile(localPath: string): Promise<string> {
    const stream = createReadStream(localPath);
    
    return await this.uploadThing.uploadFile({
      data: stream,
      metadata: {
        source: "wordpress-migration",
        timestamp: new Date().toISOString()
      }
    });
  }
  
  private async updateDatabaseRecords(
    localPath: string,
    uploadthingUrl: string,
    articles: typeof import("@/db/schema").article.$inferSelect[],
    mediaItems: typeof import("@/db/schema").media.$inferSelect[]
  ): Promise<void> {
    // Start transaction
    await db.transaction(async (tx) => {
      // Update articles
      for const article of articles.filter(a => 
        this.resolveLocalPath(a.coverImageUrl) === localPath
      ) {
        await tx.update(article)
          .set({ coverImageUrl: uploadthingUrl })
          .eq(article.id, article.id);
      }
      
      // Update media
      for const mediaItem of mediaItems.filter(m => 
        this.resolveLocalPath(m.url) === localPath
      ) {
        await tx.update(media)
          .set({ url: uploadthingUrl })
          .eq(media.id, mediaItem.id);
      }
    });
  }
  
  async run(): Promise<void> {
    try {
      console.log("🚀 Starting UploadThing migration...");
      
      // 1. Get records to migrate
      const { articles, mediaItems } = await this.getRecordsToMigrate();
      
      // 2. Group by local file path
      const pathGroups = new Map<string, {articles: typeof articles; mediaItems: typeof mediaItems}>();
      
      // Process articles
      for const article of articles {
        const localPath = this.resolveLocalPath(article.coverImageUrl);
        if (!pathGroups.has(localPath)) {
          pathGroups.set(localPath, { articles: [], mediaItems: [] });
        }
        pathGroups.get(localPath)!.articles.push(article);
      }
      
      // Process media
      for const mediaItem of mediaItems {
        const localPath = this.resolveLocalPath(mediaItem.url);
        if (!pathGroups.has(localPath)) {
          pathGroups.set(localPath, { articles: [], mediaItems: [] });
        }
        pathGroups.get(localPath)!.mediaItems.push(mediaItem);
      }
      
      this.stats.totalFiles = pathGroups.size;
      console.log(`📊 Found ${this.stats.totalFiles} unique files to migrate`);
      
      // 3. Process each unique file
      for (const [localPath, group] of pathGroups.entries()) {
        console.log(`📁 Processing: ${localPath}`);
        
        // Validate file
        const validation = await this.validateFile(localPath);
        if (!validation.valid) {
          console.error(`❌ Validation failed for ${localPath}: ${validation.error}`);
          this.stats.failedUploads++;
          continue;
        }
        
        try {
          // Upload to UploadThing
          console.log(`⬆️  Uploading ${localPath}...`);
          const uploadthingUrl = await this.uploadFile(localPath);
          
          // Get file size for stats
          const stats = statSync(localPath);
          this.stats.totalSizeMigrated += stats.size;
          
          // Update database
          console.log(`💾 Updating database references...`);
          await this.updateDatabaseRecords(
            localPath,
            uploadthingUrl,
            group.articles,
            group.mediaItems
          );
          
          console.log(`✅ Successfully migrated ${localPath} → ${uploadthingUrl}`);
          this.stats.successfulUploads++;
          
        } catch (error) {
          console.error(`❌ Failed to migrate ${localPath}: error.message`);
          this.stats.failedUploads++;
        }
      }
      
      // 4. Finalize stats
      this.stats.endTime = Date.now();
      
      // 5. Generate report
      await this.generateReport();
      
    } catch (error) {
      console.error(`💥 Migration failed with fatal error: error.message`);
      throw error;
    }
  }
  
  private async generateReport(): Promise<void> {
    const durationSeconds = ((this.stats.endTime - this.stats.startTime) / 1000).toFixed(2);
    
    console.log("\n📈 Migration Report:");
    console.log("====================");
    console.log(`⏱️  Duration: ${durationSeconds} seconds`);
    console.log(`📁 Total files: ${this.stats.totalFiles}`);
    console.log(`✅ Successful: ${this.stats.successfulUploads}`);
    console.log(`❌ Failed: ${this.stats.failedUploads}`);
    console.log(`💾 Data migrated: ${(this.stats.totalSizeMigrated / (1024*1024)).toFixed(2)} MB`);
    console.log(`⚡️ Avg speed: ${((this.stats.totalSizeMigrated / 1024 / 1024) / (this.stats.endTime - this.stats.startTime) * 1000).toFixed(2)} MB/s`);
    
    // Write report to file
    const report = `
UploadThing Migration Report
========================
Timestamp: ${new Date().toISOString()}
Duration: ${durationSeconds} seconds
Total files: ${this.stats.totalFiles}
Successful uploads: ${this.stats.successfulUploads}
Failed uploads: ${this.stats.failedUploads}
Total size migrated: ${(this.stats.totalSizeMigrated / (1024*1024)).toFixed(2)} MB
Average speed: ${((this.stats.totalSizeMigrated / 1024 / 1024) / (this.stats.endTime - this.stats.startTime) * 1000).toFixed(2)} MB/s
    `.trim();
    
    await Bun.write(join(__dirname, "migration-report.txt"), report);
    console.log(`📄 Detailed report saved to migration-report.txt`);
  }
}

// Run the migrator
const migrator = new UploadThingMigrator();
migrator.run().catch(error => {
  console.error("💥 Migration failed:", error);
  process.exit(1);
});
```

## 9. Configuration Options

### Environment Variables
- `UPLOADTHING_APP_ID`: UploadThing application ID (required)
- `UPLOADTHING_SECRET`: UploadThing secret key (required)
- `MIGRATION_MAX_FILE_SIZE_MB`: Maximum file size in MB (default: 10)
- `MIGRATION_BATCH_SIZE`: Number of DB operations per transaction (default: 100)
- `MIGRATION_CONCURRENCY`: Number of files to process concurrently (default: 3)
- `MIGRATION_SKIP_EXISTING`: Skip files already on UploadThing (default: true)

### Command Line Arguments
```bash
# Basic usage
bun run scripts/migrate-to-uploadthing.ts

# Dry run (show what would be done)
bun run scripts/migrate-to-uploadthing.ts --dry-run

# Verbose logging
bun run scripts/migrate-to-uploadthing.ts --verbose

# Specify custom max file size
bun run scripts/migrate-to-uploadthing.ts --max-size 20
```

## 10. Safety & Rollback Procedures

### Pre-Migration Safety Checks
1. **Database Backup**: Strongly recommended before running
2. **Environment Validation**: Verify UploadThing credentials work
3. **File System Access**: Confirm read access to public/uploads directory
4. **Network Connectivity**: Test UploadThing API accessibility

### Rollback Strategy
Since we never delete local files:
1. **Database Rollback**: Restore database backup if needed
2. **Manual Reversion**: If preferred, run SQL to revert URLs:
   ```sql
   -- Revert article cover images
   UPDATE article 
   SET cover_image_url = REPLACE(cover_image_url, 'https://[your-app-id].uploadthing.com/', '/uploads/')
   WHERE cover_image_url LIKE 'https://%uploadthing.com%';
   
   -- Revert media URLs
   UPDATE media 
   SET url = REPLACE(url, 'https://[your-app-id].uploadthing.com/', '/uploads/')
   WHERE url LIKE 'https://%uploadthing.com%';
   ```
3. **UploadThing Cleanup**: Optionally delete migrated files via UploadThing dashboard

### Idempotency Design
The script can be safely re-run because:
1. It checks if files have already been migrated (by checking if URL contains uploadthing.com)
2. Database updates are idempotent (setting same value multiple times)
3. UploadThing handles duplicate uploads gracefully (returns existing URL)

## 11. Success Criteria

✅ All WordPress-imported images (articles + media) moved to UploadThing  
✅ Database URLs updated to point to UploadThing  
✅ Branding images remain as local `/uploads/` paths  
✅ No broken image links on frontend after migration  
✅ Migration log created with detailed results  
✅ Script handles errors gracefully without stopping entire process  
✅ Performance acceptable for expected volume (~100-500 images)  
✅ Script is idempotent and can be safely re-run  
✅ Comprehensive verification and reporting included  

## 12. Next Steps

1. Review and approve this implementation plan
2. Set up UploadThing credentials in environment
3. Install required dependencies: `bun add uploadthing`
4. Run with `--dry-run` flag to preview actions
5. Execute actual migration
6. Verify results and sign off

This plan provides a complete, production-ready approach to migrating the WordPress images to UploadThing while maintaining data integrity and minimizing downtime.
