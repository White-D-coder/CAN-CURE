import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
dotenv.config();  // load .env

// Direct DB adapter (example)
export const prisma = new PrismaClient({
  adapter: {
    url: process.env.DATABASE_URL,
  },
})

// OR, if using Prisma Accelerate:
// export const prisma = new PrismaClient({ accelerateUrl: process.env.PRISMA_ACCELERATE_URL })

