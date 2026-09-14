import express from "express";
import { createConversation, getConversation, getMessage } from "../controller/conversation.controller.js";
import { checkFriend } from "../middleware/friend.middleware.js";

const router = express.Router();

router.post("/", checkFriend, createConversation);

router.get("/", getConversation);

router.get("/:conversationId/message", checkFriend, getMessage);

export default router;