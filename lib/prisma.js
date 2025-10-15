// import { PrismaClient } from "@/lib/generated/prisma";

// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prisma = db;
// }

// // globalThis.prisma: This global variable ensures that the Prisma client instance is
// // reused across hot reloads during development. Without this, each time your application
// // reloads, a new instance of the Prisma client would be created, potentially leading
// // to connection issues.



import { PrismaClient } from "@/lib/generated/prisma";

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// ✅ Explanation:
// globalThis.prisma ensures that the Prisma client is reused during hot reloads in development,
// avoiding "too many connections" errors.
