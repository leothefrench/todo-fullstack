import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

// 1. On crée la connexion spécifique à Neon via WebSocket/HTTP
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// 2. On crée l'adaptateur qui fait le pont entre Prisma et Neon
const adapter = new PrismaNeon(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 3. On passe l'adapter au constructeur de PrismaClient
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,         // C'est l'ajout CRUCIAL ici
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;