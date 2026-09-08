import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/database.js';
import router from './router/index.router.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Router
router(app);

// Listening
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
