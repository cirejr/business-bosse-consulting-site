require('dotenv').config();

const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

try {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  // Test a simple query
  const result = sql`SELECT 1 as test`;
  console.log('Database connection successful!');
  console.log('Test query result:', result);
} catch (error) {
  console.error('Database connection failed:', error.message);
}