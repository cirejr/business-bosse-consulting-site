require('dotenv').config({ path: './.env' });

const { eq, and, isNotNull, like } = require('drizzle-orm');
const { stat } = require('fs/promises');
const { join } = require('path');
const { existsSync } = require('fs');

// Import UploadThing
const { UTApi } = require("uploadthing/server");

// Initialize UploadThing API
const utapi = new UTApi();

// Import db and schema
const { db } = require('../dist/db/index.js');
const { article, media } = require('../dist/db/schema.js');

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// Get the actual file path from WordPress metadata
async function getFilePathFromWpId(wpId, metaMap) {
  // Get the _wp_attached_file meta value
  const attachedFile = metaMap.get(wpId)?.get("_wp_attached_file");
  
  if (!attachedFile) {
    throw new Error(`No _wp_attached_file found for WP ID ${wpId}`);
  }
  
  // Construct the full path
  return join('./public/uploads', attachedFile);
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
  
  // Simple extension-based type checking
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
    
    // Read file as buffer
    const fileBuffer = require('fs').readFileSync(filePath);
    
    // Determine content type from extension
    const ext = fileName.split('.').pop().toLowerCase();
    const contentTypeMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml'
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    // Create a File-like object using UTFile
    const { UTFile } = require('uploadthing/server');
    const utFile = new UTFile([fileBuffer], fileName, { type: contentType });
    
    // Upload to UploadThing
    const result = await utapi.uploadFiles([utFile]);
    
    if (result[0].error) {
      throw new Error(result[0].error.message);
    }
    
    const uploadUrl = result[0].data.ufsUrl;
    log('INFO', `Upload completed: ${fileName}`, { url: uploadUrl });
    return uploadUrl;
  } catch (error) {
    log('ERROR', `Upload failed: ${fileName}`, { error: error.message, stack: error.stack });
    throw error;
  }
}

// Update database record with new URL
async function updateMediaUrl(mediaId, newUrl) {
  if (configOptions.dryRun) {
    log('WARN', 'DRY RUN MODE: Would update media URL', { mediaId, newUrl });
    return;
  }
  
  try {
    await db.update(media)
      .set({ url: newUrl })
      .where(eq(media.id, mediaId));
    
    log('INFO', `Updated media URL in DB`, { mediaId, newUrl });
  } catch (error) {
    log('ERROR', `Database update failed for media`, { error: error.message, stack: error.stack, mediaId, newUrl });
    throw error;
  }
}

async function updateArticleCoverImageUrl(articleId, newUrl) {
  if (configOptions.dryRun) {
    log('WARN', 'DRY RUN MODE: Would update article cover image URL', { articleId, newUrl });
    return;
  }
  
  try {
    const result = await db.update(article)
      .set({ coverImageUrl: newUrl })
      .where(eq(article.id, articleId));
    
    log('INFO', `Updated article cover image URL in DB`, { articleId, newUrl, result });
  } catch (error) {
    log('ERROR', `Database update failed`, { error: error.message, stack: error.stack, articleId, newUrl });
    throw error;
  }
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
    const isValid = url.includes('uploadthing.com') || url.includes('utfs.io') || url.includes('uploadthing.io') || url.includes('ufs.sh');
    log('DEBUG', `URL verification: ${url} -> ${isValid}`);
    return isValid;
  } catch (error) {
    log('WARN', `URL verification failed: ${url}`, { error: error.message });
    return false;
  }
}

// Main migration function
async function migrateImagesToUploadThing() {
  log('INFO', 'Starting UploadThing migration process', configOptions);
  
  // We need to get the metadata map to find _wp_attached_file values
  // For now, let's work with what we know from the SQL dump analysis
  
  // Fetch articles with cover images that need migration
  const articlesToMigrate = await db.select()
    .from(article)
    .where(and(
      isNotNull(article.wpId),
      like(article.coverImageUrl, '/uploads/%')
    ));
  
  log('INFO', `Found ${articlesToMigrate.length} articles with cover images to migrate`);
  
  // Only process the 4 essential media items that are needed for blog posts
  // Skip all other media items (they're unused WooCommerce/old branding images)
  const relevantWpIds = [494, 495, 500, 826];
  
  // Get only the media items we need
  const filteredMedia = await db.select()
    .from(media)
    .where(and(
      isNotNull(media.wpId),
      like(media.url, '/uploads/%')
    ));
  
  const finalMediaList = filteredMedia.filter(m => relevantWpIds.includes(m.wpId));
  log('INFO', `Found ${finalMediaList.length} relevant media items to migrate`);
  
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
      
      // For articles, we need to get the featured image from meta
      // Let's handle this by checking if we know the WP ID mapping
      const wpIdToFeaturedImageMap = {
        576: '2023/10/planifier-epargne-argent-pour-acheter-maison.jpg',
        578: '2023/10/afl-audit-conseil.jpeg',
        580: '2023/10/jeune-homme-affaires-travaillant-au-bureau.jpg'
      };
      
      let localPath;
      if (wpIdToFeaturedImageMap[articleItem.wpId]) {
        localPath = join('./public/uploads', wpIdToFeaturedImageMap[articleItem.wpId]);
      } else {
        // Fallback to using the coverImageUrl (might be missing extension)
        localPath = getLocalFilePath(articleItem.coverImageUrl);
      }
      
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
      
      log('INFO', `About to update article with URL: ${uploadUrl}`);
      
      // Update database
      await updateArticleCoverImageUrl(articleItem.id, uploadUrl);
      
      processedArticles++;
      
      // Small delay to avoid rate limiting
      await sleep(200);
    } catch (error) {
      log('ERROR', `Failed to process article ${articleItem.id}: ${articleItem.title}`, { 
        error: error.message,
        stack: error.stack,
        articleId: articleItem.id,
        wpId: articleItem.wpId
      });
      failedArticles++;
    }
  }
  
  // Process media items
  let processedMedia = 0;
  let failedMedia = 0;
  
  // Known mappings from our analysis
  const wpIdToFilePathMap = {
    494: '2023/10/planifier-epargne-argent-pour-acheter-maison.jpg',
    495: '2023/10/afl-audit-conseil.jpeg',
    500: '2023/10/jeune-homme-affaires-travaillant-au-bureau.jpg',
    826: '2025/05/Navy-and-White-Modern-Minimalist-Business-Conference-Poster.png'
  };
  
  for (const mediaItem of finalMediaList) {
    try {
      log('INFO', `Processing media item: ${mediaItem.name}`, { 
        mediaId: mediaItem.id,
        wpId: mediaItem.wpId,
        currentUrl: mediaItem.url
      });
      
      // Use our known mapping
      const relativePath = wpIdToFilePathMap[mediaItem.wpId];
      if (!relativePath) {
        log('WARN', `No known file path for WP ID ${mediaItem.wpId}, skipping`, { 
          mediaId: mediaItem.id,
          wpId: mediaItem.wpId
        });
        failedMedia++;
        continue;
      }
      
      const localPath = join('./public/uploads', relativePath);
      
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
        stack: error.stack,
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
      total: finalMediaList.length
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