import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-prisma';

export const prisma = mockDeep<PrismaClient>();
export type PrismaMock = DeepMockProxy<PrismaClient>;
