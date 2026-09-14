import express from "express";
import { sendDirectMessage, sendGroupMessage } from "../controller/message.controller.js";
import { checkFriend, checkGroup } from "../middleware/friend.middleware.js";
const router = express.Router();

router.post("/direct", checkFriend, sendDirectMessage);

router.post("/group", checkGroup, sendGroupMessage);

export default router;