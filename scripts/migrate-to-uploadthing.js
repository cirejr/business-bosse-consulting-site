require('dotenv').config({ path: '../.env' });

const { eq, and, isNotNull, like } = require('drizzle-orm');
const { stat, readdir } = require('fs/promises');
const { join, isAbsolute, resolve, sep } = require('path');
const { existsSync, createReadStream, unlink } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

// Import UploadThing
const { createUploadthing } = require("uploadthing/server");

// Import db and schema
const { db } = require('../dist/db/index.js');
const { article, media } = require('../dist/db/schema.js');

// Initialize UploadThing
const uploadThing = createUploadthing({
  // Will automatically read from process.env:
  // UPLOADTHING_APP_ID
  // UPLOADTHING_SECRET
});

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const pump = promisify(pipeline);

// Configuration
const configOptions = {
  batchSize: parseInt(process.env.MIGRATION_BATCH_SIZE || '10'),
  maxFileSizeMB: parseInt(process.env.MIGRATION_MAX_FILE_SIZE || '10'),
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  dryRun: process.env.MIGRATION_DRY_RUN === 'true' || false,
  verbose: process.env.MIGRATION_VERBOSE === 'true' || false
};

// Logging helper
function log(level, message, details = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  
  if (details && configOptions.verbose) {
    console.log('  Details:', JSON.stringify(details, null, 2));
  }
}

// Get the actual file path from a database URL like /uploads/2023/10/image.jpg
function getLocalFilePath(dbUrl) {
  if (!dbUrl.startsWith('/uploads/')) {
    throw new Error(`URL does not start with /uploads/: ${dbUrl}`);
  }
  
  // Remove leading slash and prepend public/uploads directory
  const relativePath = dbUrl.substring(1); // Remove leading /
  return join('../public', relativePath); // Results in ../public/uploads/2023/10/image.jpg
}

// Validate file before upload
async function validateFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  
  const stats = await stat(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);
  
  if (fileSizeMB > configOptions.maxFileSizeMB) {
    throw new Error(`File too large: ${fileSizeMB.toFixed(2)} MB (max: ${configOptions.maxFileSizeMB} MB)`);
  }
  
  // Simple extension-based type checking (could be enhanced with file-type detection)
  const extension = filePath.split('.').pop().toLowerCase();
  const mimeTypeMap = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  
  const mimeType = mimeTypeMap[extension];
  if (!mimeType || !configOptions.allowedTypes.includes(mimeType)) {
    throw new Error(`Unsupported file type: .${extension}`);
  }
  
  return { size: stats.size, mimeType };
}

// Upload file to UploadThing
async function uploadFileToUploadThing(filePath, fileName) {
  if (configOptions.dryRun) {
    log('WARN', 'DRY RUN MODE: Would upload file', { filePath, fileName });
    // Return a simulated URL
    return `https://utfs.io/f/dry-run-${Date.now()}-${encodeURIComponent(fileName)}`;
  }
  
  try {
    log('INFO', `Starting upload: ${fileName}`);
    
    // Create readable stream from file
    const stream = createReadStream(filePath);
    
    // Upload to UploadThing with metadata
    const result = await uploadThing.uploadFile({
      data: stream,
      // Add metadata for tracking
      metadata: {
        source: 'wordpress-migration',
        timestamp: new Date().toISOString(),
        originalPath: filePath
      }
    });
    
    log('INFO', `Upload completed: ${fileName}`, { url: result.url });
    return result.url;
  } catch (error) {
    log('ERROR', `Upload failed: ${fileName}`, { error: error.message });
    throw error;
  }
}

// Update database record with new URL
async function updateMediaUrl(mediaId, newUrl) {
  if (configOptions.dryRun) {
    log('WARN', 'DRY RUN MODE: Would update media URL', { mediaId, newUrl });
    return;
  }
  
  await db.update(media)
    .set({ url: newUrl })
    .eq(media.id, mediaId);
    
  log('INFO', `Updated media URL in DB`, { mediaId, newUrl });
}

async function updateArticleCoverImageUrl(articleId, newUrl) {
  if (configOptions.dryRun) {
    log('WARN', 'DRY RUN MODE: Would update article cover image URL', { articleId, newUrl });
    return;
  }
  
  await db.update(article)
    .set({ coverImageUrl: newUrl })
    .eq(article.id, articleId);
    
  log('INFO', `Updated article cover image URL in DB`, { articleId, newUrl });
}

