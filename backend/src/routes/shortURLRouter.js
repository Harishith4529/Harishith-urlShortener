import { Router } from "express";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
import { createShortURL, redirectToOriginalUrl, updateShortURLController,deleteShortURLController } from "../controllers/shortUrlController.js";

const shortURLRouter = Router();

shortURLRouter.post("/", authMiddleWare, createShortURL);
shortURLRouter.get("/:shortCode", redirectToOriginalUrl);
shortURLRouter.patch("/:shortURL", updateShortURLController);
shortURLRouter.delete("/:shortURL", deleteShortURLController);

export default shortURLRouter;