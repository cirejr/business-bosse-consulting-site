import { config } from 'dotenv';
config();

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

console.log('Testing drizzle database connection...');

try {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  // Test a simple query
  const result = await sql`SELECT 1 as test`;
  console.log('Database connection successful!');
  console.log('Test query result:', result);
} catch (error) {
  console.error('Database connection failed:', error.message);
  console.error('Error stack:', error.stack);
}