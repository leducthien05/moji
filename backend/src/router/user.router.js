import express from "express";
const router = express.Router();
import { authMe } from "../controller/user.controller.js";

router.get("/me", authMe);

export default router;