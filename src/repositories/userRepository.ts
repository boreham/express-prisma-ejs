import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const searchUsers = async (
  query: string,
  skip: number,
  take: number,
  sortBy: string = 'id',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<User[]> => {
  // Валидные поля для сортировки
  const validSortFields = ['id', 'name', 'email', 'createdAt'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';

  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    skip,
    take,
    orderBy: {
      [sortField]: sortOrder,
    },
  });
};

export const searchUsersCount = async (query: string): Promise<number> => {
  return prisma.user.count({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
};

export const createUser = async (userData: { name: string; email: string }): Promise<User> => {
  return prisma.user.create({
    data: {
      ...userData,
      createdAt: new Date(), // Добавляем createdAt
      updatedAt: new Date(), // Добавляем updatedAt
    },
  });
};

export const getUsers = async (
  skip: number,
  take: number,
  sortBy: string = 'id',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<User[]> => {
  // Валидные поля для сортировки
  const validSortFields = ['id', 'name', 'email', 'createdAt'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';

  return prisma.user.findMany({
    skip,
    take,
    orderBy: {
      [sortField]: sortOrder,
    },
  });
};

export const getUsersCount = async (): Promise<number> => {
  return prisma.user.count();
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: { id },
  });
};