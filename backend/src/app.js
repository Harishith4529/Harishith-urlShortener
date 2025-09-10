import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"; // Import morgan
import connectDB from "./db/dbConnect.js";
import { config } from "./config.js";
import authRouter from "./routes/authRouter.js";
const app = express();

// middlewares

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Be explicit
  credentials: true, // This is very often the fix for auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev")); // Add morgan here for request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();



app.use("/api/auth", authRouter);


app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/*name", (req, res) => { res.sendFile(path.join(__dirname, "../../frontend/dist/index.html")) });

app.listen(config.PORT, () => console.log(`Server on PORT: ${config.PORT}`));
