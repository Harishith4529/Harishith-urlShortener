import { Router } from "express";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
import { createShortURL } from "../controllers/shortUrlController.js";

const shortURLRouter = Router();

shortURLRouter.post("/", authMiddleWare, createShortURL);

export default shortURLRouter;
