import { Conversation } from "../models/conversationModel.js";
import TryCatch from "../utils/TryCatch.js";

// Create a new conversation
export const createConversation = TryCatch(async (req, res) => {
  const { userId } = req.body;
  const loggedInUserId = req.user.id; // Assuming you have user authentication in place

  // Check if the conversation already exists
  const existingConversation = await Conversation.findOne({
    participants: { $all: [loggedInUserId, userId] },
  });

  if (existingConversation) {
    return res.status(200).json(existingConversation);
  }

  // Create a new conversation if it doesn't exist
  const newConversation = new Conversation({
    participants: [loggedInUserId, userId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all conversations of a user
export const getUserConversations = TryCatch(async (req, res) => {
    try {
        const conversations = await Conversation.find({
          participants: req.params.userId,
        })
        .populate('participants', 'firstName lastName profilePicture') // Populate participants with relevant fields
        .populate('lastMessage'); // Optionally populate lastMessage if needed
    
        res.json(conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).send('Server Error');
      }
});
