import express from 'express';
const router = express.Router();
import { signup, signin, signout } from '../controller/auth.controller.js';
    
router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', signout);
export default router;