// Verify that a URL is accessible (basic check)
async function verifyUrl(url) {
  if (configOptions.dryRun) {
    log('WARN', 'DRY RUN MODE: Would verify URL', { url });
    return true;
  }
  
  try {
    // We'll do a simple check - in production you might want to fetch the URL
    // For now, just verify it looks like an UploadThing URL
    return url.includes('uploadthing.com') || url.includes('utfs.io');
  } catch (error) {
    log('WARN', `URL verification failed: ${url}`, { error: error.message });
    return false;
  }
}

// Main migration function
async function migrateImagesToUploadThing() {
  log('INFO', 'Starting UploadThing migration process', configOptions);
  
  // Fetch articles with cover images that need migration
  const articlesToMigrate = await db.select()
    .from(article)
    .where(and(
      isNotNull(article.wpId),
      like(article.coverImageUrl, '/uploads/%')
    ));
  
  log('INFO', `Found ${articlesToMigrate.length} articles with cover images to migrate`);
  
  // Fetch media items that need migration
  const mediaToMigrate = await db.select()
    .from(media)
    .where(and(
      isNotNull(media.wpId),
      like(media.url, '/uploads/%')
    ));
  
  log('INFO', `Found ${mediaToMigrate.length} media items to migrate`);
  
  // Process articles
  let processedArticles = 0;
  let failedArticles = 0;
  
  for (const articleItem of articlesToMigrate) {
    try {
      log('INFO', `Processing article: ${articleItem.title}`, { 
        articleId: articleItem.id,
        wpId: articleItem.wpId,
        currentUrl: articleItem.coverImageUrl
      });
      
      // Get local file path
      const localPath = getLocalFilePath(articleItem.coverImageUrl);
      
      // Validate file
      await validateFile(localPath);
      
      // Extract filename for upload
      const fileName = localPath.split('/').pop();
      
      // Upload to UploadThing
      const uploadUrl = await uploadFileToUploadThing(localPath, fileName);
      
      // Verify the upload URL
      const isValidUrl = await verifyUrl(uploadUrl);
      if (!isValidUrl) {
        throw new Error(`Uploaded URL doesn't appear to be valid: ${uploadUrl}`);
      }
      
      // Update database
      await updateArticleCoverImageUrl(articleItem.id, uploadUrl);
      
      processedArticles++;
      
      // Small delay to avoid rate limiting
      await sleep(200);
    } catch (error) {
      log('ERROR', `Failed to process article ${articleItem.id}: ${articleItem.title}`, { 
        error: error.message,
        articleId: articleItem.id,
        wpId: articleItem.wpId
      });
      failedArticles++;
    }
  }
  
  // Process media items
  let processedMedia = 0;
  let failedMedia = 0;
  
  for (const mediaItem of mediaToMigrate) {
    try {
      log('INFO', `Processing media item: ${mediaItem.name}`, { 
        mediaId: mediaItem.id,
        wpId: mediaItem.wpId,
        currentUrl: mediaItem.url
      });
      
      // Get local file path
      const localPath = getLocalFilePath(mediaItem.url);
      
      // Validate file
      await validateFile(localPath);
      
      // Extract filename for upload
      const fileName = localPath.split('/').pop();
      
      // Upload to UploadThing
      const uploadUrl = await uploadFileToUploadThing(localPath, fileName);
      
      // Verify the upload URL
      const isValidUrl = await verifyUrl(uploadUrl);
      if (!isValidUrl) {
        throw new Error(`Uploaded URL doesn't appear to be valid: ${uploadUrl}`);
      }
      
      // Update database
      await updateMediaUrl(mediaItem.id, uploadUrl);
      
      processedMedia++;
      
      // Small delay to avoid rate limiting
      await sleep(200);
    } catch (error) {
      log('ERROR', `Failed to process media item ${mediaItem.id}: ${mediaItem.name}`, { 
        error: error.message,
        mediaId: mediaItem.id,
        wpId: mediaItem.wpId
      });
      failedMedia++;
    }
  }
  
  // Summary
  log('INFO', 'Migration Summary', {
    articles: {
      processed: processedArticles,
      failed: failedArticles,
      total: articlesToMigrate.length
    },
    media: {
      processed: processedMedia,
      failed: failedMedia,
      total: mediaToMigrate.length
    },
    totalProcessed: processedArticles + processedMedia,
    totalFailed: failedArticles + failedMedia
  });
  
  if (failedArticles === 0 && failedMedia === 0) {
    log('INFO', '✅ Migration completed successfully!');
  } else {
    log('WARN', `⚠️  Migration completed with ${failedArticles + failedMedia} failures`);
  }
}

// Run the migration
migrateImagesToUploadThing()
  .catch((error) => {
    log('ERROR', 'Migration failed', { error: error.message });
    process.exit(1);
  });