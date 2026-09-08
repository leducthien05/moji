import express from "express";
const router = express.Router();
import { authMe, test } from "../controller/user.controller.js";

router.get("/me", authMe);

router.get("/test", test);

export default router;