import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { User } from '@prisma/client';

// Валидация email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Общая функция обработки ошибок
const handleValidationError = (res: Response, template: string, errors: string[], data?: any) => {
  res.render(template, {
    title: data?.id ? 'Edit User' : 'Create User',
    errors,
    ...data
  });
};

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
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).render('users/edit', {
      title: 'Edit User',
      errors: ['Invalid user ID'],
      user: null // Передаем null, если пользователь не найден
    });
  }

  const user = await userService.getUser(id);
  if (!user) {
    return res.status(404).render('users/edit', {
      title: 'Edit User',
      errors: ['User not found'],
      user: null // Передаем null, если пользователь не найден
    });
  }

  res.render('users/edit', {
    title: 'Edit User',
    errors: [], // Передаем пустой массив, если ошибок нет
    user // Передаем найденного пользователя
  });
};
export const showCreateUser = (req: Request, res: Response): void => {
  res.render('users/create', {
    title: 'Create New User',
    errors: [], // Передаем пустой массив, если ошибок нет
    name: '',
    email: ''
  });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;
  const errors: string[] = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!email || !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    return res.render('users/create', {
      title: 'Create New User',
      errors,
      name,
      email
    });
  }

  try {
    await userService.createUser({ name, email });
    res.redirect('/users');
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.render('users/create', {
        title: 'Create New User',
        errors: ['Email already exists'],
        name,
        email
      });
    } else {
      res.status(500).render('users/create', {
        title: 'Create New User',
        errors: ['Server error']
      });
    }
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body;
  const errors: string[] = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!email || !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    return res.render('users/edit', {
      title: 'Edit User',
      errors, // Передаем массив ошибок
      user: { id, name, email } // Передаем текущие данные пользователя
    });
  }

  try {
    const updatedUser = await userService.updateUser(id, { name, email });
    res.redirect('/users');
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.render('users/edit', {
        title: 'Edit User',
        errors: ['Email already exists'], // Передаем ошибку
        user: { id, name, email } // Передаем текущие данные пользователя
      });
    } else if (error.code === 'P2025') {
      res.status(404).render('users/edit', {
        title: 'Edit User',
        errors: ['User not found'], // Передаем ошибку
        user: null // Передаем null, если пользователь не найден
      });
    } else {
      res.status(500).render('users/edit', {
        title: 'Edit User',
        errors: ['Server error'], // Передаем ошибку
        user: { id, name, email } // Передаем текущие данные пользователя
      });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    await userService.deleteUser(id);
    res.redirect('/users');
  } catch (error) {
    res.status(500).send('Server error');
  }
};