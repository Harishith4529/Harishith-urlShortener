import { Router } from "express";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
import { createShortURL, redirectToOriginalUrl } from "../controllers/shortUrlController.js";

const shortURLRouter = Router();

shortURLRouter.post("/", authMiddleWare, createShortURL);
shortURLRouter.get("/:shortCode", redirectToOriginalUrl);

export default shortURLRouter;