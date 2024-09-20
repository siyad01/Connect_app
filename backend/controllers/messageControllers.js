import { Message } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModel.js";
import { Notification } from "../models/notificationModel.js";
import TryCatch from "../utils/TryCatch.js";

// Send a message
export const sendMessage = TryCatch(async (req, res) => {
  const { conversationId } = req.params;
  const { sender, content } = req.body;

  if (!content || !conversationId) {
    return res
      .status(400)
      .json({ error: "Content and conversationId are required" });
  }

  try {
    const newMessage = await Message.create({
      sender,
      content,
      conversationId,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "profilePicture firstName lastName email"
    );

    const conversation = await Conversation.findById(conversationId).populate(
      "participants",
      "profilePicture firstName lastName email"
    );

    const recipient = conversation.participants.find(
      (participant) => participant._id.toString() !== sender.toString()
    );


    if (recipient) {
      try {
        const newNotification = await Notification.create({
          recipient: recipient._id,
          sender: sender,
          type: "message", // Include the type of notification
          message: `You have a new message from ${populatedMessage.sender.firstName}`,
          messageId: newMessage._id, // Reference to the message
        });

      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Server Error");
  }
});

// Get messages of a conversation
export const getConversationMessages = TryCatch(async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "firstName lastName profilePicture"); // Populate sender details

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Server Error");
  }
});

export const deleteMessage = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const userId = req.user._id; // Extracted from authentication middleware

    // Find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the message belongs to the authenticated user
    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // Update the conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      $pull: { messages: messageId },
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error" });
  }
};
