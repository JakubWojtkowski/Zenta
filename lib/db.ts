import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    const prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = new PrismaClient({ datasources: {db: {url: "postgresql://postgres:password@localhost:5432/dev-db"}} });

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;