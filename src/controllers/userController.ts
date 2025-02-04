import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { User } from '@prisma/client';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();
  res.render('users/index', { 
    title: 'User List', 
    users 
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