import { Router } from "express";
import { loginWithGoogle } from "../controllers/authController.js";

const authRouter = Router();
authRouter.post('/google', loginWithGoogle);

export default authRouter;