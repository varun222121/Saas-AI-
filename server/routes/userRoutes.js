import express from 'express';
import { getPublishCreations, getUserCreations, toggleLikeCreation } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/get-user-creation', auth, getUserCreations);
userRouter.get('/get-published-creation', auth, getPublishCreations);
userRouter.post('/toggle-like-creation', auth, toggleLikeCreation);

export default userRouter;