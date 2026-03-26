import { PrismaClient } from '@prisma/client';

// On définit le type pour l'objet global pour éviter l'erreur "Cannot find name 'global'"
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// On récupère l'instance existante ou on en crée une nouvelle
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// En développement, on stocke l'instance pour le HMR (ton fameux problème de connexions)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;