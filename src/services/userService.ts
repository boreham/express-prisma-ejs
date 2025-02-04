import * as userRepository from '../repositories/userRepository';
import { User } from '@prisma/client';

export const getAllUsers = async (): Promise<User[]> => {
  return userRepository.getUsers();
};

export const getUser = async (id: number): Promise<User | null> => {
  return userRepository.getUserById(id);
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  return userRepository.createUser(userData);
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  return userRepository.updateUser(id, userData);
};

export const deleteUser = async (id: number): Promise<void> => {
  await userRepository.deleteUser(id);
};