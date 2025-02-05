import * as userRepository from '../repositories/userRepository';
import { User } from '@prisma/client';

export const getAllUsers = async (
  page: number,
  limit: number,
  sortBy: string = 'id',
  sortOrder: 'asc' | 'desc' = 'asc',
  searchQuery: string = ''
): Promise<{
  users: User[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}> => {
  const skip = (page - 1) * limit;

  const [users, total] = searchQuery
    ? await Promise.all([
        userRepository.searchUsers(searchQuery, skip, limit, sortBy, sortOrder),
        userRepository.searchUsersCount(searchQuery),
      ])
    : await Promise.all([
        userRepository.getUsers(skip, limit, sortBy, sortOrder),
        userRepository.getUsersCount(),
      ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    total,
    totalPages,
    currentPage: page,
    limit,
    sortBy,
    sortOrder,
    searchQuery,
  };
};

export const getUser = async (id: number): Promise<User | null> => {
  return userRepository.getUserById(id);
};

export const createUser = async (userData: { name: string; email: string }): Promise<User> => {
  return userRepository.createUser(userData);
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  return userRepository.updateUser(id, userData);
};

export const deleteUser = async (id: number): Promise<void> => {
  await userRepository.deleteUser(id);
};