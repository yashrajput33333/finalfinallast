import express from 'express';
import { 
  addGoal, 
  getGoals, 
  updateGoal, 
  deleteGoal,
  getGoalSummary 
} from '../controllers/goal.controller.js';
import { authorize } from '../middlewares/role.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication and patient role
router.use(verifyJWT);
router.use(authorize('patient'));

router.post('/', addGoal);
router.get('/', getGoals);
router.get('/summary', getGoalSummary);
router.put('/:goalId', updateGoal);
router.delete('/:goalId', deleteGoal);

export default router;
