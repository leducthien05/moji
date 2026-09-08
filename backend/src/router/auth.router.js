import express from 'express';
const router = express.Router();
import { signup, signin, signout, refresh } from '../controller/auth.controller.js';
    
router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', signout);

router.post("/refresh", refresh);

export default router;