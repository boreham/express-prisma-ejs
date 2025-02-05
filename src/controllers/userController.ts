import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { User } from '@prisma/client';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = (req.query.sortBy as string) || 'id';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
  const searchQuery = (req.query.search as string) || '';

  // Валидация параметров
  const validPage = page > 0 ? page : 1;
  const validLimit = limit > 0 && limit <= 100 ? limit : 10;

  const data = await userService.getAllUsers(validPage, validLimit, sortBy, sortOrder, searchQuery);

  res.render('users/index', {
    title: 'User List',
    ...data,
  });
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUser(parseInt(req.params.id));
  res.render('users/edit', { 
    title: 'Edit User',
    user 
  });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const userData: Omit<User, 'id'> = req.body;
  await userService.createUser(userData);
  res.redirect('/users');
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const userData: Partial<User> = req.body;
  await userService.updateUser(id, userData);
  res.redirect('/users');
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  await userService.deleteUser(id);
  res.redirect('/users');
};