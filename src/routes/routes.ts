import express from 'express';
import * as auth from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as task from '../controllers/taskController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

router.get('/users', authenticate, authorize(['Admin']), userController.getAllUsers);

router.get('/tasks', authenticate, task.getTasks);
router.post('/tasks', authenticate, authorize(['Admin', 'Manager']), task.createTask);
router.put('/tasks/:id', authenticate, authorize(['Admin', 'Manager']), task.updateTask);
router.delete('/tasks/:id', authenticate, authorize(['Admin']), task.deleteTask);
router.post('/tasks/:id/complete', authenticate, authorize(['User']), task.markComplete);

export default router;