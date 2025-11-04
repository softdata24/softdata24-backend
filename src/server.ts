import express, { type Application, type Request, type Response, type NextFunction } from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

import { connectDB } from "./config/db.config";
connectDB();

import { mailTransporter } from "./config/mailer.config";
import { errorHandler } from "@middlewares/errorHandler.middleware";

mailTransporter.verify((error, success) => {
  if (error) {
    console.error("Mail transporter error:", error);
  } else {
    console.log("Mail server is ready to send messages ✔️");
  }
});

import v1_user_routes from "./routes/v1.routes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Allow frontend origin
app.use(cors({
  origin: [
    "http://localhost:5173",    // Vite default port
    "http://localhost:3000",    // Create React App default port
    "http://localhost:3001",    // Alternative CRA port
    "http://localhost:8080",    // Webpack dev server
    "http://localhost:8000",    // Alternative dev server
    "http://localhost:8081",    // Alternative dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8081",
    "https://softdata24.com",
    "https://www.softdata24.com",
    "https://softdata24.com/"
  ],
  credentials: true,                // if you want to send cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parse JSON
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.use((req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl } = req;
  console.log("Request body", req.body);
  console.log("Request Query", req.query);
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
  next();
})

app.use("/api/v1", v1_user_routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
