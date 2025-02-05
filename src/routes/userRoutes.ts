import { Router } from 'express';
import { 
  getUsers, 
  getUser,
  showCreateUser,  
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/create', showCreateUser);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/:id', updateUser);
router.post('/:id/delete', deleteUser);

export default router;