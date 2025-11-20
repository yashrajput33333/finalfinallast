import express from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/patient.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes require authentication and patient role
router.use(verifyJWT);
router.use(authorize('patient'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile',createProfile);
export default router;
