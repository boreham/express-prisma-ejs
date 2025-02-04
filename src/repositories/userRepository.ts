import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  return prisma.user.create({
    data: userData,
  });
};

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
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