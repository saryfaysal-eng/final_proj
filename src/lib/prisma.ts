import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

const adapter = new PrismaNeonHttp(connectionString, {});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

import { neonConfig } from "@neondatabase/serverless";

neonConfig.fetchFunction = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(30000),
  });
};
