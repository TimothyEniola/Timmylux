import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Initialize the PostgreSQL connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Wrap it in the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate PrismaClient with both the adapter and your logging configuration
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;