import express from "express";
import {
  createConversation,
  getUserConversations,
} from "../controllers/conversationControllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Create a new conversation
router.post("/", isAuth, createConversation);

// Get all conversations for a user
router.get("/:userId", isAuth, getUserConversations);

export default router;
