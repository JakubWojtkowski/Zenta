// Importing the PrismaClient class from the @prisma/client package.
import { PrismaClient } from "@prisma/client";

// Function to create a new instance of PrismaClient.
const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Declaring a custom type for globalThis, which is the global object in a Node.js environment.
// Adding a property `prismaGlobal` to hold the Prisma client instance if it exists.
declare const globalThis: {
    prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Attempting to get the Prisma client instance from `globalThis.prismaGlobal`.
// If it's undefined (i.e., not previously created), it will create a new PrismaClient using the `prismaClientSingleton` function.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Exporting the Prisma client instance for use in other parts of the application.
export default prisma;

// In non-production environments (like development), the Prisma client is stored on `globalThis.prismaGlobal`.
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
