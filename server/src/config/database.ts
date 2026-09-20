import * as PrismaClientModule from '@prisma/client';

const PrismaClient = (PrismaClientModule as unknown as {
  PrismaClient: new (options?: { log?: string[] }) => InstanceType<
    typeof PrismaClientModule extends { PrismaClient: infer T } ? T : never
  >;
}).PrismaClient;

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;