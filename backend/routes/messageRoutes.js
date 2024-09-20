import express from "express";
import { sendMessage, getConversationMessages, deleteMessage } from "../controllers/messageControllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Send a message
router.post("/:conversationId", isAuth, sendMessage);

// Get all messages of a conversation
router.get("/:conversationId", isAuth, getConversationMessages);
router.delete('/:conversationId/:messageId', isAuth, deleteMessage);


export default router;
