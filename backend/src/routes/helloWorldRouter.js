import express from "express";
import { doNothingController, printHelloWorld, getDataFromFrontend } from "../controllers/hwController.js";
import { get } from "mongoose";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
const hwRouter = express.Router();

hwRouter.get('/', doNothingController);
hwRouter.get('/print', authMiddleWare, printHelloWorld);
hwRouter.post('/getData', getDataFromFrontend);
hwRouter.get('/:productId/:userId/:courseId', getDataFromFrontend);

hwRouter.post('/print', printHelloWorld);
export default hwRouter;

