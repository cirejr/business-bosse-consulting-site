require('dotenv').config({ path: './.env' });

const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function checkImages() {
  console.log('Checking database for blog post and seminar images...\n');
  
  // Check article table for cover images
  const articles = await sql`
    SELECT id, title, wp_id, cover_image_url 
    FROM article 
    WHERE wp_id IS NOT NULL AND cover_image_url LIKE '/uploads/%'
  `;
  
  console.log(`Found ${articles.length} articles with cover images:`);
  for (const article of articles) {
    console.log(`- ${article.title}`);
    console.log(`  WP ID: ${article.wp_id}`);
    console.log(`  Cover Image URL: ${article.cover_image_url}`);
    console.log('');
  }
  
  // Check media table for specific images
  const mediaItems = await sql`
    SELECT id, name, url, wp_id, type, size
    FROM media 
    WHERE wp_id IN (494, 495, 500, 826)
  `;
  
  console.log(`Found ${mediaItems.length} media records for target WP IDs:`);
  for (const media of mediaItems) {
    console.log(`- ${media.name}`);
    console.log(`  WP ID: ${media.wp_id}`);
    console.log(`  URL: ${media.url}`);
    console.log(`  Type: ${media.type}`);
    console.log(`  Size: ${media.size} bytes`);
    console.log('');
  }
  
  // Check if the actual files exist
  const fs = require('fs');
  const path = require('path');
  
  const filesToCheck = [
    '../public/uploads/2023/10/planifier-epargne-argent-pour-acheter-maison.jpg',
    '../public/uploads/2023/10/afl-audit-conseil.jpeg',
    '../public/uploads/2023/10/jeune-homme-affaires-travaillant-au-bureau.jpg',
    '../public/uploads/2025/05/Navy-and-White-Modern-Minimalist-Business-Conference-Poster.png'
  ];
  
  console.log('Checking if files exist locally:');
  for (const filePath of filesToCheck) {
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✓' : '✗'} ${filePath}`);
  }
}

checkImages().catch(console.error);