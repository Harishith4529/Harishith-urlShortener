// src/routes/userRouter.js (or .ts)\
import { Router } from 'express';
import { get } from 'mongoose';
import { getProfileOfUser } from '../controllers/userController.js';


const userRouter = Router();

userRouter.get('/me', getProfileOfUser);

export default userRouter;