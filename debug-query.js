require('dotenv').config({ path: './.env' });

const { eq, and, isNotNull, like } = require('drizzle-orm');

// Import db and schema
const { db } = require('./dist/db/index.js');
const { article } = require('./dist/db/schema.js');

async function debugQuery() {
  try {
    console.log('Testing database connection...');
    
    // Simple test query
    const testResult = await db.select().from(article).limit(1);
    console.log('Test query successful, found', testResult.length, 'articles');
    
    // Now try our specific query
    console.log('Testing specific query...');
    const result = await db.select()
      .from(article)
      .where(and(
        isNotNull(article.wpId),
        like(article.coverImageUrl, '/uploads/%')
      ));
      
    console.log('Specific query successful, found', result.length, 'articles');
    for (const article of result) {
      console.log(`- ${article.title} (WP ID: ${article.wpId})`);
    }
  } catch (error) {
    console.error('Query failed:', error);
    console.error('Error stack:', error.stack);
  }
}

debugQuery();